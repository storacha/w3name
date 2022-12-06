/**
 * A workaround for the fact that @cloudflare/worker-types doesn't yet include a type for the
 * object which gets attached to the environment as the "Workers Analytics Engine dataset".
 * This is a type which has a `writeDataPoint` method. See:
 * https://developers.cloudflare.com/analytics/analytics-engine/get-started/#3-write-data-from-the-workers-runtime-api
 * So we define this interface (again) here, which means that locally we get the type available, and
 * in production the type definition might not be identical, but hopefully so long as they match in
 * so far as the properties/methods that we access, once in JS it won't matter and it will still work.
 * https://www.npmjs.com/package/@cloudflare/workers-types
 */

export interface AnalyticsEngineDataset {
  writeDataPoint: (event: object) => void
}
