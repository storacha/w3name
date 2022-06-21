// @ts-nocheck

export class JSONResponse extends Response {
  constructor (bodyInit?: BodyInit | null, maybeInit?: ResponseInit | Response) {
    maybeInit.headers = (maybeInit.headers != null) || {}
    maybeInit.headers['Content-Type'] = 'application/json;charset=UTF-8'
    super(JSON.stringify(body), init)
  }
}

export function notFound (message = 'Not Found'): JSONResponse {
  return new Response(message, { status: 404, headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
}
