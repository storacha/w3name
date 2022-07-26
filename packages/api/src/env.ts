export interface Env {
  NAME_ROOM: DurableObjectNamespace
  IPNS_RECORD: DurableObjectNamespace
  REBROADCAST_INTERVAL_MS: number
  PUBLISHER_AUTH_SECRET: string
  PUBLISHER_ENDPOINT_URL: string
}
