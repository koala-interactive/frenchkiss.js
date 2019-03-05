const translate = require('translate.js');

let t

module.exports = {
  name: 'translate.js',
  prepare() {
    t = translate({
      raw_string: 'Hello there',
      interpolate: 'Hello {name1} and {name2} and {name1} again.',
      plural: {
        0: 'There is no one here.',
        1: 'There is someone here.',
        n: 'There are people here.',
      },
      plural_interpolate: {
        0: 'There is {name1} and no one here.',
        1: 'There is {name1} and one person here.',
        n: 'There is {name1} and {n} people here.',
      },
    });
  },
  execute(key) {
    if (key === 'raw_string')
      return t(key)

    return t(key, 5, {
      name1: 'John',
      name2: 'Alice',
    });
  },
};
