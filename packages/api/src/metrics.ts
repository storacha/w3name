/**
 * This module provides functionality for passing statistics to Cloudflare Analytics Engine
 * for later analysis in Grafana.
 */

import type { Env } from './env'

/**
 * Base class for events to be stored in CF Analytics Engine.
 */
interface AnalyticsEvent {
  // Analytics Engine currently only supports the binding of one dataset per CF Worker, so we're
  // kind of shoehorning all our different metric types into one "table" (dataset). Hence this
  // 'kind' property, which serves to distinguish the different event types that we're storing.
  kind: string

  /** Returns the data for this event in the format for passing to `writeDataPoint` */
  getAEData: () => object
}

/**
 * Represents the creation of a new w3name record.
 */
export class NameCreationEvent implements AnalyticsEvent {
  readonly kind = 'record_creation'

  getAEData () {
    return {
      blobs: [this.kind],
      doubles: [],
      indexes: []
    }
  }
}

/**
 * Represents the update of an existing w3name record.
 */
export class NameUpdateEvent implements AnalyticsEvent {
  readonly kind = 'record_update'
  name: string // The identifier of the w3name record

  constructor (name: string) {
    this.name = name
  }

  getAEData () {
    return {
      blobs: [this.kind, this.name],
      doubles: [],
      indexes: []
    }
  }
}

/**
 * Represents the resolving (lookup) of a name record.
 */
export class NameLookupEvent implements AnalyticsEvent {
  readonly kind = 'record_lookup'
  name: string // The identifier of the w3name record

  constructor (name: string) {
    this.name = name
  }

  getAEData () {
    return {
      blobs: [this.kind, this.name],
      doubles: [],
      indexes: []
    }
  }
}

/**
 * Hook via which other code can log events to be stored.
 */
export function storeEvent (event: AnalyticsEvent, env: Env, ctx: ExecutionContext) {
  ctx.waitUntil((async () => {
    _storeEvent(event, env)
  })())
}

function _storeEvent (event: AnalyticsEvent, env: Env) {
  env.W3NAME_METRICS.writeDataPoint({
    ...event.getAEData()
  })
}
