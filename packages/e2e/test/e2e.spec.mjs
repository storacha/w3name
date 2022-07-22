import * as Name from 'w3name'
import W3NameService from 'w3name/service'
import assert from 'assert/strict'
import { Miniflare, Log, LogLevel, Request } from 'miniflare'

const endpoint = 'http://127.0.0.1:8787'

let mf
let server
let service

describe('w3name module', () => {
  before(async () => {
    mf = new Miniflare({
      cfFetch: false,
      buildBasePath: "../api/",
      packagePath: '../api/package.json',
      wranglerConfigPath: '../api/wrangler.toml',
      log: new Log(LogLevel.DEBUG),
      modules: true
    })
    service = new W3NameService('http://127.0.0.1:8787')
    server = await mf.startServer()
  })

  after((done) => {
    server.close() 
    done()
  })

  it('can publish an resolve a new name', async () => {
    const name = await Name.create()
    const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    const revision = await Name.v0(name, value)
    await Name.publish(service, revision, name.key)

    let latest = await Name.resolve(service, name)
    assert.equal(latest.name, name)
    assert.equal(latest.value, value)
    assert.equal(latest.sequence, 0n)
    assert.ok(latest.validity)

    const value_2 = '/ipfs/bafkreid7fbwjx4swwewit5txzttoja4t4xnkj3rx3q7dlbj76gvixuq35y'
    const revision_2 = await Name.increment(revision, value_2)
    await Name.publish(service, revision_2, name.key)

    latest = await Name.resolve(service, name)
    assert.equal(latest.name, name)
    assert.equal(latest.value, value_2)
    assert.equal(latest.sequence, 1n)
    assert.ok(latest.validity)
  })
})
