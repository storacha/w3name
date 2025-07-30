import type { Env } from './env.js'

export interface BroadcastData {
  key: string
  value: string
  record: string
}

/**
 * A Cloudflare Durable Object. Each instance is a group of users interested in
 * a particular IPNS key ID. The static API is used by workers to communicate
 * with it.
 */
export class NameRoom {
  sessions: Array<{ webSocket: WebSocket }>

  constructor (state: DurableObjectState, env: Env) {
    this.sessions = []
  }

  async fetch (request: Request): Promise<Response> {
    const url = new URL(request.url)
    switch (url.pathname) {
      // create new websocket connection
      case '/websocket': {
        if (request.headers.get('Upgrade') !== 'websocket') {
          return new Response('expected websocket upgrade', { status: 400 })
        }
        const [client, server] = Object.values(new WebSocketPair())
        // @ts-expect-error TODO investigate why accept is not available via types
        server.accept()

        const session = { webSocket: server }
        this.sessions.push(session)

        const closeOrErrorHandler = (): void => {
          this.sessions = this.sessions.filter(s => s !== session)
        }
        server.addEventListener('close', closeOrErrorHandler)
        server.addEventListener('error', closeOrErrorHandler)

        return new Response(null, { status: 101, webSocket: client })
      }
      // broadcast an updated value to everyone in the room
      case '/broadcast': {
        const data = await request.text?.()
        for (const session of this.sessions) {
          session.webSocket.send(data)
        }
        return new Response()
      }
      default:
        return new Response('not found', { status: 404 })
    }
  }

  static async join (req: Request, ns: DurableObjectNamespace, ipnsKey: string): Promise<Response> {
    const roomId = ns.idFromName(ipnsKey)
    const room = ns.get(roomId)
    const url = new URL('/websocket', req.url)
    return await room.fetch(url.toString(), req)
  }

  static async broadcast (req: Request, ns: DurableObjectNamespace, ipnsKey: string, data: BroadcastData): Promise<Response> {
    const roomId = ns.idFromName(ipnsKey)
    const room = ns.get(roomId)
    const url = new URL('/broadcast', req.url)
    return await room.fetch(url.toString(), { method: 'POST', body: JSON.stringify(data) })
  }
}
