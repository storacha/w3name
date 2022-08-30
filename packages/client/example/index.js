import * as Name from 'w3name'

async function createName () {
  const name = await Name.create()
  console.log('Name:', name.toString())
  // e.g. k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt

  // The value that you want to publish in your record.
  const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
  const revision = await Name.v0(name, value)
  console.log(`💿 Created new IPNS record /ipns/${name} => ${revision.value} (seqno ${revision.sequence})`)
  console.log('⏳ Publishing to w3name...')
  const res = await Name.publish(revision, name.key)
  console.log(`✅ Done: ${res}`)

  console.log('⏳ Resolving current value...')
  const curRevision = await Name.resolve(name)
  console.log(`👉 Current value: ${curRevision.value}\n`)

  // Make a revision to our record to point to a new value
  const nextValue = '/ipfs/bafybeiauyddeo2axgargy56kwxirquxaxso3nobtjtjvoqu552oqciudrm'
  const nextRevision = await Name.increment(revision, nextValue)
  console.log(`💿 Created new revision of IPNS record /ipns/${name} => ${nextRevision.value} (seqno ${nextRevision.sequence})`)

  console.log('⏳ Publishing to w3name...')
  await Name.publish(nextRevision, name.key)
  console.log(`✅ Done: ${res}`)

  console.log('⏳ Resolving current value...')
  const newCurRevision = await Name.resolve(name)
  console.log(`👉 Current value: ${newCurRevision.value}\n`)
}

createName()
