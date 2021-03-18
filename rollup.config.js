const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript')
const {terser} = require('rollup-plugin-terser')

module.exports = (isDev) => {
  return [
    json(),
    resolve({
      browser: true,
      extensions: ['.ts', 'ejs']
    }),
    commonjs(),
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
      tsconfig: './rollup.json'
    }),
    !isDev && terser()
  ]
}