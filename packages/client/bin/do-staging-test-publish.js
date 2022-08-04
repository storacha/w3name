#!/usr/bin/env node
/* eslint-disable no-console */

import * as Name from 'w3name'
import { W3NameService } from 'w3name/service'

const stagingAPIURL = new URL('https://w3name-staging.protocol-labs.workers.dev/')

/**
 * Publish a test record to the staging API.
 * This is part of the deployment process for staging to ensure that the deployed new
 * Cloudflare Worker works.
 */
async function doStagingTestPublish () {
  console.log('Doing publish of test record to w3name staging...')
  const service = W3NameService(stagingAPIURL)

  // This creates a new private key each time, which means we're slightly cluttering
  // the DHT with this, hence the short validity.
  const name = await Name.create()
  const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
  const oneHourValidity = new Date(Date.now() + 1000 * 60 * 60).toISOString()
  const revision = new Name.Revision(name, value, 0n, oneHourValidity)
  await Name.publish(revision, name.key, service)
  console.log('Looks good.')

  console.log('⏳ Checking that we can resolve the name...')
  const resolved = await Name.resolve(name, service)
  if (resolved.value !== value) {
    throw new Error(
      `Resolved value ('${resolved.value}') did not match original value ('${value}').`
    )
  }
  console.log('✅ Success!')
}

doStagingTestPublish()
