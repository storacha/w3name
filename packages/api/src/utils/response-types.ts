export function notFound (message: string = 'Not Found'): Response {
  return jsonResponse(JSON.stringify({ message }), 404)
}

export function jsonResponse (body: string, status: number = 200): Response {
  return new Response(body, { status, headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
}

export function textResponse (body: string, status: number = 200): Response {
  return new Response(body, { status, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } })
}
