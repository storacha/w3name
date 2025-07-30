import { PreciseDate } from '@google-cloud/precise-date'
import type { Env } from './env.js'
import { jsonResponse } from './utils/response-types.js'

export interface IPNSRecordData {
  key: string
  record: string
  seqno: string
  validity: string
}

const REBROADCAST_INTERVAL_MS = 12 * 60 * 60 * 1000
const PUBLISHER_ENDPOINT_URL = 'http://localhost:8000'
const PUBLISHER_AUTH_SECRET = '123456'

export function canOverwrite (current: IPNSRecordData, candidate: IPNSRecordData): boolean {
  // Logic copied from https://github.com/ipfs/go-ipns/blob/a8379aa25ef287ffab7c5b89bfaad622da7e976d/ipns.go#L325
  // No v1/v2 signature check because IPNS library does not validate v1 only
  // records, and we validate before calling this.

  if (BigInt(candidate.seqno) > BigInt(current.seqno)) {
    return true
  }

  if (BigInt(candidate.seqno) === BigInt(current.seqno)) {
    if (candidate.validity > current.validity) {
      return true
    } else if (candidate.validity === current.validity && candidate.record.length > current.record.length) {
      return true
    }
  }

  return false
}

/**
 * A Cloudflare Durable Object. Each instance is an IPNS record.
 * The following attributes are kept in the storage:
 * key: base36 "libp2p-key" encoding of the public key
 * record: the serialized IPNS record - base64 encoded
 * seqno
 * validity
 * lastRebroadcast: the last rebroadcast request (update by the alarm handler)
 */
export class IPNSRecord {
  state: DurableObjectState
  env: Env

  constructor (state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
  }

  async fetch (request: Request) {
    // Make sure we set an alarm for the next rebroadcast
    const currentAlarm = await this.state.storage.getAlarm()
    const map: Map<string, any> = await this.state.storage.get(['key', 'record', 'seqno', 'validity'])

    // Values will be set to undefined if the record was not created prior to fetching it
    const record: IPNSRecordData = {
      key: map.get('key'),
      record: map.get('record'),
      seqno: map.get('seqno'),
      validity: map.get('validity')
    }

    if (currentAlarm === null) {
      await this.state.storage.setAlarm(this.rebroadcastScheduledTime)
    }

    const now = new Date()

    if (request.method === 'PUT' || request.method === 'POST') {
      const payload: IPNSRecordData = await request.json()
      // Setting undefined values as default if not in the payload
      const data = {
        key: payload.key,
        record: payload.record,
        seqno: payload.seqno,
        validity: payload.validity,
        lastRebroadcast: now.toISOString()
      }

      if (record.key !== undefined && !canOverwrite(record, data)) {
        return jsonResponse(JSON.stringify({ message: 'invalid record: the record is outdated.' }), 400)
      }

      await this.state.storage.put(data)

      return jsonResponse(JSON.stringify(data), 200)
    }

    const data = await this.getIPNSRecordData()

    if (data.key === undefined || data.record === undefined) {
      return jsonResponse(JSON.stringify({}), 404)
    }

    return jsonResponse(JSON.stringify(data), 200)
  }

  async alarm () {
    const now = new Date()

    // For safety, we set the alarm as our first order of business, so that an error in
    // any subsequent code doesn't prevent the alarm from being set, as that would then
    // make our record lost in abyss, only to be rebroadcast if/when it's updated via
    // `fetch`.
    if (this.env.REBROADCAST_INTERVAL_MS > 0) {
      await this.state.storage.setAlarm(this.rebroadcastScheduledTime)
    }

    const data = await this.getIPNSRecordData()

    if (new PreciseDate(data.validity).getTime() < Date.now()) {
      // The record has expired, so there's no need to keep on republishing it.
      // If it gets updated (via `fetch`) then that will restart the alarm process.
      await this.state.storage.deleteAlarm()
      return
    }

    try {
      const response = await fetch(this.publisherEndpointURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: this.publisherEndpointToken
        }
      })

      // Do not try republish if client error - it won't succeed.
      if (response.status === 400) {
        await this.state.storage.deleteAlarm()
        return
      }

      if (response.ok) {
        await this.state.storage.put('lastRebroadcast', now.toISOString())
      }
    } catch (error) {
      throw new Error(`rebroadcasting ${data.key} to ${this.publisherEndpointURL}`, { cause: error })
    }
  }

  async getIPNSRecordData (): Promise<IPNSRecordData> {
    // Using noCache as it is important to always get the latest record
    const map: Map<string, any> = await this.state.storage.get(
      ['key', 'record', 'seqno', 'validity'], { noCache: true }
    )

    // Values will be set to undefined if the record was not created prior to fetching it
    const data: IPNSRecordData = {
      key: map.get('key'),
      record: map.get('record'),
      seqno: map.get('seqno'),
      validity: map.get('validity')
    }

    return data
  }

  get publisherEndpointURL (): string {
    if (this.env.PUBLISHER_ENDPOINT_URL !== null && this.env.PUBLISHER_ENDPOINT_URL !== '') {
      return this.env.PUBLISHER_ENDPOINT_URL
    }
    return PUBLISHER_ENDPOINT_URL
  }

  get rebroadcastScheduledTime (): number {
    let interval = REBROADCAST_INTERVAL_MS
    if (!Number.isNaN(this.env.REBROADCAST_INTERVAL_MS)) {
      interval = Number(this.env.REBROADCAST_INTERVAL_MS)
    }
    return Date.now() + interval
  }

  get publisherEndpointToken (): string {
    if (this.env.PUBLISHER_AUTH_SECRET !== null && this.env.PUBLISHER_AUTH_SECRET !== '') {
      return this.env.PUBLISHER_AUTH_SECRET
    }
    return PUBLISHER_AUTH_SECRET
  }
}
