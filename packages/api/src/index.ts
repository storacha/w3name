import { Router } from 'itty-router'
import { jsonResponse, notFound } from './utils/response-types'
import { nameGet, nameWatchGet, namePost } from './name'
import { HTTPError } from './errors'
import * as swaggerConfig from './swaggerConfig'

const router = Router()

router.get('/name/:key', nameGet)
router.get('/name/:key/watch', nameWatchGet)
router.post('/name/:key', namePost)
// Open API spec
router.get('/swagger.json', swaggerConfig.toJSON)
router.get('/swagger.yaml', swaggerConfig.toYAML)
router.get('/swagger.yml', swaggerConfig.toYAML)

router.get('/', () => jsonResponse(JSON.stringify({ message: '⁂ w3name' })))
router.all('*', () => notFound())

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  NAME_ROOM: DurableObjectNamespace
  IPNS_RECORD: DurableObjectNamespace
}

export default {
  async fetch (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      env = { ...env } // new env object for every request (it is shared otherwise)!
      return await router.handle(request, env, ctx)
    } catch (error: any) {
      if (error instanceof HTTPError) {
        return jsonResponse(JSON.stringify({ message: error.message }), error.status)
      }
    }
    return new Response()
  }
}

export { NameRoom as NameRoom0 } from './broadcast'
export { IPNSRecord } from './record'
