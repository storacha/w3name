// @ts-nocheck
import fetch from '@web-std/fetch'

export async function retryFetch (url, options, retryOptions = {
  successStatuses: [200],
  maxAttempts: 5,
  retryDelayMs: 500,
  retryDelayMultiplier: 2
}) {
  let attempts = 0
  while (attempts < retryOptions.maxAttempts) {
    attempts++
    const response = await fetch(url, options)
    if (retryOptions.successStatuses.includes(response.status)) {
      return response
    } else {
      console.log(`fetch request to ${url} returned status ${response.status}`)
      if (attempts < retryOptions.maxAttempts) {
        const delayMs = retryOptions.retryDelayMs * retryOptions.retryDelayMultiplier ** (attempts - 1)
        console.log(`Will retry after ${delayMs} milliseconds (attempt ${attempts})...`)
        await delay(delayMs)
      } else {
        console.log(`Giving up after ${attempts} attempts.`)
        throw Error(`Failed to fetch from URL ${url}.`)
      }
    }
  }
}

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
