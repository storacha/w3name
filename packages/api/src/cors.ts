/* eslint-env serviceworker */
import type { RequestHandler } from 'itty-router'

/**
 * Handler for CORS OPTIONS requests.
 */
export function corsOptions (request: Request): Response {
  const headers = request.headers
  // Make sure the necessary headers are present for this to be a valid pre-flight request
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    function headerOrDefault (key: string, fallback: string): string {
      const value = headers.get(key)
      if (value !== '' && value !== null) {
        return value
      }
      return fallback
    }
    // Handle CORS pre-flight request.
    /** @type {Record<string, string>} */
    const respHeaders = {
      'Content-Length': '0',
      'Access-Control-Allow-Origin': headerOrDefault('origin', '*'),
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Max-Age': '86400',
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers':
        headerOrDefault('Access-Control-Request-Headers', '')
    }

    return new Response(null, {
      status: 204,
      headers: respHeaders
    })
  } else {
    return new Response('Non CORS options request not allowed', {
      status: 405,
      statusText: 'Method Not Allowed'
    })
  }
}

/**
 * Wraps a handler which adds CORS headers to the responses.
 */
export function withCorsHeaders (handler: RequestHandler<Request>): RequestHandler<Request> {
  return async (request: Request, ...rest: any[]): Promise<Response> => {
    const response = await handler(request, ...rest)
    return addCorsHeaders(request, response)
  }
}

/**
 * Adds CORS headers to an already-generated response.
 */
export function addCorsHeaders (request: Request, response: Response): Response {
  // Clone the response so that it's no longer immutable (like if it comes from cache or fetch)
  response = new Response(response.body, response)
  const origin = request.headers.get('origin')
  if (origin !== '' && origin !== null) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*')
  }
  return response
}
