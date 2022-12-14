import { Router } from 'itty-router'
import { jsonResponse, notFound } from './utils/response-types'
import { nameGet, nameWatchGet, namePost, raiseErrorGet } from './name'
import { HTTPError } from './errors'
import { addCorsHeaders, withCorsHeaders, corsOptions } from './cors'
import * as swaggerConfig from './swaggerConfig'
import { Env, envAll } from './env'

declare global {
  // These must be defined as parameters to esbuild.build() in buildworkermodule.js
  var BRANCH: string
  var COMMITHASH: string
  var SENTRY_RELEASE: string
  var VERSION: string
}

const router = Router()

router.all('*', envAll)
router.options('*', corsOptions)
router.get('/name/:key', withCorsHeaders(nameGet))
router.get('/name/:key/watch', withCorsHeaders(nameWatchGet))
router.post('/name/:key', withCorsHeaders(namePost))
router.get('/raise-error', withCorsHeaders(raiseErrorGet))

// Open API spec
router.get('/schema.json', withCorsHeaders(swaggerConfig.toJSON))
router.get('/schema.yaml', withCorsHeaders(swaggerConfig.toYAML))
router.get('/schema.yml', withCorsHeaders(swaggerConfig.toYAML))

router.get('/', () => jsonResponse(JSON.stringify({ message: '⁂ w3name' })))
router.all(
  '*',
  (request: Request): Response => addCorsHeaders(request, notFound())
)

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
    } catch (error: any) {
      env.log.error(error, ctx)

      if (error instanceof HTTPError) {
        response = addCorsHeaders(
          request,
          jsonResponse(JSON.stringify({ message: error.message }), error.status)
        )
      } else {
        response = addCorsHeaders(
          request,
          jsonResponse(JSON.stringify({ message: error.message }), 500)
        )
      }
    }
    await env.log.end(response)
    return response
  }
}

export { NameRoom as NameRoom0 } from './broadcast'
export { IPNSRecord } from './record'
