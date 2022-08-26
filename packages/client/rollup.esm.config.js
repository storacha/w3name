// @ts-ignore
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      // inlineDynamicImports: true,
      // file: 'dist/bundle.esm.min.js',
      dir: 'dist',
      preserveModules: true,
      format: 'esm',
      entryFileNames: '[name].mjs',
      // plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    // commonjs(),
    // resolve({
    //   preferBuiltins: false,
    //   browser: true
    // }),
    // json(),
    typescript()
  ]
}
