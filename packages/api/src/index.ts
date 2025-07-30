import { Router } from 'itty-router'
import { jsonResponse, notFound } from './utils/response-types.js'
import { nameGet, nameWatchGet, namePost, raiseErrorGet } from './name.js'
import { HTTPError } from './errors.js'
import { addCorsHeaders, withCorsHeaders, corsOptions } from './cors.js'
import * as swaggerConfig from './swaggerConfig.js'
import { Env, envAll } from './env.js'

declare global {
  // These must be defined as parameters to esbuild.build() in buildworkermodule.js
  const BRANCH: string
  const COMMITHASH: string
  const SENTRY_RELEASE: string
  const VERSION: string
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
      response = await router.fetch(request, env, ctx)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error)
      env.sentry?.captureException(error)

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
    return response
  }
}

export { NameRoom as NameRoom0 } from './broadcast.js'
export { IPNSRecord } from './record.js'
