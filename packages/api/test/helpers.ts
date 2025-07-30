import { base36 } from 'multiformats/bases/base36'
import { keys } from '@libp2p/crypto'
import { PrivateKey } from '@libp2p/interface'
import * as ipns from 'ipns'

const lifetime = 1000 * 60 * 60

export interface NameKeyPair {
  id: string
  privateKey: PrivateKey
}

export async function createNameKeypair (): Promise<NameKeyPair> {
  const privKey = await keys.generateKeyPair('Ed25519', 2048)
  const nameKeyPair: NameKeyPair = {
    id: privKey.publicKey.toCID().toString(base36),
    privateKey: privKey
  }
  return nameKeyPair
}

export async function createNameRecord (privKey: PrivateKey, value: string, seqno = 0n): Promise<Uint8Array> {
  const entry = await ipns.createIPNSRecord(privKey, value, seqno, lifetime)
  return ipns.marshalIPNSRecord(entry)
}

export async function updateNameRecord (privKey: PrivateKey, existingRecord: Uint8Array, newValue: string): Promise<Uint8Array> {
  const existingEntry = ipns.unmarshalIPNSRecord(existingRecord)
  return await createNameRecord(privKey, newValue, existingEntry.sequence + 1n)
}
