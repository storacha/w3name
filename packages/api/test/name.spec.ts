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

interface GetKeyResponse {
  value: string
  record: string
}

let mf: Miniflare

const endpoint = 'http://127.0.0.1:8787'

before((done) => {
  mf = new Miniflare({
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,
    wranglerConfigEnv: 'test',
    modules: true
  })
  done()
})

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
    assert.ok(body.message.includes('invalid key'))
  })

  it('returns an error for a key with an invalid code', async () => {
    const keyPair = await keys.generateKeyPair('Ed25519', 2048)
    const digest = Digest.create(identity.code, keyPair.public.bytes)
    const key = CID.createV1(140, digest).toString(base36)
    const response = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))
    const body: {message: string} = await response.json()
    assert.equal(response.status, 400)
    assert.equal(body.message, 'invalid key, expected: 114 codec code but got: 140')
  })

  it('returns an error for a non-existing key', async () => {
    const keyPair = await keys.generateKeyPair('Ed25519', 2048)
    const digest = Digest.create(identity.code, keyPair.public.bytes)
    const key = CID.createV1(114, digest).toString(base36)
    const response = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))
    const body: {message: string} = await response.json()
    assert.equal(response.status, 404)
    assert.ok(body.message.includes(`record not found for key: ${key}`))
  })
})

describe('POST/GET /name/:key', () => {
  it('returns an error for an invalid key', async () => {
    const key = '837497jhfd'
    const { privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(privateKey, value)
    const response = await mf.dispatchFetch(
      new Request(
        new URL(`name/${key}`, endpoint), {
          method: 'POST',
          body: uint8arrays.toString(record, 'base64pad')
        })
    )
    const body: {message: string} = await response.json()

    assert.equal(response.status, 400)
    assert.ok(body.message.includes('invalid key'))
  })

  it('returns an error for a key with an invalid code', async () => {
    const keyPair = await keys.generateKeyPair('Ed25519', 2048)
    const digest = Digest.create(identity.code, keyPair.public.bytes)
    const key = CID.createV1(140, digest).toString(base36)
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(keyPair.bytes, value)
    const response = await mf.dispatchFetch(
      new Request(
        new URL(`name/${key}`, endpoint), {
          method: 'POST',
          body: uint8arrays.toString(record, 'base64pad')
        })
    )
    const body: {message: string} = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.message, 'invalid key, expected: 114 codec code but got: 140')
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

    const response = await mf.dispatchFetch(
      new Request(
        new URL(`name/${key}`, endpoint), {
          method: 'POST',
          body: uint8arrays.toString(record, 'base64pad')
        })
    )
    const body: {message: string} = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.message, 'invalid ipns entry: record has expired')
  })

  it('publishes value for key', async () => {
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(privateKey, value)

    const publishRes = await mf.dispatchFetch(
      new Request(
        new URL(`name/${key}`, endpoint), {
          method: 'POST',
          body: uint8arrays.toString(record, 'base64pad')
        })
    )

    assert(publishRes.ok)

    const { id } = await publishRes.json()

    assert.strictEqual(id, key)

    const resolveRes = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))

    assert(resolveRes.ok)

    const resolved: GetKeyResponse = await resolveRes.json()

    assert.strictEqual(resolved.record, uint8arrays.toString(record, 'base64pad'))
    assert.strictEqual(resolved.value, value)
  })

  it.only('republishes valid records but errors with outdated records', async () => {
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()

    const updates = [];

    // Publish a new record with a few updates
    let i = 0;
    while(i < 3) {
      const updateValue = `/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudr${i}`

      const updateRecord = await createNameRecord(privateKey, updateValue)

      const updatePublishRes = await mf.dispatchFetch(
        new Request(
          new URL(`name/${key}`, endpoint), {
            method: 'POST',
            body: uint8arrays.toString(updateRecord, 'base64pad')
          })
      )

      assert(updatePublishRes.ok)

      const { id } = await updatePublishRes.json()

      assert.strictEqual(id, key)

      const updateResolveRes = await mf.dispatchFetch(new URL(`name/${key}`, endpoint))

      assert(updateResolveRes.ok)

      const updateResolved: GetKeyResponse = await updateResolveRes.json()
      assert.strictEqual(updateResolved.record, uint8arrays.toString(updateRecord, 'base64pad'))
      assert.strictEqual(updateResolved.value, updateValue)

      updates.push(updateRecord);
      i++;
    }

    // Update the record with a previous version
    const updateOldPublishRes = await mf.dispatchFetch(
      new Request(
        new URL(`name/${key}`, endpoint), {
          method: 'POST',
          body: uint8arrays.toString(updates[1], 'base64pad')
        })
    )
    /* TODO: Test more invalid records
        We should add tests to catch
          - invalid seqno
          - invalid v2sig
          - invalid validity
          - invalid record data size
    */
    const body: {message: string} = await updateOldPublishRes.json()
    assert.equal(updateOldPublishRes.status, 400)
    assert.ok(body.message.includes('invalid record: the record is outdated'))
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

  async function publishRecord (key: string, record: Uint8Array): Promise<void> {
    const publishRes = await mf.dispatchFetch(
      new Request(
        new URL(`name/${key}`, endpoint),
        {
          method: 'POST',
          body: uint8arrays.toString(record, 'base64pad')
        }
      )
    )

    assert(publishRes.ok)
  }
})

describe('Not found', () => {
  it('returns a not found error', async () => {
    const response = await mf.dispatchFetch(new URL('/help', endpoint))
    const body: {message: string} = await response.json()
    assert.equal(response.status, 404)
    assert.equal(body.message, 'Not Found')
  })
})
