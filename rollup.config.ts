// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const config = {
  input: 'src/index.ts',
  output: {
    esModule: true,
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [typescript(), nodeResolve({ preferBuiltins: true }), commonjs()],
  external: [
    '@actions/core',
    '@actions/github',
    'universal-user-agent',
    '@octokit/core',
    '@octokit/request',
    '@octokit/graphql',
    '@octokit/endpoint',
    'config',
    'semver'
  ]
}

export default config
