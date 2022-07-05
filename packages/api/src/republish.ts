import { Env } from './env'
import { retryFetch } from './utils/retry-fetch.js'

export async function repubishAll (env:Env) {
  const namespaceId = await getIPNSRecordDurableObjectNamespaceId()
  let count = -1
  while (count) {
    const batch = getDurableObjectIdsBatch(env, namespaceId)
    const objectIds = batch.result.map(item => item.id)
    await publishRecords(env, objectIds)
    count = batch.result_info.count
  }
}

async function publishRecords(env: Env, objectIds: Array<string>) {
  for (const hexId of objectIds) {
    // The "ID" that the API gives us is a hex string, which is still not actually the
    // ID, so we convert the ID to an ID 🤷
    const objId = env.IPNS_RECORD.idFromString(hexId)
    const obj = env.IPNS_RECORD.get(objId)
    // TODO: make a request that either tells the DO to publish itself to `ipns-publisher`
    // or to give us back the relevant data so that we can do the publishing here
    const request = {}
    const response = await obj.fetch(request)
    const text = await response.text()
  }
}



/**
 * Returns the ID hex string which is needed to in turn fetch the Durable objects
 * of the IPNSRecord class.
 */
async function getIPNSRecordDurableObjectNamespaceId(env:Env) {
  const namespaces = (await getApiResponse(env, '/workers/durable_objects/namespaces')).result
  // Just return the ID of the 'IPNSRecord' namespace
  return namespaces.filter(ns => ns.class === 'IPNSRecord')[0].id
}

async function getDurableObjectIdsBatch(env, namespaceId, limit = 1000, cursor: string) {
  // https://api.cloudflare.com/#durable-objects-namespace-list-objects
  let path = `/workers/durable_objects/namespaces/${namespaceId}/objects?limit=${limit}`
  if (cursor) {
    path += `&cursor=${cursor}`
  }
  return getApiResponse(env, path)
}

async function getApiResponse(env, path:string): Promise<object> {
  const accountId = env.ACCOUNT_ID
  // TODO: Switch to using an API token instead.
  // The current blocker is that the UI for creating an API token
  // (https://dash.cloudflare.com/profile/api-tokens) bears no relation to the required
  // permissions which the documentation
  // (https://api.cloudflare.com/#durable-objects-namespace-list-objects) specifies.
  // Waiting for Cloudflare support to get back to us with an answer.
  const authKey = env.AUTH_KEY
  const headers = {
    'X-Auth-Email': env.AUTH_EMAIL,
    'X-Auth-Key': authKey
  }
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}`
  const url = `${baseUrl}${path}`
  const response = await retryFetch(url, { method: 'GET', headers: headers })
  // For a reason that I don't quite understand, calling `response.json()` results in
  // `TypeError: disturbed`, as if the stream gets interrupted during parsing. Hence
  // we do `JSON.parse(response.text())` instead 🤷
  const text = await response.text()
  return JSON.parse(text)
}
