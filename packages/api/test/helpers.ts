import * as uint8arrays from 'uint8arrays'
import * as ipns from 'ipns'
import * as Digest from 'multiformats/hashes/digest'
import { identity } from 'multiformats/hashes/identity'
import { base36 } from 'multiformats/bases/base36'
import { CID } from 'multiformats/cid'
import { keys } from 'libp2p-crypto'
import { peerIdFromKeys } from '@libp2p/peer-id'

const libp2pKeyCode = 0x72
const lifetime = 1000 * 60 * 60

export interface NameKeyPair {
  id: string
  privateKey: Uint8Array
}

export async function createNameKeypair (): Promise<NameKeyPair> {
  const privKey = await keys.generateKeyPair('Ed25519', 2048)
  const digest = Digest.create(identity.code, privKey.public.bytes)
  const nameKeyPair: NameKeyPair = {
    id: CID.createV1(libp2pKeyCode, digest).toString(base36),
    privateKey: privKey.bytes
  }
  return nameKeyPair
}

/**
 * @param {Uint8Array} privKey - Private key
 * @param {string} value - IPFS path
 * @param {bigint} seqno - Sequence number
 */
export async function createNameRecord (privKey: Uint8Array, value: string, seqno = 0n): Promise<Uint8Array> {
  const privKeyObj = await keys.unmarshalPrivateKey(privKey)
  // const peerId = await PeerId.createFromPrivKey(privKey)
  const peerId = await peerIdFromKeys(privKeyObj.public.bytes, privKeyObj.bytes)
  const entry = await ipns.create(peerId, uint8arrays.fromString(value), seqno, lifetime)
  return ipns.marshal(entry)
}

/**
 * @param {Uint8Array} privKey - Private key
 * @param {Uint8Array} existingRecord - Current IPNS record
 * @param {string} newValue - IPFS path
 */
export async function updateNameRecord (privKey: Uint8Array, existingRecord: Uint8Array, newValue: string): Promise<Uint8Array> {
  const privKeyObj = await keys.unmarshalPrivateKey(privKey)
  const peerId = await peerIdFromKeys(privKeyObj.public.bytes, privKeyObj.bytes)
  const existingEntry = ipns.unmarshal(existingRecord)
  const newEntry = await ipns.create(
    peerId,
    uint8arrays.fromString(newValue),
    existingEntry.sequence + 1n,
    lifetime
  )
  return ipns.marshal(newEntry)
}
