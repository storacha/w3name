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
const BROADCAST_ENDPOINT = 'https://ipns-publisher.w3name.com'

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
      await this.state.storage.setAlarm(Date.now() + REBROADCAST_INTERVAL_MS)
    }

    if (request.method === 'PUT') { 
      const payload: IPNSRecordData = await request.json()
      // Setting undefined values as default if not in the payload
      const data = {
        key: payload.key,
        record: payload.record,
        hasV2Sig: payload.hasV2Sig,
        seqno: payload.seqno,
        validity: payload.validity
      }
      
      if (record.key !== undefined && !canOverwrite(record, data)) {
        return jsonResponse(JSON.stringify({ message: 'invalid record: the record is outdated.' }), 400)
      }
      
      await this.state.storage.put(data)

      return jsonResponse(JSON.stringify(data), 200)
    }

    const data = this.getIPNSRecordData()

    return jsonResponse(JSON.stringify(data), 200)
  }

  async alarm () {
    const now = new Date()
    await this.state.storage.setAlarm(Date.now() + REBROADCAST_INTERVAL_MS)

    const data = await this.getIPNSRecordData()

    const response = await fetch(BROADCAST_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (response.ok === true) {
      await this.state.storage.put('lastRebroadcast', now.toISOString())
    }
  }

  async getIPNSRecordData (): Promise<IPNSRecordData> {
    const map: Map<string, any> = await this.state.storage.get(['key', 'record', 'hasV2Sig', 'seqno', 'validity'])

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
}
