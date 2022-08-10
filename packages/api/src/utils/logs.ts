/* eslint-env serviceworker */
/* eslint-disable no-console */
import { nanoid } from 'nanoid/non-secure'

const logtailApiURL = 'https://in.logtail.com/'

const buildMetadataFromHeaders = (headers: globalThis.Headers) => {
  /** @type {Record<string, string>} */
  const responseMetadata: { [key: string]: string } = {}
  Array.from(headers).forEach(([key, value]) => {
    responseMetadata[key.replace(/-/g, '_')] = value
  })
  return responseMetadata
}

interface ILoggingOptions {
  skipForSentry?: Error[]
  sentry: any
  debug?: boolean
  token?: string
  version: string
  commithash: string
  branch: string
}

type LogLevels = 'debug' | 'info' | 'warn' | 'error'

export class Logging {
  public ctx
  public opts
  public _times
  public _timesOrder: string[] = []
  public logEventsBatch: any[] = []
  public startTs = Date.now()
  public currentTs: number
  public _finished = false
  public metadata: any = {}

  constructor (request: any, ctx: ExecutionContext, opts: ILoggingOptions) {
    this.ctx = ctx
    this.opts = opts
    this._times = new Map()
    this.currentTs = this.startTs

    const cf = request.cf
    let rCf
    if (cf) {
      const { tlsClientAuth, tlsExportedAuthenticator, ...rest } = cf
      rCf = rest
    }
    this.metadata = {
      user: {
        id: 0
      },
      request: {
        url: request.url,
        method: request.method,
        headers: buildMetadataFromHeaders(request.headers),
        cf: rCf
      },
      cloudflare_worker: {
        version: opts.version,
        commit: opts.commithash,
        branch: opts.branch,
        worker_id: nanoid(10),
        worker_started: this.startTs
      }
    }

    // As this class must be instantiated once per request, we can automatically
    // start the timing of the request here
    this.time('request')
  }

  _date () {
    const now = Date.now()
    if (now === this.currentTs) {
      const dt = new Date().toISOString()
      /**
       * Fake increment the datetime string to order the logs entries
       * It won't leap seconds but for most cases it will increment by 1 the datetime milliseconds
       */
      const newDt = dt.replace(/\.(\d*)Z/, (s, p1, p2) => {
        return `.${String(Number(p1) + this.logEventsBatch.length)}Z`
      })
      return new Date(newDt).toISOString()
    } else {
      this.currentTs = now
      return new Date().toISOString()
    }
  }

  /**
   * Add log entry to batch
   *
   * @param {any} body
   */
  _add (body: any) {
    this.logEventsBatch.push(body)
  }

  async postBatch () {
    if (this.logEventsBatch.length > 0) {
      const batchInFlight = [...this.logEventsBatch]
      this.logEventsBatch = []
      const rHost = batchInFlight[0].metadata.request.headers.host
      const body = JSON.stringify(batchInFlight)
      const request = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.opts?.token}`,
          'Content-Type': 'application/json',
          'User-Agent': `Cloudflare Worker via ${rHost}`
        },
        body
      }
      const resp = await fetch(logtailApiURL, request)
      if (this.opts?.debug) {
        console.info(
          `[${this._date()}]`,
          `${batchInFlight.length} logs pushed with status ${resp.status}.`
        )
      }
    }
  }

  /**
   * End instance, push logs and servers timings
   *
   * @param {Response} response
   */
  async end (response: Response) {
    if (this._finished) {
      throw new Error(
        `end() has already been called on this Logging instance.
        You must make a new instance per request.`
      )
    }
    this._finished = true
    if (this.opts?.debug) {
      response.headers.set('Server-Timing', this._timersString())
    }
    // Automatically stop the timer of the request
    this.timeEnd('request')

    const run = async () => {
      const dt = this._date()
      const duration = Date.now() - this.startTs
      const log = {
        message: '',
        dt,
        level: 'info',
        metadata: {
          ...this.metadata,
          response: {
            headers: buildMetadataFromHeaders(response.headers),
            status_code: response.status,
            duration
          }
        }
      }
      this._add(log)
      await this.postBatch()
    }
    this.ctx.waitUntil(run())
    return response
  }

  /**
   * Log
   *
   * @param {string | Error} message
   * @param {'debug' | 'info' | 'warn' | 'error'} level
   * @param {any} [context]
   * @param {any} [metadata]
   */
  log (message: string | Error, level: LogLevels, context: any, metadata?: any) {
    const dt = this._date()
    let log = {
      dt,
      level,
      metadata: { ...this.metadata, ...metadata },
      ...context
    }

    // This array of errors not to send to Sentry could be configurable in the
    // constructor if we want to keep this Logging class more generic
    const skipForSentry = this.opts.skipForSentry

    if (message instanceof Error) {
      log = {
        ...log,
        stack: message.stack,
        message: message.message
      }
      if (
        this.opts.sentry &&
        (skipForSentry != null) &&
        !skipForSentry.some((cls) => message instanceof Error)
      ) {
        this.opts.sentry.captureException(message)
      }
      if (this.opts?.debug) {
        console[level](`[${dt}]`, message)
      }
    } else {
      log = {
        ...log,
        message
      }
      if (this.opts?.debug) {
        console[level](`[${dt}]`, log.message, context)
      }
    }

    this._add(log)
  }

  /**
   * @param {string} message
   * @param {any} [context]
   */
  debug (message: string, context: ExecutionContext) {
    return this.log(message, 'debug', context)
  }

  /**
   * @param {string} message
   * @param {any} [context]
   */
  info (message: string, context: ExecutionContext) {
    return this.log(message, 'info', context)
  }

  /**
   * @param {string} message
   * @param {any} [context]
   */
  warn (message: string, context: ExecutionContext) {
    return this.log(message, 'warn', context)
  }

  /**
   * @param {string | Error} message
   * @param {any} [context]
   */
  error (message: string | Error, context: ExecutionContext) {
    return this.log(message, 'error', context)
  }

  /**
   * Start a timer to be logged under the given name.
   *
   * @param {string} name
   * @param {string} [description]
   */
  time (name: string, description?: string) {
    if (this._times.get(name)) {
      return console.warn(`A timer named ${name} has already been started`)
    }
    this._times.set(name, {
      name: name,
      description: description,
      start: Date.now()
    })
    this._timesOrder.push(name)
  }

  /**
   * End the timer of the given name.
   *
   * @param {string} name
   */
  timeEnd (name: string) {
    const timeObj = this._times.get(name)
    if (!timeObj) {
      return console.warn(`No such name ${name}`)
    }
    this._times.delete(name)
    const end = Date.now()
    const duration = end - timeObj.start
    const value = duration
    timeObj.value = value
    this._times.set(name, {
      ...timeObj,
      end,
      duration
    })

    if (this.opts?.debug) {
      console.log(`[${this._date()}]`, `${name}: ${duration} ms`)
    }
    return timeObj
  }

  _timersString () {
    const result = []
    for (const key of this._timesOrder) {
      const { name, duration, description } = this._times.get(key)
      result.push(
        description
          ? `${name}desc='${description}'dur=${duration}`
          : `${name}dur=${duration}`
      )
    }

    return result.join(',')
  }
}
