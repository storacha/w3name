import assert from 'assert/strict'
import * as uint8arrays from 'uint8arrays'
import { createNameKeypair, createNameRecord } from './helpers'
import { Miniflare, Request } from 'miniflare'
import { createFetchMock } from '@miniflare/core'
import type { MockAgent } from 'undici'
import { endpoint } from './scripts/constants'
import { MockAnalyticsDataset } from './scripts/analytics'

let mf: Miniflare
let mockAnalytics: MockAnalyticsDataset
let fetchMock: MockAgent

const setFetchMockIncerceptor = () => {
  // The `namePost` endpoint makes a `fetch` call to the `PUBLISHER_ENDPOINT_URL`, which will
  // fail when we try to call `res.waitUntil()`. So we have to mock that call.
  // Additionally, if we make multiple calls to a URL, we must set the interceptor again for each
  // call. Hence this helper function.
  fetchMock.get('http://faked.example.com')
    .intercept({ method: 'POST', path: '/' }).reply(200)
}

beforeEach(() => {
  mockAnalytics = new MockAnalyticsDataset()
  fetchMock = createFetchMock()
  setFetchMockIncerceptor()
  mf = new Miniflare({
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,
    wranglerConfigEnv: 'test',
    modules: true,
    fetchMock,
    bindings: {
      W3NAME_METRICS: mockAnalytics,
      PUBLISHER_ENDPOINT_URL: 'http://faked.example.com'
    }
  })
})

afterEach(async () => {
  if (mf instanceof Miniflare) {
    await mf.dispose() // Otherwise the terminal hangs
  }
})

describe('Name creation', () => {
  it('calls storeEvent when a record is created', async () => {
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
    // Await the promises which have been passed to `ctx.waitUntil` so that we can then check
    // that the analytics stuff has been called as expected
    await res.waitUntil()
    assert.equal(mockAnalytics.datapoints.length, 1)
    // @ts-expect-error
    assert.equal(mockAnalytics.datapoints[0].blobs[0], 'record_creation')
  })
})

describe('Name updating', () => {
  it('calls storEvent when a record is updated', async () => {
    // Create a record which we will then update
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    let value = '/ipfs/gpfyxgargyobtjtjvoqu552beiauyddeo2aoqciudrm56kwxirquxaxso3n'
    let record = await createNameRecord(privateKey, value)
    let request = new Request(
      new URL(`/name/${key}`, endpoint),
      {
        method: 'POST',
        body: uint8arrays.toString(record, 'base64pad')
      }
    )
    let res = await mf.dispatchFetch(request)
    assert.ok(res.ok)

    mockAnalytics.reset()
    setFetchMockIncerceptor()

    // Now modify it
    value = '/ipfs/qu552beiaugpfyxgargyobtjtjvoyddem56kwxirquxaxso3o2aoqciudrn'
    record = await createNameRecord(privateKey, value, 1n)
    request = new Request(
      new URL(`/name/${key}`, endpoint),
      {
        method: 'POST',
        body: uint8arrays.toString(record, 'base64pad')
      }
    )
    res = await mf.dispatchFetch(request)
    assert.ok(res.ok)
    await res.waitUntil()
    assert.equal(mockAnalytics.datapoints.length, 1)
    // @ts-expect-error
    assert.equal(mockAnalytics.datapoints[0].blobs[0], 'record_update')
    // @ts-expect-error
    assert.equal(mockAnalytics.datapoints[0].blobs[1], key)
  })
})

describe('Name resolving', () => {
  it('calls storEvent when a record is looked up', async () => {
    // Create a record which we can fetch
    const { id: key, privateKey }: { id: string, privateKey: Uint8Array } = await createNameKeypair()
    const value = '/ipfs/gpfyxgargyobtjtjvoqu552beiauyddeo2aoqciudrm56kwxirquxaxso3n'
    const record = await createNameRecord(privateKey, value)
    let request = new Request(
      new URL(`/name/${key}`, endpoint),
      {
        method: 'POST',
        body: uint8arrays.toString(record, 'base64pad')
      }
    )
    let res = await mf.dispatchFetch(request)
    assert.ok(res.ok)

    mockAnalytics.reset()

    // Fetch it and check that the fetch was recorded in our analytics
    request = new Request(
      new URL(`/name/${key}`, endpoint),
      {
        method: 'GET'
      }
    )
    res = await mf.dispatchFetch(request)
    assert.ok(res.ok)
    await res.waitUntil()
    assert.equal(mockAnalytics.datapoints.length, 1)
    // @ts-expect-error
    assert.equal(mockAnalytics.datapoints[0].blobs[0], 'record_lookup')
  })
})
