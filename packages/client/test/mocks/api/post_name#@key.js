// @ts-nocheck
/* eslint-disable */

const db = {}

module.exports = async ( {params, body}) => {
  db[params.key] = body.value
  return {
    statusCode: 200,
    body: {}
  }
}

module.exports.db = db
