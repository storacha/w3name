import { base36 } from 'multiformats/bases/base36'
import { CID } from 'multiformats/cid'
import { createNameKeypair, createNameRecord, updateNameRecord, NameKeyPair } from './helpers.js'
import { identity } from 'multiformats/hashes/identity'
import { keys } from 'libp2p-crypto'
import { Miniflare, Request } from 'miniflare'
import { peerIdFromKeys } from '@libp2p/peer-id'
import * as Digest from 'multiformats/hashes/digest'
import * as ipns from 'ipns'
import * as uint8arrays from 'uint8arrays'
import assert from 'assert/strict'
import pDefer from 'p-defer'
import { endpoint } from './scripts/constants.js'

interface GetKeyResponse {
  value: string
  record: string
}

let mf: Miniflare

async function publishRecord (key: string, record: Uint8Array): Promise<Response> {
  return await mf.dispatchFetch(
    new Request(
      new URL(`name/${key}`, endpoint),
      {
        method: 'POST',
        body: uint8arrays.toString(record, 'base64pad')
      }
    )
  ) as any
}

before((done) => {
  mf = new Miniflare({
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,
    wranglerConfigEnv: 'test',
    modules: true,
    bindings: {
      REBROADCAST_INTERVAL_MS: 0
    }
  })
  done()
})

after(() => mf.dispose())

describe('GET /', () => {
  it('renders index', async () => {
    const response = await mf.dispatchFetch(endpoint)
    const body: { message: string } = await response.json()
    assert.equal(response.status, 200)
    assert.ok(body.message.includes('w3name'))
  })
})

describe('GET /name/:key', () => {
  it('returns an error for an invalid key', async () => {
    const key = '837497jhfd'
    const response = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))
    const body: {message: string} = await response.json()
    assert.equal(response.status, 400)
    assert.ok(body.message.includes('Invalid key'))
  })

  it('returns an error for a key with an invalid code', async () => {
    const keyPair = await keys.generateKeyPair('Ed25519', 2048)
    const digest = Digest.create(identity.code, keyPair.public.bytes)
    const key = CID.createV1(140, digest).toString(base36)
    const response = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))
    const body: {message: string} = await response.json()
    assert.equal(response.status, 400)
    assert.equal(body.message, 'Invalid key, expected: 114 codec code but got: 140')
    assert.strictEqual(response.headers.get('Access-Control-Allow-Origin'), '*')
  })

  it('returns an error for a non-existing key', async () => {
    const keyPair = await keys.generateKeyPair('Ed25519', 2048)
    const digest = Digest.create(identity.code, keyPair.public.bytes)
    const key = CID.createV1(114, digest).toString(base36)
    const response = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))
    const body: {message: string} = await response.json()
    assert.equal(response.status, 404)
    assert.ok(body.message.includes(`record not found for key: ${key}`))
    assert.strictEqual(response.headers.get('Access-Control-Allow-Origin'), '*')
  })
})

describe('POST/GET /name/:key', () => {
  it('returns an error for an invalid key', async () => {
    const key = '837497jhfd'
    const { privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(privateKey, value)
    const response = await publishRecord(key, record)
    const body: {message: string} = await response.json()

    assert.equal(response.status, 400)
    assert.ok(body.message.includes('Invalid key'))
    assert.strictEqual(response.headers.get('Access-Control-Allow-Origin'), '*')
  })

  it('returns an error for a key with an invalid code', async () => {
    const keyPair = await keys.generateKeyPair('Ed25519', 2048)
    const digest = Digest.create(identity.code, keyPair.public.bytes)
    const key = CID.createV1(140, digest).toString(base36)
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(keyPair.bytes, value)
    const response = await publishRecord(key, record)
    const body: {message: string} = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.message, 'Invalid key, expected: 114 codec code but got: 140')
    assert.strictEqual(response.headers.get('Access-Control-Allow-Origin'), '*')
  })

  it.skip('returns an error when there is a public key mismatch', async () => {
    // Implement test
  })

  it('returns an error when there is an ipns record validation problem', async () => {
    // Test that we catch errors raised by `ipns/validator`
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const privKeyObj = await keys.unmarshalPrivateKey(privateKey)
    const peerId = await peerIdFromKeys(privKeyObj.public.bytes, privKeyObj.bytes)
    // Deliberately create an expired entry
    const entry = await ipns.create(peerId, uint8arrays.fromString(value), 0, 0)
    const record = ipns.marshal(entry)
    const response = await publishRecord(key, record)
    const body: {message: string} = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.message, 'invalid ipns entry: record has expired')
    assert.strictEqual(response.headers.get('Access-Control-Allow-Origin'), '*')
  })

  it('publishes value for key', async () => {
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(privateKey, value)

    const publishRes = await publishRecord(key, record)

    assert(publishRes.ok)

    const { id }: { id: string } = await publishRes.json()

    assert.strictEqual(id, key)

    const resolveRes = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))

    assert(resolveRes.ok)

    const resolved: GetKeyResponse = await resolveRes.json()

    assert.strictEqual(resolved.record, uint8arrays.toString(record, 'base64pad'))
    assert.strictEqual(resolved.value, value)
  })

  it('raises an error when the signature version is older', async () => {
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(privateKey, value)
    await publishRecord(key, record)

    // Given an update with a V1 signature
    const privKeyObj = await keys.unmarshalPrivateKey(privateKey)
    const peerId = await peerIdFromKeys(privKeyObj.public.bytes, privKeyObj.bytes)
    // Even if the sequence number is higher, the fact that the signature version is older
    // should prevent it from being valid
    const seqno = 99
    const entry = await ipns.create(peerId, uint8arrays.fromString(value), seqno, 100000)

    delete entry.signatureV2

    const recordV1 = ipns.marshal(entry)
    const publishV1Res = await publishRecord(key, recordV1)
    const body: {message: string} = await publishV1Res.json()

    assert.equal(publishV1Res.status, 400, body.message)
    assert.ok(body.message.includes('invalid record: the record is outdated'), body.message)
  })

  it('raises an error when the sequence number is smaller', async () => {
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const privKeyObj = await keys.unmarshalPrivateKey(privateKey)
    const peerId = await peerIdFromKeys(privKeyObj.public.bytes, privKeyObj.bytes)
    const entry = await ipns.create(peerId, uint8arrays.fromString(value), 10n, 100000)
    const response = await publishRecord(key, ipns.marshal(entry))

    assert.ok(response.ok)

    // Given an update with a smaller sequence number (same signature version and validity)
    const value2 = '/ipfs/bafybeiauyddeo2dfgargy56kwxirquxax003nobtjtjvoqu552oqciudxf'
    const entry2 = await ipns.create(peerId, uint8arrays.fromString(value2), 9n, 100000)

    const updateResponse = await publishRecord(key, ipns.marshal(entry2))
    const body: {message: string} = await updateResponse.json()

    assert.equal(updateResponse.status, 400, body.message)
    assert.ok(body.message.includes('invalid record: the record is outdated'), body.message)
  })

  it('raises an error when overwriting validity with a lower value', async () => {
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const privKeyObj = await keys.unmarshalPrivateKey(privateKey)
    const peerId = await peerIdFromKeys(privKeyObj.public.bytes, privKeyObj.bytes)
    const entry = await ipns.create(peerId, uint8arrays.fromString(value), 1n, 100000)
    const response = await publishRecord(key, ipns.marshal(entry))
    assert.ok(response.ok)

    // Given an update with the same signature version, sequence number and a smaller validity
    const entry2 = await ipns.create(peerId, uint8arrays.fromString(value), 1n, 90000)
    const updateResponse = await publishRecord(key, ipns.marshal(entry2))
    const body: {message: string} = await updateResponse.json()

    assert.equal(updateResponse.status, 400, body.message)
    assert.ok(body.message.includes('invalid record: the record is outdated'), body.message)
  })

  it('raises an error when overwriting with the same record', async () => {
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const privKeyObj = await keys.unmarshalPrivateKey(privateKey)
    const peerId = await peerIdFromKeys(privKeyObj.public.bytes, privKeyObj.bytes)
    const entry = await ipns.create(peerId, uint8arrays.fromString(value), 1n, 100000)
    const response = await publishRecord(key, ipns.marshal(entry))
    assert.ok(response.ok)

    // Given an update with the same record
    const updateResponse = await publishRecord(key, ipns.marshal(entry))
    const body: {message: string} = await updateResponse.json()

    assert.equal(updateResponse.status, 400, body.message)
    assert.ok(body.message.includes('invalid record: the record is outdated'), body.message)
  })
})

describe('GET /name/:key/watch', () => {
  it('watches for publishes to a key', async () => {
    const name0: NameKeyPair = await createNameKeypair()
    const name1: NameKeyPair = await createNameKeypair()
    const name0Value0 = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const name0Value1 = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    const name1Value0 = '/ipfs/bafkreid7fbwjx4swwewit5txzttoja4t4xnkj3rx3q7dlbj76gvixuq35y'
    const name1Value1 = '/ipfs/bafybeihiyjghsq7gob7vj3vurqf5i4eth3h57ixpaajdxtvi7p4snhag2a'
    const name0Record0 = await createNameRecord(name0.privateKey, name0Value0)
    const name0Record1 = await updateNameRecord(name0.privateKey, name0Record0, name0Value1)
    const name1Record0 = await createNameRecord(name1.privateKey, name1Value0)
    const name1Record1 = await updateNameRecord(name1.privateKey, name1Record0, name1Value1)

    const res = await mf.dispatchFetch(
      new Request(
        new URL(`name/${name0.id}/watch`, endpoint),
        {
          headers: { Upgrade: 'websocket' }
        }
      )
    )

    const conn = res.webSocket

    // we're going to publish on two keys, but we're only listening on one
    // so we should only receive 2 messages.
    const expectedMsgCount = 2
    const msgs: Array<(string | ArrayBuffer)> = []
    const deferred = pDefer()

    if (conn != null) {
      conn.accept()

      conn.addEventListener('message', (event) => {
        msgs.push(event.data)
        if (msgs.length >= expectedMsgCount) {
          deferred.resolve()
        }
      })
    }

    try {
      await publishRecord(name0.id, name0Record0)
      // we should NOT receive an update for this key
      await publishRecord(name1.id, name1Record0)
      // we should NOT receive an update for this key
      await publishRecord(name1.id, name1Record1)
      await publishRecord(name0.id, name0Record1)

      // wait for update message to be received
      await deferred.promise

      assert.strictEqual(msgs.length, expectedMsgCount)
      assert.strictEqual(JSON.parse(msgs[0] as string).value, name0Value0)
      assert.strictEqual(JSON.parse(msgs[1] as string).value, name0Value1)
    } finally {
      if (conn != null) {
        conn.close()
      }
    }
  })

  it('watches for publishes to all keys', async () => {
    const name0 = await createNameKeypair()
    const name1 = await createNameKeypair()
    const name0Value0 = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const name0Value1 = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    const name1Value0 = '/ipfs/bafkreid7fbwjx4swwewit5txzttoja4t4xnkj3rx3q7dlbj76gvixuq35y'
    const name1Value1 = '/ipfs/bafybeihiyjghsq7gob7vj3vurqf5i4eth3h57ixpaajdxtvi7p4snhag2a'
    const name0Record0 = await createNameRecord(name0.privateKey, name0Value0)
    const name0Record1 = await updateNameRecord(name0.privateKey, name0Record0, name0Value1)
    const name1Record0 = await createNameRecord(name1.privateKey, name1Value0)
    const name1Record1 = await updateNameRecord(name1.privateKey, name1Record0, name1Value1)

    // listen for ALL updates
    const res = await mf.dispatchFetch(
      new Request(
        new URL('name/*/watch', endpoint),
        {
          headers: { Upgrade: 'websocket' }
        }
      )
    )

    const conn = res.webSocket

    // we're going to publish on two keys
    const expectedMsgCount = 4
    const msgs: Array<(string | ArrayBuffer)> = []
    const deferred = pDefer()

    if (conn != null) {
      conn.accept()

      conn.addEventListener('message', (event) => {
        msgs.push(event.data)
        if (msgs.length >= expectedMsgCount) {
          deferred.resolve()
        }
      })
    }

    try {
      await publishRecord(name1.id, name1Record0)
      await publishRecord(name0.id, name0Record0)
      await publishRecord(name1.id, name1Record1)
      await publishRecord(name0.id, name0Record1)

      // wait for update messages to be received
      await deferred.promise

      assert.strictEqual(msgs.length, expectedMsgCount)
      // @ts-expect-error
      assert.strictEqual(JSON.parse(msgs[0]).value, name1Value0)
      // @ts-expect-error
      assert.strictEqual(JSON.parse(msgs[1]).value, name0Value0)
      // @ts-expect-error
      assert.strictEqual(JSON.parse(msgs[2]).value, name1Value1)
      // @ts-expect-error
      assert.strictEqual(JSON.parse(msgs[3]).value, name0Value1)
    } finally {
      if (conn != null) {
        conn.close()
      }
    }
  })
})

describe('Not found', () => {
  it('returns a not found error', async () => {
    const response = await mf.dispatchFetch(new URL('/help', endpoint))
    const body: {message: string} = await response.json()
    assert.equal(response.status, 404)
    assert.equal(body.message, 'Not Found')
  })
})
