/**
 * A client library for the w3name - IPNS over HTTP API. It provides a
 * convenient interface for creating names, making revisions to name records,
 * and publishing and resolving them via the HTTP API.
 *
 * @example
 * ```js
 * import * as Name from 'w3name'
 *
 * const name = await Name.create()
 *
 * console.log('Name:', name.toString())
 * // e.g. k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt
 *
 * // The value to publish
 * const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
 * const revision = await Name.v0(name, value)
 *
 * // Publish the revision
 * await Name.publish(revision, name.key)
 *
 * // Resolve the latest value
 * await Name.resolve(name)
 * ```
 * @module
 */

import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { keys, PrivateKey, PublicKey } from 'libp2p-crypto'
import { identity } from 'multiformats/hashes/identity'
import { base36 } from 'multiformats/bases/base36'
import { CID } from 'multiformats/cid'
import * as Digest from 'multiformats/hashes/digest'
import * as ipns from 'ipns'
import * as cbor from 'cborg'
import W3NameService from './service.js'
import fetch from '@web-std/fetch'

const libp2pKeyCode = 0x72
const ONE_YEAR = 1000 * 60 * 60 * 24 * 365

const defaultValidity = () => new Date(Date.now() + ONE_YEAR).toISOString()

const defaultService = new W3NameService()
/**
 * Name is an IPNS key ID.
 */
export class Name {
  _pubKey: PublicKey

  constructor (pubKey: PublicKey) {
    /**
     * @private
     */
    this._pubKey = pubKey
  }

  get bytes () {
    const digest = Digest.create(identity.code, this._pubKey.bytes)
    return CID.createV1(libp2pKeyCode, digest).bytes
  }

  toString () {
    const digest = Digest.create(identity.code, this._pubKey.bytes)
    return CID.createV1(libp2pKeyCode, digest).toString(base36)
  }
}

/**
 * WritableName is a Name that has a signing key associated with it such that
 * new IPNS record revisions can be created and signed for it.
 */
export class WritableName extends Name {
  _privKey: PrivateKey

  constructor (privKey: PrivateKey) {
    super(privKey.public)
    /**
     * @private
     */
    this._privKey = privKey
  }

  get key () {
    return this._privKey
  }
}

/**
 * Create a new name with associated signing key that can be used to create and
 * publish IPNS record revisions.
 */
export async function create () {
  const privKey = await keys.generateKeyPair('Ed25519', 2048)
  return new WritableName(privKey)
}

/**
 * Parses string name to readable name.
 */
export function parse (name: string) {
  const keyCid = CID.parse(name, base36)
  if (keyCid.code !== libp2pKeyCode) {
    throw new Error(`invalid key, expected ${libp2pKeyCode} codec code but got ${keyCid.code}`)
  }
  const pubKey = keys.unmarshalPublicKey(Digest.decode(keyCid.multihash.bytes).bytes)
  return new Name(pubKey)
}

/**
 * Create a name from an existing signing key (private key).
 */
export async function from (key: Uint8Array) {
  const privKey = await keys.unmarshalPrivateKey(key)
  return new WritableName(privKey)
}

/**
 * Create an initial version of the IPNS record for the passed name, set to the
 * passed value.
 */
export async function v0 (name: Name, value: string) {
  return new Revision(name, value, 0n, defaultValidity())
}

/**
 * Create a revision of the passed IPNS record by incrementing the sequence
 * number and changing the value.
 */
export async function increment (revision: Revision, value: string): Promise<Revision> {
  const seqno = revision.sequence + 1n
  return new Revision(revision.name, value, seqno, defaultValidity())
}

/**
 * A representation of a IPNS record that may be initial or revised.
 */
export class Revision {
  _name: Name
  _value: string
  _sequence: bigint
  _validity: string

  constructor (name: Name, value: string, sequence: bigint, validity: string) {
    this._name = name
    if (typeof value !== 'string') {
      throw new Error('invalid value')
    }
    this._value = value
    if (typeof sequence !== 'bigint') {
      throw new Error('invalid sequence number')
    }
    this._sequence = sequence
    if (typeof validity !== 'string') {
      throw new Error('invalid validity')
    }
    // TODO: validate format
    this._validity = validity
  }

  get name () {
    return this._name
  }

  get value () {
    return this._value
  }

  get sequence () {
    return this._sequence
  }

  /**
   * RFC3339 date string.
   */
  get validity () {
    return this._validity
  }

  /**
   * Note: if `revision.name` is a `WritableName` then signing key data will be
   * lost. i.e. the private key is not encoded.
   */
  static encode (revision: Revision) {
    return cbor.encode({
      name: revision._name.toString(),
      value: revision._value,
      sequence: revision._sequence,
      validity: revision._validity
    })
  }

  static decode (bytes: Uint8Array) {
    const raw = cbor.decode(bytes)
    const name = parse(raw.name)
    return new Revision(name, raw.value, BigInt(raw.sequence), raw.validity)
  }
}

/**
 * Publish a name revision to W3name.
 *
 * ⚠️ Name records are not _yet_ published to or updated from the IPFS network.
 * Working with name records simply updates the w3name cache of data.
 */
export async function publish (revision: Revision, key: PrivateKey, service: W3NameService = defaultService) {
  const url = new URL(`name/${revision.name.toString()}`, service.endpoint)
  const entry = await ipns.create(
    key,
    uint8ArrayFromString(revision.value),
    revision.sequence,
    new Date(revision.validity).getTime() - Date.now()
  )
  await service.waitForRateLimit()
  await maybeHandleError(fetch(url.toString(), {
    method: 'POST',
    body: uint8ArrayToString(ipns.marshal(entry), 'base64pad')
  }))
}

/**
 * Resolve the current IPNS record revision for the passed name.
 */
export async function resolve (name: Name, service: W3NameService = defaultService): Promise<Revision> {
  const url = new URL(`name/${name.toString()}`, service.endpoint)
  await service.waitForRateLimit()

  const res: globalThis.Response = await maybeHandleError(fetch(url.toString()))
  const { record } = await res.json()

  const entry = ipns.unmarshal(uint8ArrayFromString(record, 'base64pad'))
  const keyCid = CID.decode(name.bytes)
  const pubKey = keys.unmarshalPublicKey(Digest.decode(keyCid.multihash.bytes).bytes)

  await ipns.validate(pubKey, entry)

  return new Revision(
    name,
    uint8ArrayToString(entry.value),
    entry.sequence,
    uint8ArrayToString(entry.validity)
  )
}

async function maybeHandleError (resPromise: Promise<globalThis.Response>): Promise<globalThis.Response> {
  const res = await resPromise
  if (res.ok) return res
  const err = new Error(`unexpected status: ${res.status}`)
  try {
    Object.assign(err, await res.json())
  } catch {}
  throw err
}
