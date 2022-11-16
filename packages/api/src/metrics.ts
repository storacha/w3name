import type { Env } from './env'

// This module provides functionality for passing statistics to an external Prometheus instance, so
// that those stats can then be viewed in Grafana.

// Some of the stats are stored in a single Durable Object. So to avoid contention on that object,
// we store an in-memory cache of the updates and then write them to the DO every few seconds.
// There is a small chance that the CF Worker instance could be killed before the commit to the DO
// happens, but hopefully that's rare, and is probably a price worth paying for the vast
// scalability improvement.

/** Defines the set of statistics which we store in the MetricsStore Durable Object. */
class GlobalMetrics {
  // This is the number that have been *created*, not the number that necessarily exist.
  recordsCreated: number = 0
}

/** A cache of updates to be applied to the MetricsStore Durable Object. */
let UPDATES_CACHE = new GlobalMetrics()
let CACHE_COMMIT_TIMEOUT: NodeJS.Timer | null = null
const CACHE_COMMIT_INTERVAL_MS = 5000

// There is only one MetricsStore DO, so we hard-code its ID.
const METRICS_STORE_ID = '1'

/**
 * This should be called each time a name record is *created*.
 */
export function incrementCreationCounter (env: Env) {
  // console.error('incrementCreationCounter')
  UPDATES_CACHE.recordsCreated++
  if (CACHE_COMMIT_TIMEOUT === null) {
    // Rather than using setTimeout here, we should possibly use the ctx.waitUntil() facility.
    // Although I'm not sure how we'd do our batching of updates with that aproach, so maybe some
    // combination of the two.
    // See also the comments in commitCacheToDb about awaiting the `fetch` call.
    CACHE_COMMIT_TIMEOUT = setTimeout(commitCacheToDb, CACHE_COMMIT_INTERVAL_MS, env)
  }
}

function commitCacheToDb (env: Env) {
  // Grab the current set of pending updates and reset the cache
  const updates = UPDATES_CACHE
  UPDATES_CACHE = new GlobalMetrics()
  CACHE_COMMIT_TIMEOUT = null
  const objId = env.METRICS_STORE.idFromName(METRICS_STORE_ID)
  const obj = env.METRICS_STORE.get(objId)
  const request = new Request('/update', { method: 'PUT', body: JSON.stringify(updates) })
  // We should possibly `await` this, but in the current setup we can't await it because we would
  // have to make this function async, which then won't allow it to be called by setTimeout.
  void obj.fetch(request)
}

/**
 * Singleton Durable Object for storing global metrics which can't be inferred directly from the
 * NameRecord Durable Objects (or anything else).
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
