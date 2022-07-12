// import * as Name from 'w3name';
// const Name = require('w3name');
import * as Name from 'w3name'

async function createName() {
  const name = await Name.create()
  console.log('Name:', name.toString())
  // e.g. k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt

  const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
  const revision = await Name.v0(name, value)
  console.log('revision', revision)
  const res = await Name.publish(revision, name.key)
  console.log('res', res)

}

createName();

