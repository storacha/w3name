/**
 * This module provides a single entrypoint for consuming message from Cloudflare Queues.
 * We might use queues for multiple different things, but (at least currently, Nov 2022) a CF
 * Worker appears to only be able to have a single entrypoint (called `queue`) for consuming
 * messages from all queues. So this acts as a dispatcher, sending messages to the relevant
 * consumer function for the queue.
 */

import type { Env } from './env'
import { metricsQueueConsumer } from './metrics'

export async function queue (batch: MessageBatch<any>, env: Env) {
  if (batch.queue === 'metrics-updates') {
    await metricsQueueConsumer(batch, env)
  }
  throw Error(`Unknown message batch queue: '${String(batch.queue)}'.`)
}
