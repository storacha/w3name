import type { AnalyticsEngineDataset } from '../../src/analytics-types'

/**
 * Miniflare doesn't yet have support for Analytics Engine, so this class allows us to fake it and
 * check the datapoints which have been passed to it.
 */
export class MockAnalyticsDataset implements AnalyticsEngineDataset {
  datapoints: object[] = []

  async writeDataPoint (datapoint: object) {
    this.datapoints.push(datapoint)
  }

  reset () {
    this.datapoints.splice(0, this.datapoints.length)
  }
}
