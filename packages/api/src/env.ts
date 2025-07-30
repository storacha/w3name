import { Toucan, requestDataIntegration } from 'toucan-js'

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
  VERSION: string
  BRANCH: string
  COMMITHASH: string
}

export function envAll (req: Request, env: Env, ctx: ExecutionContext): void {
  env.sentry = env.SENTRY_DSN !== null
    ? new Toucan({
      dsn: env.SENTRY_DSN,
      context: ctx,
      request: req,
      debug: env.DEBUG === 'true',
      environment: env.ENV,
      release: SENTRY_RELEASE,
      integrations: [
        requestDataIntegration({
          allowedHeaders: ['user-agent', 'x-client'],
          allowedSearchParams: /(.*)/
        })
      ]
    })
    : undefined
}
