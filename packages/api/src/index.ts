import { nameGet, nameWatchGet, namePost } from './name'
import { notFound } from './utils/json-response'

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from 'itty-router'

const router = Router()

router.get('/name/:key', nameGet)
router.get('/name/:key/watch', nameWatchGet)
router.post('/name/:key', namePost)

router.get('/', () => {
  return new Response(
    `
<body style="font-family: -apple-system, system-ui">
  <h1>⁂</h1>
  <p>try
    <a href='/car/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy'>
      /car/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy
    </a>
  </p>
</body>`,
    {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=UTF-8'
      }
    }
  )
})

router.all('*', notFound)

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
}

export default {
  async fetch (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    let response
    try {
      env = { ...env } // new env object for every request (it is shared otherwise)!
      response = await router.handle(request, env, ctx)
    } catch (error) {
      // response = serverError(error, request, env)
    }
    // await env.log.end(response)
    return response
  }
}

export { NameRoom as NameRoom0 } from './name.js'
