/**
 * @typedef {object} Env
 * @property {DurableObjectNamespace} NAME_ROOM
 *
 * From: https://github.com/cloudflare/workers-types
 *
 * @typedef {{
 *  toString(): string
 *  equals(other: DurableObjectId): boolean
 *  readonly name?: string
 * }} DurableObjectId
 *
 * @typedef {{
 *   newUniqueId(options?: { jurisdiction?: string }): DurableObjectId
 *   idFromName(name: string): DurableObjectId
 *   idFromString(id: string): DurableObjectId
 *   get(id: DurableObjectId): DurableObjectStub
 * }} DurableObjectNamespace
 *
 * @typedef {{
 *   readonly id: DurableObjectId
 *   readonly name?: string
 *   fetch(requestOrUrl: Request | string, requestInit?: RequestInit | Request): Promise<Response>
 * }} DurableObjectStub
 */

/**
 * Modifies the given env object by adding other items to it, mostly things
 * which are configured from the initial env values.
 * @param {Request} req
 * @param {Env} env
 * @param {ExecutionContext} ctx
 */
export function envAll (req, env, ctx) {
}
