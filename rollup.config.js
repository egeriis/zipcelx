import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

function instantiateBabelPlugin() {
  return babel({
    babelrc: false,
    exclude: 'node_modules/**',
    presets: [['env', { modules: false }]]
  });
}

export default [
  // browser-friendly UMD build
  {
    input: 'src/standalone.js',
    output: {
      name: 'howLongUntilLunch',
      file: pkg['standalone-build'],
      format: 'umd'
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        exclude: [
          'node_modules/rollup-plugin-node-globals/**',
          'node_modules/rollup-plugin-node-builtins/**'
        ]
      }),
      globals(),
      builtins(),
      instantiateBabelPlugin(),
      uglify()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/zipcelx.js',
    external: Object.keys(pkg.dependencies),
    output: [
      { file: pkg.main, format: 'cjs' }
    ],
    plugins: [
      instantiateBabelPlugin(),
      uglify()
    ]
  },
  {
    input: 'src/zipcelx.js',
    external: Object.keys(pkg.dependencies),
    output: [
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      instantiateBabelPlugin()
    ]
  }
];
