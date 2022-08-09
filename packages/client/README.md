<h1 align="center">⁂<br/>w3name</h1>
<p align="center">The JavaScript API client for <a href="https://github.com/web3-storage/w3name">W3Name</a></p>

## Getting started

Install the package using npm

```console
npm install w3name
```

## Usage

### Mutability

#### Create and Publish

```js
import * as Name from 'w3name'

const name = await Name.create()

console.log('Name:', name.toString())
// e.g. k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt

// The value to publish
const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
const revision = await Name.v0(name, value)

await Name.publish(revision, name.key)
```

⚠️ Note: revisions live for 1 year after creation by default.

#### Resolve

```js
import * as Name from 'w3name'

const name = Name.parse('k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt')

const revision = await Name.resolve(name)

console.log('Resolved value:', revision.value)
// e.g. /ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
```

#### Update

Updating records involves creating a new _revision_ from the previous one.

```js
import * as Name from 'w3name'

const name = await Name.create()

const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
const revision = await Name.v0(name, value)

await Name.publish(revision, name.key)

// ...later

const nextValue = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
// Make a revision to the current record (increments sequence number and sets value)
const nextRevision = await Name.increment(revision, nextValue)

await Name.publish(nextRevision, name.key)
```

#### Signing Key Management

The private key used to sign IPNS records should be saved if a revision needs to be created in the future.

```js
import * as Name from 'w3name'
import fs from 'fs'

// Creates a new "writable" name with a new signing key
const name = await Name.create()

// Store the signing key to a file for use later
await fs.promises.writeFile('priv.key', name.key.bytes)

// ...later

const bytes = await fs.promises.readFile('priv.key')
const name = await Name.from(bytes)

console.log('Name:', name.toString())
// e.g. k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt
```

#### Revision Serialization/Deserialization

The current revision for a name may need to be serialized to be stored on disk or transmitted and then deserialized later. Note that revisions are _not_ IPNS records - they carry similar data, but are not signed.

```js
import * as Name from 'w3name'
import fs from 'fs'

const { Revision } = Name
const name = await Name.create()
const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
const revision = await Name.v0(name, value)

// Store the record to a file for use later
// Note: Revision.encode does NOT encode signing key data
await fs.promises.writeFile('ipns.revision', Revision.encode(rev))

// ...later

const bytes = await fs.promises.readFile('ipns.revision')
const revision = Revision.decode(bytes)
```
