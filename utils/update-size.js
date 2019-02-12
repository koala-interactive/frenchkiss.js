'use strict';

const fs = require('fs');
const path = require('path');

const encoding = 'utf-8';
const filePath = fileName => path.join(process.cwd(), fileName);
const sizePath = filePath('.size-snapshot.json');
const readmePath = filePath('README.md');
const sizeInfo = require(sizePath);

let template = fs.readFileSync(readmePath, { encoding });
let matches = template.match(/size[^)]+\)\]\(([^)]+)/);

if (matches) {
  const absolutePath = filePath(matches[1]);
  const key = Object.keys(sizeInfo).find(
    path => filePath(path) === absolutePath
  );

  if (key) {
    let size = sizeInfo[key].gzipped;
    let unit = 'B';

    if (size / 1024 >= 1.1) {
      unit = 'kB';
      size = (size / 1024).toFixed(1);
    }

    template = template.replace(
      /%20size-([^%]+)%20\w+/i,
      encodeURIComponent(' size-' + size + ' ' + unit)
    );

    fs.writeFileSync(readmePath, template, encoding);
  }
}

fs.unlinkSync(sizePath);
