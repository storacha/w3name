import throttledQueue from 'throttled-queue'

const RATE_LIMIT_REQUESTS = 30
const RATE_LIMIT_PERIOD = 10 * 1000

export interface PublicService {
  endpoint: URL
  rateLimiter?: RateLimiter
}

/**
 * RateLimiter returns a promise that resolves when it is safe to send a request
 * that does not exceed the rate limit.
 */
export interface RateLimiter { (): Promise<void> }

function createRateLimiter () {
  const throttle = throttledQueue(RATE_LIMIT_REQUESTS, RATE_LIMIT_PERIOD)
  return async () => await throttle(() => {})
}

export default class W3NameService implements PublicService {
  endpoint: URL
  rateLimiter?: RateLimiter | undefined

  constructor (
    endpoint: URL = new URL('https://api.web3.storage'),
    rateLimiter: RateLimiter | undefined = undefined
  ) {
    this.endpoint = endpoint
    this.rateLimiter = rateLimiter != null ? rateLimiter : createRateLimiter()
  }
}
