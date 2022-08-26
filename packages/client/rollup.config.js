// @ts-ignore
import multiInput from 'rollup-plugin-multi-input'
import typescript from '@rollup/plugin-typescript'

const config = [
  ['src', 'dist/src'],
  ['test', 'dist/test']
].map(([base, dest]) => ({
  input: [`${base}/**/*.{ts,js}`],
  output: {
    dir: dest,
    preserveModules: true,
    sourcemap: true,
    format: 'cjs',
    entryFileNames: '[name].cjs'
  },
  plugins: [multiInput({ relative: base }), typescript()]
}))
export default config
