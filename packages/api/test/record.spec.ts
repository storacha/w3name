import { Miniflare } from 'miniflare'
import assert from 'assert/strict'
import http from 'http'
import sinon from 'sinon'

let mf: Miniflare

const serverHandler = sinon.spy((request: http.IncomingMessage, response: http.ServerResponse) => {
  response.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' })
  response.end('')
})

const server = http.createServer(serverHandler)

async function delayed (x: any): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/return-await
  return new Promise(resolve => {
    setTimeout(resolve, x, x)
  })
}

describe('Rebroadcast alarm', () => {
  before((done) => {
    mf = new Miniflare({
      envPath: true,
      packagePath: true,
      wranglerConfigPath: true,
      wranglerConfigEnv: 'test',
      modules: true
    })

    server.listen(8000, '127.0.0.1')

    done()
  })

  after(() => {
    server.close()
  })

  it('sets an alarm on a new instance', async () => {
    const IPNS_RECORD = await mf.getDurableObjectNamespace('IPNS_RECORD')
    const id = IPNS_RECORD.newUniqueId()
    const stub = IPNS_RECORD.get(id)
    const store = await mf.getDurableObjectStorage(id)

    assert.ok(await store.getAlarm() === null)

    await stub.fetch('http://localhost/', {
      method: 'POST',
      body: '{}'
    })

    assert.ok(await store.getAlarm())

    await store.deleteAlarm() // necessary to stop tests
  })

  it('resets the alarm if deleted', async () => {
    const IPNS_RECORD = await mf.getDurableObjectNamespace('IPNS_RECORD')
    const id = IPNS_RECORD.newUniqueId()
    const stub = IPNS_RECORD.get(id)

    const store = await mf.getDurableObjectStorage(id)
    assert.ok(await store.getAlarm() === null)

    await stub.fetch('http://localhost/', {
      method: 'POST',
      body: '{}'
    })

    await store.deleteAlarm()

    assert.ok(await store.getAlarm() === null)

    await stub.fetch('http://localhost/', {
      method: 'POST',
      body: '{}'
    })

    assert.ok(await store.getAlarm())

    await store.deleteAlarm() // necessary to stop tests
  })

  it('calls the alarm handler', async () => {
    const IPNS_RECORD = await mf.getDurableObjectNamespace('IPNS_RECORD')
    const id = IPNS_RECORD.newUniqueId()
    const stub = IPNS_RECORD.get(id)
    const store = await mf.getDurableObjectStorage(id)

    assert.ok(await store.getAlarm() === null)

    await stub.fetch('http://localhost/', {
      method: 'POST',
      body: '{}'
    })

    const previousUpdate: string | undefined = await store.get('lastRebroadcast')

    await delayed(1000)

    const lastUpdate: string | undefined = await store.get('lastRebroadcast')

    // The lastRebroadcast value is updated by the alarm
    assert.ok(new Date(lastUpdate as string) > new Date(previousUpdate as string))

    await store.deleteAlarm() // necessary to stop tests

    assert.ok(serverHandler.called, 'endpoint not called')
  })
})
