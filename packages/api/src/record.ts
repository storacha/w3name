import type { Env } from './env'
import { jsonResponse } from './utils/json-response'

export interface IPNSRecordData {
  key: string
  record: string
  hasV2Sig: boolean
  seqno: string
  validity: string
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
      await this.state.storage.put(data)
      return jsonResponse(JSON.stringify(data), 200)
    }

    const map: Map<string, any> = await this.state.storage.get(['key', 'record', 'hasV2Sig', 'seqno', 'validity'])

    // Values will be set to undefined if the record was not created prior to fetching it
    const data: IPNSRecordData = {
      key: map.get('key'),
      record: map.get('record'),
      hasV2Sig: map.get('hasV2Sig'),
      seqno: map.get('seqno'),
      validity: map.get('validity')
    }

    return jsonResponse(JSON.stringify(data), 200)
  }
}
