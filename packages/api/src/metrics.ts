/**
 * This module provides functionality for passing statistics to an external Prometheus instance, so
 * that those stats can then be viewed in Grafana.
 *
 * Some of the stats are stored in a single Durable Object. So to avoid contention on that object,
 * we use a Cloudflare Queue to send the updates to, and then we consume those updates from the
 * queue in batches so that we can apply potentially thousands of increments in a single operation,
 * thereby avoiding contention on the singleton Durable Object.
 */

import type { Env } from './env'
import type { MessageBatch } from './queue-types'
import { jsonResponse } from './utils/response-types'

/** Defines the set of statistics which we store in the MetricsStore Durable Object. */
class GlobalMetrics {
  // This is the number that have been *created*, not the number that necessarily exist.
  recordsCreated: number = 0
}

// There is only one MetricsStore DO, so we hard-code its ID.
const METRICS_STORE_ID = '1'

/**
 * This should be called each time a name record is *created*.
 */
export function incrementCreationCounter (env: Env, ctx: ExecutionContext) {
  const update = new GlobalMetrics()
  update.recordsCreated = 1
  ctx.waitUntil(env.METRICS_QUEUE.send(update))
}

/**
 * This is the handler which messages from our Cloudflare queue are routed to.
 */
export async function metricsQueueConsumer (batch: MessageBatch<GlobalMetrics>, env: Env) {
  // Combine the updates into a single update to be applied to the Durable Object.
  const consolidatedUpdate = new GlobalMetrics()
  for (const message of batch.messages) {
    const update = message.body
    Object.keys(update).forEach((key) => {
      // This is currently only built to work with metrics which are numbers, which might not be
      // the case for all future properties that we add.
      const value: number = update[key as keyof GlobalMetrics]
      if (value !== 0) {
        consolidatedUpdate[key as keyof GlobalMetrics] += value
      }
    })
    // Now apply the consolidated updates to the Durable Object
    const objId = env.METRICS_STORE.idFromName(METRICS_STORE_ID)
    const obj = env.METRICS_STORE.get(objId)
    const request = new Request(
      '/update',
      { method: 'PUT', body: JSON.stringify(consolidatedUpdate) }
    )
    await obj.fetch(request)
  }
}

/**
 * Singleton Durable Object for storing global metrics which can't be inferred directly from the
 * NameRecord Durable Objects (or anything else), and hence need their own storage.
 */
export class MetricsStore {
  state: DurableObjectState
  env: Env

  constructor (state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
  }

  async fetch (request: Request) {
    if (request.method === 'GET') {
      const metrics = await this.getData()
      return jsonResponse(JSON.stringify(metrics))
    } else if (request.method === 'PUT' && request.url === '/update') {
      const updates: GlobalMetrics = await request.json()
      const keys = Object.keys(updates)
      const metrics = await this.getData()
      keys.forEach((key) => {
        // This assumes that the metrics are all numbers. We might need to make this more
        // sophisticated in the future.
        metrics[key as keyof GlobalMetrics] += updates[key as keyof GlobalMetrics]
      })
      // await this.state.storage.put(metrics)
      await this.putData(metrics)
      return new Response()
    }
  }

  /** Fetch the values which are stored in this DO as a GlobalMetrics, ensuring to init all missing
   * values to zero (or appropriate default) to avoid `undefined` values.
   */
  private async getData (): Promise<GlobalMetrics> {
    const metrics = new GlobalMetrics() // Let this take care of initialising values
    const keys = Object.keys(metrics)
    const values: Map<string, number | undefined> = await this.state.storage.get(keys)
    values.forEach((value, key) => {
      if (value !== undefined) {
        metrics[key as keyof GlobalMetrics] = value
      }
    })
    return metrics
  }

  /** Given a GlobalMetrics object, save its values to the DO. */
  private async putData (metrics: GlobalMetrics): Promise<void> {
    const map = new Map()
    Object.keys(metrics).forEach((key) => {
      map.set(key, metrics[key as keyof GlobalMetrics])
    })
    await this.state.storage.put(Object.fromEntries(map))
  }
}

/**
 * Retrieves metrics from the Durable Object and serves them in the appropriate format for
 * Prometheus to consume.
 */
export async function serveMetrics (request: Request, env: Env) {
  const objId = env.METRICS_STORE.idFromName(METRICS_STORE_ID)
  const obj = env.METRICS_STORE.get(objId)
  const retrievalRequest = new Request(new URL('/', 'http://whatever'), { method: 'GET' })
  const retrievalResponse = await obj.fetch(retrievalRequest)
  const metrics: GlobalMetrics = await retrievalResponse.json()

  const prometheusData = [
    '# HELP w3name_name_creation_total Total names created.',
    '# TYPE w3name_name_creation_total counter',
    `w3name_name_creation_total ${metrics.recordsCreated}`
    // More metrics will be added here
  ].join('\n')
  return new Response(prometheusData)
}
