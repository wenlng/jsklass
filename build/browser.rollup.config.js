/*browser.rollup.config.js*/
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify-es';

export default {
  input: './src/release/browser.js',
  output: {
    name: "JsKlass",
    file: './release/jsklass-browser/lib/jsklass.js',
    format: 'umd'    // (amd, cjs, es, iife, umdz)
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
      , babelrc: false
      , runtimeHelpers: true
      , presets: [ "es2015-rollup"]
    })
    , uglify()
  ]
}