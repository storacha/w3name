import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'
import git from 'git-rev-sync'
import Sentry from '@sentry/cli'

(async () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
  )

  try {
    // Release name cannot contain slashes, and are global per org, so we use
    // custom prefix here not pkg.name.
    // See https://docs.sentry.io/platforms/javascript/guides/cordova/configuration/releases/
    const sentryRelease = `w3name-api@${pkg.version}+${git.short(__dirname)}`
    console.log(`Building ${sentryRelease}`)

    await build({
      bundle: true,
      sourcemap: true,
      format: 'esm',
      target: 'esnext',
      external: ['__STATIC_CONTENT_MANIFEST'],
      conditions: ['worker', 'browser'],
      entryPoints: [path.join(__dirname, 'src', 'index.ts')],
      outdir: path.join(__dirname, 'dist'),
      outExtension: { '.js': '.mjs' },
      define: {
        SENTRY_RELEASE: JSON.stringify(sentryRelease),
        VERSION: JSON.stringify(pkg.version),
        COMMITHASH: JSON.stringify(git.long(__dirname)),
        BRANCH: JSON.stringify(git.branch(__dirname)),
        global: 'globalThis',
      },
    })

    // Sentry release and sourcemap upload
    if (process.env.SENTRY_UPLOAD === 'true') {
      console.log(`Uploading to Sentry ${sentryRelease}`)
      const cli = new Sentry(undefined, {
        authToken: process.env.SENTRY_TOKEN,
        org: 'storacha-it',
        project: 'w3name-api',
      })

      await cli.releases.new(sentryRelease)
      await cli.releases.setCommits(sentryRelease, {
        auto: true,
        ignoreEmpty: true,
        ignoreMissing: true,
      })
      await cli.releases.uploadSourceMaps(sentryRelease, {
        // validate: true,
        include: [path.join(__dirname, 'dist')],
        ext: ['map', 'mjs'],
        dist: git.short(__dirname),
      })
      await cli.releases.finalize(sentryRelease)
      await cli.releases.newDeploy(sentryRelease, { env: process.env.ENV })
    }
  } catch (err) {
    process.exitCode = 1
    throw new Error('build failed', { cause: err })
  }
})()
