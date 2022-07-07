<h1 align="center">⁂<br/>w3name</h1>
<p align="center">Content addressing for a dynamic web.</p>

## Usage

w3name is a service and client library that implements IPNS, which is a protocol that uses public key cryptography to allow for updatable naming in an atomically verifiable way. This means the service is trustless, since all updates can be verified to have come from the associated keypair.


### Website
TODO: Add website readme here!

### JS Client

Use npm to install the [`w3name`]() module into your JS project, create an new w3name key with `Name.create()`, add a revision with `Name.v0({name}, {CID})` and publish the revision with `Name.publish({revision}, {key})`

**node.js**
```js
import * as Name from 'w3name'

const name = await Name.create()

const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
const revision = await Name.v0(name, value)

await Name.publish(revision, name.key)
```

See https://github.com/web3-storage/w3name/blob/main/packages/client/README.md for a guide to using the js client for the first time.

### cURL

TODO: Add cURL instructions here!

**See https://github.com/web3-storage/w3name/tree/main/packages/api for our complete documentation 📖🔍**


## Building w3name

Want to help us improve w3name? Great! This project uses node v16 and npm v7. It's a monorepo that use [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to handle resolving dependencies between the local `packages/*` folders.

Install the deps with `npm`

```console
# install deps
npm install
```

Run all the things with `npm start`.

```console
# start the api
npm start
```

## Monorepo

This project is a monorepo that uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

All `npm` commands should be run from the root of the repo. To run a command for a specific package add the `--workspace` or `-w` flag

```console
# Start just the api
npm run dev -w packages/api
```

To add a new workspace (aka package) to the monorepo

```console
# adds the path to the `website` package to the `workspaces` property in package.json
npm init -w packages/website
```

To run an npm script in one or more workspaces

```console
# run test commmand in package `a` and `b`
npm run test --workspace=packages/a --workspace=packages/b
```

## Testing

Each workspace has its own suite of testing tools, which you can learn more about in the relevant `packages/*` directory.

## Learn more

To learn more about the w3name service, or find detailed documentation for the JS client library and API, please head over to TODO: Add website url


<p align="center">
  <a href="">⁂</a>
</p>
