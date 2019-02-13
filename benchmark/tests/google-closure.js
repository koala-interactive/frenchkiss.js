/* globals goog */

require('google-closure-library');
goog.require('goog.i18n.MessageFormat');

const dataMsg = {
  raw_string: 'Hello there',
  interpolate: 'Hello {name1} and {name2} and {name1} again.',
  plural: 'There {N,plural,=0{is no one}=1{is someone}other{are people}} here.',
  plural_interpolate:
    'There is {name1} and {N,plural,=0{no one}=1{one person}other{{N} people}} here.',
};

const cache = {};

module.exports = {
  name: 'google closure',
  beforeTest(key) {
    delete cache[key];
  },
  execute(key) {
    // To be fair, cache the result
    if (!cache[key]) {
      cache[key] = new goog.i18n.MessageFormat(dataMsg[key]);
    }

    return cache[key].format({
      name1: 'John',
      name2: 'Alice',
      N: 5,
    });
  },
};
