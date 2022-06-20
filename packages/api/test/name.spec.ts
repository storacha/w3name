// @ts-nocheck

import assert from 'assert/strict'
import pDefer from 'p-defer'
import { Miniflare, Request } from 'miniflare'
import { createNameKeypair, createNameRecord, updateNameRecord, NameKeyPair } from './helpers.ts'
import * as uint8arrays from 'uint8arrays'

// import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

interface GetKeyResponse {
  value: string
  record: string
}

let mf
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

describe('GET /name/:key', () => {
  it('resolves key to value', async () => {
    const key = 'k51qzi5uqu5dl2hq2hm5m29sdq1lum0kb0lmyqsowicmrmxzxywwgxhy6ymrdv'
    const url = new URL(`name/${key}`, endpoint).toString()

    const res = await mf.dispatchFetch(url)

    assert(res.ok)

    const { value, record } = await res.json() as GetKeyResponse

    assert.equal(value, '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui')
    assert.equal(record, 'CkEvaXBmcy9iYWZrcmVpZW00dHdrcXpzcTJhajRzaGJ5Y2Q0eXZvajJjeDcydmV6aWNsZXRs')
  })
})

describe('POST /name/:key', () => {
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

    const resolved = await resolveRes.json()

    assert.strictEqual(resolved.record, uint8arrays.toString(record, 'base64pad'))
    assert.strictEqual(resolved.value, value)
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
    conn.binaryType = 'arraybuffer'

    console.log('here', res, conn)
    conn.accept()

    // we're going to publish on two keys, but we're only listening on one
    // so we should only receive 2 messages.
    const expectedMsgCount = 2
    const msgs = []
    const deferred = pDefer()

    conn.addEventListener('message', (event) => {
      console.log('hello websocket', event.data.byteLength, event, event.data)
      msgs.push(event.data)
      if (msgs.length >= expectedMsgCount) {
        deferred.resolve()
      }
    })

    try {
      await publishRecord(name0.id, name0Record0)
      // we should NOT receive an update for this key
      await publishRecord(name1.id, name1Record0)
      // we should NOT receive an update for this key
      await publishRecord(name1.id, name1Record1)
      await publishRecord(name0.id, name0Record1)
      console.log('tata')

      // wait for update message to be received
      await deferred.promise

      console.log('ho1', msgs[0])
      console.log('ho2', msgs[0].utf8Data)

      assert.strictEqual(msgs.length, expectedMsgCount)
      assert.strictEqual(JSON.parse(msgs[0]).value, name0Value0)
      assert.strictEqual(JSON.parse(msgs[1]).value, name0Value1)
      console.log('tata2')
    } finally {
      conn.close()
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
    conn.accept()

    // we're going to publish on two keys
    const expectedMsgCount = 4
    const msgs = []
    const deferred = pDefer()

    conn.addEventListener('message', (event) => {
      msgs.push(event.data)
      if (msgs.length >= expectedMsgCount) {
        deferred.resolve()
      }
    })

    try {
      await publishRecord(name1.id, name1Record0)
      await publishRecord(name0.id, name0Record0)
      await publishRecord(name1.id, name1Record1)
      await publishRecord(name0.id, name0Record1)

      // wait for update messages to be received
      await deferred.promise

      assert.strictEqual(msgs.length, expectedMsgCount)
      assert.strictEqual(JSON.parse(msgs[0]).value, name1Value0)
      assert.strictEqual(JSON.parse(msgs[1]).value, name0Value0)
      assert.strictEqual(JSON.parse(msgs[2]).value, name1Value1)
      assert.strictEqual(JSON.parse(msgs[3]).value, name0Value1)
    } finally {
      conn.close()
    }
  })

  async function publishRecord (key: string, record: Uint8Array): void {
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
