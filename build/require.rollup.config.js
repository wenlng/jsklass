/*require.rollup.config.js*/
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify-es';

export default {
  input: './src/release/require.js',
  output: {
    file: './release/jsklass-require/lib/jsklass.js',
    format: 'cjs'    // (amd, cjs, es, iife, umdz)
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