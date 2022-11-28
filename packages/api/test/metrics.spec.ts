import assert from 'assert/strict'
import * as uint8arrays from 'uint8arrays'
import { createNameKeypair, createNameRecord } from './helpers'
import { Miniflare, Request } from 'miniflare'
import { endpoint } from './scripts/constants'
import { MockQueue } from './scripts/queues'

describe('Name creation', () => {
  it('calls incrementCreationCounter when a record is created', async () => {
    const mockQueue = new MockQueue()
    const mf = new Miniflare({
      envPath: true,
      packagePath: true,
      wranglerConfigPath: true,
      wranglerConfigEnv: 'test',
      modules: true,
      bindings: {
        METRICS_QUEUE: mockQueue
      }
    })
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
    const record = await createNameRecord(privateKey, value)
    const request = new Request(
      new URL(`/name/${key}`, endpoint),
      {
        method: 'POST',
        body: uint8arrays.toString(record, 'base64pad')
      }
    )
    const res = await mf.dispatchFetch(request)
    assert.ok(res.ok)
    assert.equal(mockQueue.messages.length, 1)
    assert.equal(mockQueue.messages[0].recordsCreated, 1)
    await mf.dispose() // Otherwise the test hangs
  })
})

describe('Metrics serving for Prometheus', () => {
  it('serves metrics data', async () => {
    const mf = new Miniflare({
      envPath: true,
      packagePath: true,
      wranglerConfigPath: true,
      wranglerConfigEnv: 'test',
      modules: true
    })
    const response = await mf.dispatchFetch(new URL('/metrics', endpoint))
    const body: string = await response.text()
    assert.ok(response.ok)
    assert.match(body, /# HELP w3name_name_creation_total Total names created/)
    assert.match(body, /# TYPE w3name_name_creation_total counter/)
    assert.match(body, /w3name_name_creation_total \d+/)
    await mf.dispose()
  })
})
