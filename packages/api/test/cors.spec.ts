/* eslint-env mocha */
import assert from 'assert'
import { Miniflare, Request } from 'miniflare'
import { endpoint } from './scripts/constants.js'

let mf: Miniflare

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

after(async () => mf.dispose())

describe('CORS', () => {
  it('sets CORS headers on 404', async () => {
    // const res = await fetch(new URL('nope', endpoint))
    const res = await mf.dispatchFetch(new URL('imaginary', endpoint))
    assert(!res.ok)
    assert.strictEqual(res.status, 404, 'Expected 404 on /nope')
    assert.strictEqual(res.headers.get('Access-Control-Allow-Origin'), '*')
  })

  it('sets CORS headers on server error', async () => {
    // const res = await fetch(new URL('error', endpoint))
    const path = '/name/invalidkey'
    const res = await mf.dispatchFetch(new URL(path, endpoint))
    assert(!res.ok)
    assert.strictEqual(res.status, 400, `Expected 400 on ${path}`)
    assert.strictEqual(res.headers.get('Access-Control-Allow-Origin'), '*')
  })

  it('correctly responds to preflight request', async () => {
    const res = await mf.dispatchFetch(
      new Request(
        new URL('name/abcd', endpoint),
        {
          method: 'OPTIONS',
          headers: {
            Origin: 'name.web3.storage',
            'Access-Control-Request-Method': 'whatever',
            'Access-Control-Request-Headers': 'whatever'
          }
        }
      )
    )
    assert(res.ok)
    assert.strictEqual(res.status, 204, 'Expected 204 status for OPTIONS request')
    assert.strictEqual(res.headers.get('Access-Control-Allow-Origin'), 'name.web3.storage')
    assert.strictEqual(res.headers.get('Access-Control-Allow-Methods'), 'GET,POST,OPTIONS')
  })
})
