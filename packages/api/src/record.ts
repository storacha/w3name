import type { Env } from './env'
import { jsonResponse } from './utils/json-response'
import fetch from '@web-std/fetch'

export interface IPNSRecordData {
  key: string
  record: string
  hasV2Sig: boolean
  seqno: string
  validity: string
}

const REBROADCAST_INTERVAL_MS = 12 * 60 * 60 * 1000
const PUBLISHER_ENDPOINT_URL = 'http://localhost:8000'
const PUBLISHER_AUTH_SECRET = '123456'

export function canOverwrite (current: IPNSRecordData, candidate: IPNSRecordData): boolean {
  // Logic copied from https://github.com/ipfs/go-ipns/blob/a8379aa25ef287ffab7c5b89bfaad622da7e976d/ipns.go#L325

  if (current.hasV2Sig && !candidate.hasV2Sig) {
    return false
  }

  if (candidate.hasV2Sig && !current.hasV2Sig) {
    return true
  }

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
 * hasV2Sig
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
    const map: Map<string, any> = await this.state.storage.get(['key', 'record', 'hasV2Sig', 'seqno', 'validity'])

    // Values will be set to undefined if the record was not created prior to fetching it
    const record: IPNSRecordData = {
      key: map.get('key'),
      record: map.get('record'),
      hasV2Sig: map.get('hasV2Sig'),
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
        hasV2Sig: payload.hasV2Sig,
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

    if (this.env.REBROADCAST_INTERVAL_MS > 0) {
      await this.state.storage.setAlarm(this.rebroadcastScheduledTime)
    }

    const data = await this.getIPNSRecordData()

    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(this.publisherEndpointURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: this.publisherEndpointToken
        }
      })

      if (response.ok) {
        await this.state.storage.put('lastRebroadcast', now.toISOString())
      }
    } catch (error) {
      // Log error
      throw error
    }
  }

  async getIPNSRecordData (): Promise<IPNSRecordData> {
    // Using noCache as it is important to always get the latest record
    const map: Map<string, any> = await this.state.storage.get(
      ['key', 'record', 'hasV2Sig', 'seqno', 'validity'], { noCache: true }
    )

    // Values will be set to undefined if the record was not created prior to fetching it
    const data: IPNSRecordData = {
      key: map.get('key'),
      record: map.get('record'),
      hasV2Sig: map.get('hasV2Sig'),
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
