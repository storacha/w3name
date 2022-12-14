import Toucan from 'toucan-js'
import pkg from '../package.json'
import { Logging } from './utils/logs'

export interface Env {
  NAME_ROOM: DurableObjectNamespace
  IPNS_RECORD: DurableObjectNamespace
  REBROADCAST_INTERVAL_MS: number
  PUBLISHER_AUTH_SECRET: string
  PUBLISHER_ENDPOINT_URL: string
  sentry?: Toucan
  SENTRY_DSN?: string
  DEBUG?: string
  SENTRY_RELEASE: string
  ENV: string
  log: Logging
  LOGTAIL_TOKEN?: string
  VERSION: string
  BRANCH: string
  COMMITHASH: string
}

export function envAll (req: Request, env: Env, ctx: ExecutionContext) {
  env.sentry = env.SENTRY_DSN !== null
    ? new Toucan({
      dsn: env.SENTRY_DSN,
      context: ctx,
      request: req,
      allowedHeaders: ['user-agent', 'x-client'],
      allowedSearchParams: /(.*)/,
      debug: env.DEBUG === 'true',
      rewriteFrames: {
        // strip . from start of the filename ./worker.mjs as set by cloudflare, to make absolute path `/worker.mjs`
        iteratee: (frame) => ({
          ...frame,
          filename: frame?.filename?.substring(1)
        })
      },
      environment: env.ENV,
      release: SENTRY_RELEASE,
      pkg
    })
    : undefined

  // Attach a `Logging` instance, which provides methods for logging and writes
  // the logs to LogTail. This must be a new instance per request.
  // Note that we pass `ctx` as the `event` param here, because it's kind of both:
  // https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#syntax-module-worker
  env.log = new Logging(req, ctx, {
    token: env.LOGTAIL_TOKEN,
    debug: env.DEBUG === 'true',
    sentry: env.sentry,
    version: VERSION,
    branch: BRANCH,
    commithash: COMMITHASH
  })
}
