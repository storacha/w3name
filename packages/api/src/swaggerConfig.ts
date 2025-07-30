import { jsonResponse, textResponse } from './utils/response-types.js'
import YAML from 'yaml'
import swaggerConfig from '../swagger-config.json'

export function toJSON () {
  return jsonResponse(
    JSON.stringify(swaggerConfig, null, 2)
  )
}

export function toYAML () {
  return textResponse(
    YAML.stringify(swaggerConfig)
  )
}
