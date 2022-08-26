// @ts-ignore
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      preserveModules: true,
      format: 'esm',
      entryFileNames: '[name].mjs',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    typescript()
  ]
}
