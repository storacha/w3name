export class HTTPError extends Error {
  status: number

  constructor (message: string, status: number = 500) {
    super(message)
    this.name = 'HTTPError'
    this.status = status
  }

  static throw (message: string, status: number): HTTPError {
    throw new this(message, status)
  }
}
