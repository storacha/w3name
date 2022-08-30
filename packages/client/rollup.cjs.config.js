// @ts-ignore
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: [
    {
      exports: 'auto',
      dir: 'dist',
      preserveModules: true,
      format: 'cjs',
      entryFileNames: '[name].cjs',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    commonjs(),
    typescript()
  ]
}
