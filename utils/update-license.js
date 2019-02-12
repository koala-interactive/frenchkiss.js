'use strict';

const fs = require('fs');
const path = require('path');

const encoding = 'utf-8';
const licensePath = path.join(process.cwd(), 'LICENSE.md');
const template = fs.readFileSync(licensePath, { encoding });

fs.writeFileSync(
  licensePath,
  template.replace(/(\d+)-(\d+)/, '$1-' + new Date().getFullYear()),
  encoding
);
