// @ts-nocheck

import fetch from '@web-std/fetch'
import { jsonResponse } from './utils/json-response'

const OBJECT_IDS = [
  'frog', 'banana', 'cat', 'dog'
]

export class TestDurableObject {
  constructor (state, env) {
    this.state = state
    this.env = env
  }

  async fetch (request) {
    if (request.url.match(/make$/)) {
      console.log(`Got into 'write'`)
      await this.state.storage.put({ test_key: 'test_value' })
      console.log(`Finsihed awaiting state.storage.put`)
      return new Response('Stored some stuff, yo')
    } else if (request.url.match(/list$/)) {
      return new Response(await this.state.storage.get(['test_key']))
    }
  }
}

export async function MakeDurableObjects (request, env) {
  for (const id of OBJECT_IDS) {
    try {
      console.log(`Got to loop: ${id}`)
      const objId = env.TEST_DO.idFromName(id)
      const obj = env.TEST_DO.get(objId)
      console.log(Object.keys(obj))
      await obj.fetch(request)
      // await obj.write()
      console.log('Successfully awaited')
    } catch (err) {
      console.log(`Got an error: ${err}`)
      return new Response(`Error: ${err}`)
      // throw new HTTPError(`Bad times: ${err}`, 500)
    }
  }
  return jsonResponse(JSON.stringify({ result: "it's fine" }), 200)
}

export async function ListDurableObjects (request, env) {
  try {
    const namespaceInfos = await getDurableObjectNamespaceInfos()
    return jsonResponse(namespaceInfos)

    const responses = []
    for (const namespaceInfo of namespaceInfos) {
      const namespaceData = { info: namespaceInfo.namespace, objects: [] }
      for (const objectInfo of namespaceInfo.objects) {
        const obj = env.TEST_DO.get(objectInfo.id)
        const response = await obj.fetch(request)
        const text = await response.text()
        namespaceData.objects.push({
          objectInfo: objectInfo,
          storedText: text
        })
      }
      responses.push(namespaceData)
    }
    return jsonResponse({ responses: responses })
  } catch (err) {
    return new Response(`Error: ${err}`)
  }
}

async function getDurableObjectNamespaceInfos () {
  const accountId = ''
  const authKey = ''
  const headers = {
    'X-Auth-Email': '',
    'X-Auth-Key': authKey
  }

  const namespaceInfos = []
  const namespacesUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/durable_objects/namespaces`
  const response = await fetch(namespacesUrl, { method: 'GET', headers: headers })
  if (response.status !== 200) {
    throw new Error(`Status fetching namespaces: ${response.status}`)
  }
  const responseJson = await response.json()
  const namespaces = responseJson.result // list of objects, one for each DO class
  for (const namespace of namespaces) {
    const objects = []
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/durable_objects/namespaces/${namespace.id}/objects`
    const response = await fetch(url, { method: 'GET', headers: headers })
    if (response.status !== 200) {
      throw new Error(`Status fetching objects: ${response.status}`)
    }
    const text = await response.text()
    console.log(`Objects response: ${text}`)
    try {
      const responseJson = await response.json()
    } catch (err) {
      console.log(`Error parsing JSON of objects: ${err}`)
      throw err
    }

    namespaceInfos.push({
      namespace: namespace,
      objects: responseJson.result
    })
  }

  return namespaceInfos
}
