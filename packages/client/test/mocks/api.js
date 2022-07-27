import http from 'http'
import * as uint8arrays from 'uint8arrays'
import * as ipns from 'ipns'

// Memory object to mock db
const db = new Map()

// Make our HTTP server
const server = http.createServer((req, res) => {
  if (!req.url) {
    throw Error('No url passed to mock server')
  }

  const reqUrl = req.url
  if (reqUrl?.startsWith('/name/')) {
    const key = reqUrl.split('/').at(-1)

    if (req.method === 'POST') {
      // Save the data to the mocked DB.
      req.on('data', chunk => {
        db.set(key, chunk.toString())
      })

      req.on('end', () => {
        res.end()
      })
    }

    if (req.method === 'GET') {
      let record
      let entry
      // Retrieve saved data from the mocked db.
      switch (key) {
        // Mock a JSON Error to ensure it's handled by the client.
        case 'json-error':
          res.setHeader('Content-Type', 'application/json;charset=UTF-8')
          res.statusCode = 500
          res.write(
            JSON.stringify({ message: 'throw an error for the tests' })
          )
          break

        // Mock a text/plain Error to ensure it's handled by the client.
        case 'text-error':
          res.setHeader('Content-Type', 'text/plain')
          res.statusCode = 500
          res.write(
            'throw an error for the tests'
          )
          break

        // Return the stored key from the mocked db.
        default:
          record = uint8arrays.fromString(db.get(key), 'base64pad')
          entry = ipns.unmarshal(record)
          res.write(
            JSON.stringify({
              value: uint8arrays.toString(entry.value, 'base64pad'),
              record: db.get(key)
            })
          )
          break
      }

      res.end()
    }
  }
})

export default server
