# w3name API

The HTTP interface implemented as a Cloudflare Worker.

## API endpoints

The API exposes the following endpoints.

All endpoints return JSON objects for both successful responses and error conditions. In the event of an error, the response will have a non-200 status code, and the JSON response will include a `message` field with details about the error.

### GET `/name/:key` - get the current record for a name

Returns the current value for a given `:key`, where `:key` is a string-encoded name identifier, for example, `k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt`.

On success, returns an object of the form:

```json
{
  "value": "the current value, as a string",
  "record": "the full IPNS record for the current value, encoded to a binary form and base64pad encoded"
}
```

Will return a `404` status code if the requested key has not been published in the w3name service. Note that keys published through other IPNS implementations will return a `404` from this endpoint, as it does not consult the IPFS DHT.

### POST `/name/:key` - set the current value for a name

Accepts a base64pad encoded IPNS record as the request body and sets it as the current value for the given `:key`, if the record is valid.

The `:key` path parameter must be a valid string-encoded name identifier, for example, `k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt`.

A record is considered valid if all of the following are true:

- It contains an embedded public key that matches the public key embedded in the `:key` string
- It contains a valid signature from the corresponding private key 
- It has a validity date set to a time in the future

Additionally, if there already exists a current record for the given name, the new record must meet one of the following criteria in order to overwrite the existing record:

- The candidate record has a greater sequence number than the current record.
- The sequence numbers are equal, but the candidate has a longer validity period than the current record.
- Both the sequence number and validity period are equal, but the candidate record is longer than the current record.

### GET `/name/:key/watch` - receive updates via websocket when new values are published to a name

Watches the given `:key` for changes, pushing updated values onto a websocket as new records are published.

To use this endpoint, your request must include an `Upgrade` header with the value set to `websocket`, and your client must be capable of handling a websocket upgrade response.

When a new record is published, the websocket will receive an object with the following shape:

```json
{
  "key": "the string-encoded name",
  "value": "the latest value that was published, as a string",
  "record": "the full IPNS record for the current value, encoded to a binary form and base64pad encoded"
}
```

## Getting started

### Tests

* Run tests with `npm run test`

### Development server

* Install Wrangler `npm install -g wrangler`
* Run `wrangler dev` or `npm run dev`

### Publish

* Install Wrangler `npm install -g wrangler`
* Authenticate Wrangler `wrangler login`
* Publish with `wrangler publish`
