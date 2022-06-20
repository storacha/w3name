import { Miniflare } from 'miniflare'

let miniflareServer

/* export const mochaHooks = () => {

  return {
    async beforeAll() {
      // do something before every test
      console.log('⚡️ Starting Miniflare')
      miniflareServer = await new Miniflare({
        // Autoload configuration from `.env`, `package.json` and `wrangler.toml`
        envPath: true,
        packagePath: true,
        wranglerConfigPath: true,
        wranglerConfigEnv: 'test',
        modules: true,
        // bindings: workerGlobals
      }).startServer()
    },
    async afterAll() {
      if (miniflareServer) {
        console.log('🛑 Stopping Miniflare')
        miniflareServer.close()
      }
    }
  }
}; */

/* export async function mochaGlobalSetup() {
  console.log('⚡️ Starting Miniflare')
  this.miniflareServer = await new Miniflare({
    // Autoload configuration from `.env`, `package.json` and `wrangler.toml`
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,
    wranglerConfigEnv: 'test',
    modules: true,
    // bindings: workerGlobals
  }).startServer()
}

export async function mochaGlobalTeardown() {
  if (this.miniflareServer) {
    console.log('🛑 Stopping Miniflare')
    this.miniflareServer.close()
  }
} */
