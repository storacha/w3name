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
 * This is the handler which Cloudflare sends our queue messages to.
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
    if (request.method === 'PUT' && request.url === '/update') {
      const updates: GlobalMetrics = await request.json()
      const keys = Object.keys(updates)
      const metrics: Map<string, number | undefined> = await this.state.storage.get(keys)
      keys.forEach((key) => {
        // This assumes that the metrics are all numbers. We might need to make this more
        // sophisticated in the future.
        let value = metrics.get(key)
        if (value === undefined) {
          value = updates[key as keyof GlobalMetrics]
        } else {
          value += updates[key as keyof GlobalMetrics]
        }
        metrics.set(key, value)
      })
      await this.state.storage.put(Object.fromEntries(metrics))
    }
  }
}
