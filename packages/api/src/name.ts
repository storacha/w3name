/* eslint-env serviceworker */

import { base36 } from 'multiformats/bases/base36'
import { CID } from 'multiformats/cid'
// import * as ed25519 from './utils/crypto/ed25519.js'
// import { PreciseDate } from '@google-cloud/precise-date'
import { HTTPError } from './errors'
// import { Request } from 'itty-router'
import type { Env } from '.'
import { NameRoom, BroadcastData } from './broadcast'
// import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
// import * as ipns from 'ipns'

const libp2pKeyCode = 0x72

export async function nameGet (request: Request, env: Env): Promise<Response> {
  // @ts-expect-error, TODO: figure out if we can make an union of itty-router Request and Cloudflare Request
  const key = request.params?.key

  if (key !== undefined) {
    const { code } = CID.parse(key, base36)
    if (code !== libp2pKeyCode) {
      throw new HTTPError(`invalid key, expected: ${libp2pKeyCode} codec code but got: ${code}`, 400)
    }
  } else {
    throw new HTTPError(`missing key, expected: ${libp2pKeyCode} codec code`, 400)
  }

  // const rawRecord = await env.db.resolveNameRecord(key)
  // if (!rawRecord) {
  //   throw new HTTPError(`record not found for key: ${key}. Only keys published using the Web3.Storage API may be resolved here.`, 404)
  // }

  // const { value } = ipns.unmarshal(uint8ArrayFromString(rawRecord, 'base64pad'))

  return new Response(JSON.stringify({
    value: 'todo', // uint8ArrayToString(value),
    record: 'todo' // rawRecord
  }))
}

export async function namePost (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // @ts-expect-error, TODO: figure out if we can make an union of itty-router Request and Cloudflare Request
  const key = request.params?.key

  if (key === undefined) {
    throw new HTTPError('missing key', 400)
  }

  const keyCid = CID.parse(key, base36)

  if (keyCid.code !== libp2pKeyCode) {
    throw new HTTPError(`invalid key code: ${keyCid.code}`, 400)
  }

  // const record = await request.text()
  // const entry = ipns.unmarshal(uint8ArrayFromString(record, 'base64pad'))
  // const pubKey = ed25519.unmarshalPublicKey(Digest.decode(keyCid.multihash.bytes).bytes)

  // if (entry.pubKey && !ed25519.unmarshalPublicKey(entry.pubKey).equals(pubKey)) {
  //   throw new HTTPError('embedded public key mismatch', 400)
  // }

  // await ipns.validate(pubKey, entry)

  // await env.db.publishNameRecord(
  //   key,
  //   record,
  //   Boolean(entry.signatureV2),
  //   entry.sequence,
  //   new PreciseDate(uint8ArrayToString(entry.validity)).getFullTime()
  // )

  // ctx.waitUntil((async () => {
  //   const record = await env.db.resolveNameRecord(key)
  //   if (!record) return // shouldn't happen
  //   const { value } = ipns.unmarshal(uint8ArrayFromString(record, 'base64pad'))
  //   const data = { key, value: uint8ArrayToString(value), record }
  //   await NameRoom.broadcast(request, env.NAME_ROOM, key, data)
  //   await NameRoom.broadcast(request, env.NAME_ROOM, '*', data)
  // })())

  const data: BroadcastData = {
    value: '',
    record: 'hello'
  }

  ctx.waitUntil((async () => {
    await NameRoom.broadcast(request, env.NAME_ROOM, key, data)
    await NameRoom.broadcast(request, env.NAME_ROOM, '*', data)
  })())

  return new Response(JSON.stringify({ id: key }), { status: 202 })
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

  const keyCid = CID.parse(key, base36)
  if (keyCid.code !== libp2pKeyCode) {
    throw new HTTPError(`invalid key code: ${keyCid.code}`, 400)
  }

  return await NameRoom.join(request, env.NAME_ROOM, key)
}
