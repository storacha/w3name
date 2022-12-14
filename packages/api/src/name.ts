import { base36 } from 'multiformats/bases/base36'
import { CID } from 'multiformats/cid'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { HTTPError } from './errors'
import { jsonResponse } from './utils/response-types'
import { keys, PublicKey } from 'libp2p-crypto'
import { NameRoom, BroadcastData } from './broadcast'
import { PreciseDate } from '@google-cloud/precise-date'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { validate as ipnsValidate } from 'ipns/validator'
import * as Digest from 'multiformats/hashes/digest'
import * as ipns from 'ipns'
import { NameCreationEvent, NameLookupEvent, NameUpdateEvent, storeEvent } from './metrics'
import type { Env } from './env'
import type { IPNSRecordData } from './record'

const libp2pKeyCode = 0x72

function validateCIDKeyCode (cid: CID): void {
  if (cid.code !== libp2pKeyCode) {
    throw new HTTPError(`Invalid key, expected: ${libp2pKeyCode} codec code but got: ${cid.code}`, 400)
  }
}

function parseAndValidateCID (key: string): CID {
  let cid: CID
  try {
    cid = CID.parse(key, base36)
  } catch (err) {
    throw new HTTPError('Invalid key: cannot parse CID.', 400)
  }
  validateCIDKeyCode(cid)
  return cid
}

export async function nameGet (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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

    storeEvent(new NameLookupEvent(key), env, ctx)
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
      const errorString = error instanceof Error
        ? error.message
        : 'unknown error'
      throw new HTTPError(`Unable to retrieve name. ${errorString}`, 500)
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
  let entry: ipns.IPNSEntry | undefined
  let pubKey: PublicKey | undefined

  try {
    entry = ipns.unmarshal(uint8ArrayFromString(record, 'base64pad'))
    pubKey = keys.unmarshalPublicKey(Digest.decode(keyCid.multihash.bytes).bytes)
    await ipnsValidate(pubKey, entry)
  } catch (error: any) {
    if (error instanceof Error) {
      throw new HTTPError(`invalid ipns entry: ${error.message}`, 400)
    }
    throw new HTTPError('invalid ipns entry: Unknown error', 400)
  }

  if (entry !== undefined && pubKey !== undefined) {
    if (entry.pubKey !== undefined && !keys.unmarshalPublicKey(entry.pubKey).equals(pubKey)) {
      throw new HTTPError('embedded public key mismatch', 400)
    }

    const recordData: IPNSRecordData = {
      key, // base36 "libp2p-key" encoding of the public key
      record, // the serialized IPNS record - base64 encoded
      hasV2Sig: Boolean(entry.signatureV2),
      seqno: entry.sequence.toString(),
      validity: new PreciseDate(uint8ArrayToString(entry.validity)).getFullTime().toString()
    }

    const broadcastData: BroadcastData = {
      key,
      value: uint8ArrayToString(entry.value),
      record
    }

    const objId = env.IPNS_RECORD.idFromName(key)
    const obj = env.IPNS_RECORD.get(objId)
    const postRequest = new Request(request.url, { method: 'PUT', body: JSON.stringify(recordData) })

    try {
      const objPostResponse: Response = await obj.fetch(postRequest)

      if (objPostResponse.status === 201) {
        storeEvent(new NameCreationEvent(), env, ctx)
      } else if (objPostResponse.status === 200) {
        storeEvent(new NameUpdateEvent(key), env, ctx)
      }

      if (objPostResponse.ok) {
        ctx.waitUntil((async () => {
          await NameRoom.broadcast(request, env.NAME_ROOM, key, broadcastData)
          await NameRoom.broadcast(request, env.NAME_ROOM, '*', broadcastData)
          const response = await fetch(env.PUBLISHER_ENDPOINT_URL, {
            method: 'POST',
            body: JSON.stringify(recordData),
            headers: {
              Authorization: env.PUBLISHER_AUTH_SECRET
            }
          })

          if (!response.ok) {
            throw new Error('Error when publishing to the IPNS Publisher endpoint')
          }
        })())
        return jsonResponse(JSON.stringify({ id: key }), 202)
      } else {
        // Proxy the error response from the Durable Object
        return objPostResponse
      }
    } catch (error) {
      throw new Error(`Unable to broadcast: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
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

export async function raiseErrorGet (request: Request, env: Env): Promise<Response> {
  const url: URL = new URL(request.url)

  if (url.searchParams.get('http') !== undefined) {
    throw new HTTPError('testing http error reporting')
  }

  throw new Error('testing error reporting')
}
