/*import.rollup.config.js*/
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify-es';

export default {
  input: './src/release/import.js',
  output: {
    file: './release/jsklass-import/lib/jsklass.js',
    format: 'es'    // (amd, cjs, es, iife, umdz)
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
      , babelrc: false
      , runtimeHelpers: true
    })
    , uglify()
  ]
}