import { base36 } from 'multiformats/bases/base36'
import { CID } from 'multiformats/cid'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { HTTPError } from './errors'
import { jsonResponse } from './utils/json-response'
import { keys } from 'libp2p-crypto'
import { NameRoom, BroadcastData } from './broadcast'
import { PreciseDate } from '@google-cloud/precise-date'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { validate as ipnsValidate } from 'ipns/validator'
import * as Digest from 'multiformats/hashes/digest'
import * as ipns from 'ipns'
import type { Env } from '.'
import type { IPNSRecordData } from './record'

const libp2pKeyCode = 0x72

function validateCIDKeyCode (cid: CID): void {
  if (cid.code !== libp2pKeyCode) {
    throw new HTTPError(`invalid key, expected: ${libp2pKeyCode} codec code but got: ${cid.code}`, 400)
  }
}

function parseAndValidateCID (key: string): CID {
  let cid: CID
  try {
    cid = CID.parse(key, base36)
  } catch (err) {
    throw new HTTPError('invalid key', 400)
  }
  validateCIDKeyCode(cid)
  return cid
}

export async function nameGet (request: Request, env: Env): Promise<Response> {
  // @ts-expect-error, TODO: figure out if we can make an union of itty-router Request and Cloudflare Request
  const key: string = request.params?.key

  if (key === undefined) {
    throw new HTTPError(`missing key, expected: ${libp2pKeyCode} codec code`, 400)
  }

  parseAndValidateCID(key)

  const objId = env.IPNS_RECORD.idFromName(key)
  const obj = env.IPNS_RECORD.get(objId)
  const url = new URL(request.url)

  url.pathname = key

  try {
    const objGetResponse = await obj.fetch(url.toString())
    const ipnsRecord: IPNSRecordData = await objGetResponse.json()
    const rawRecord = ipnsRecord.record

    if (ipnsRecord.record === undefined) {
      throw new HTTPError(`record not found for key: ${key}. Only keys published using the w3name API may be resolved here.`, 404)
    }

    const { value } = ipns.unmarshal(uint8ArrayFromString(rawRecord, 'base64pad'))

    return jsonResponse(
      JSON.stringify({
        value: uint8ArrayToString(value),
        record: rawRecord
      })
    )
  } catch (error) {
    if (error instanceof HTTPError) {
      throw (error)
    } else {
      throw new HTTPError('please try again', 500)
    }
  }
}

export async function namePost (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // @ts-expect-error, TODO: figure out if we can make an union of itty-router Request and Cloudflare Request
  const key = request.params?.key

  if (key === undefined) {
    throw new HTTPError('missing key', 400)
  }

  const keyCid = parseAndValidateCID(key)
  const record = await request.text()
  const entry = ipns.unmarshal(uint8ArrayFromString(record, 'base64pad'))
  const pubKey = keys.unmarshalPublicKey(Digest.decode(keyCid.multihash.bytes).bytes)

  try {
    await ipnsValidate(pubKey, entry)
  } catch (error: any) {
    if (error instanceof Error) {
      throw new HTTPError(`invalid ipns entry: ${error.message}`, 400)
    }
  }

  if (entry.pubKey !== undefined && !keys.unmarshalPublicKey(entry.pubKey).equals(pubKey)) {
    throw new HTTPError('embedded public key mismatch', 400)
  }

  const { value } = ipns.unmarshal(uint8ArrayFromString(record, 'base64pad'))

  const recordData = {
    key, // base36 "libp2p-key" encoding of the public key
    record, // the serialized IPNS record - base64 encoded
    hasV2Sig: Boolean(entry.signatureV2),
    seqno: entry.sequence.toString(),
    validity: new PreciseDate(uint8ArrayToString(entry.validity)).getFullTime().toString()
  }

  const broadcastData: BroadcastData = {
    key,
    value: uint8ArrayToString(value),
    record
  }

  const objId = env.IPNS_RECORD.idFromName(key)
  const obj = env.IPNS_RECORD.get(objId)
  const postRequest = new Request(request.url, { method: 'PUT', body: JSON.stringify(recordData) })

  try {
    const objPostResponse = await obj.fetch(postRequest)

    if (objPostResponse.ok) {
      ctx.waitUntil((async () => {
        await NameRoom.broadcast(request, env.NAME_ROOM, key, broadcastData)
        await NameRoom.broadcast(request, env.NAME_ROOM, '*', broadcastData)
      })())

      return jsonResponse(JSON.stringify({ id: key }), 202)
    }
  } catch (error) {
    // pass
  }

  return jsonResponse(JSON.stringify({ message: 'please try again' }), 500)
}

export async function nameWatchGet (request: Request, env: Env): Promise<Response> {
  // @ts-expect-error, TODO: figure out if we can make an union of itty-router Request and Cloudflare Request
  const key = request.params?.key

  if (key === undefined) {
    throw new HTTPError('missing key code', 400)
  }

  if (key === '*') {
    return await NameRoom.join(request, env.NAME_ROOM, '*')
  }

  parseAndValidateCID(key)

  return await NameRoom.join(request, env.NAME_ROOM, key)
}
