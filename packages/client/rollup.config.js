// @ts-ignore
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: [
    {
      inlineDynamicImports: true,
      file: 'dist/bundle.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    commonjs(),
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    typescript()
  ]
}
