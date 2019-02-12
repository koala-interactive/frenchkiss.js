/* eslint-env node */

import fs from 'fs';
import path from 'path';

import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const { version, license, name } = require('./package.json');
const licenseData = fs.readFileSync(path.join(process.cwd(), 'LICENSE.md'), {
  encoding: 'utf-8',
});

const bannerPlugin = {
  banner: `/**
 * @license ${name} ${version}
 * ${licenseData.split('\n', 1)}
 * License: ${license}
 */`,
};

const optimizeReplace = {
  name: 'optimizeReplace',
  transform: code =>
    code
      .replace(/(var|const) TYPE_[^\n]+/g, '')
      .replace(/TYPE_TEXT/g, '0')
      .replace(/TYPE_VARIABLE/g, '1')
      .replace(/TYPE_EXPRESSION/g, '2')
      .replace(/export var /g, 'var '), // Only needed in esm
};

const exportFormat = format => ({
  input: 'src/frenchkiss.js',
  output: {
    name,
    file: `dist/${format}/frenchkiss.js`,
    format,
  },
  plugins: [
    bannerPlugin,
    format === 'esm' ? null : babel(),
    optimizeReplace,
    terser({
      toplevel: true,
      compress: {
        unsafe: true,
      },
      output: { comments: /@license/ }
    }),
    sizeSnapshot(),
  ].filter(v => v),
  external: ['src/compiler.js'],
});

export default ['umd', 'cjs', 'esm'].map(exportFormat);
