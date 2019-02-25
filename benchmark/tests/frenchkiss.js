const frenchKiss = require('../../dist/umd/frenchkiss.js');

module.exports = {
  name: 'FrenchKiss.js',
  prepare() {
    frenchKiss.locale('fr');
    frenchKiss.set('fr', {
      raw_string: 'Hello there',
      interpolate: 'Hello {name1} and {name2} and {name1} again.',
      plural:
        'There {N,plural,=0{is no one}=1{is someone}other{are people}} here.',
      plural_interpolate:
        'There is {name1} and {N,plural,=0{no one}=1{one person}other{{N} people}} here.',
    });
  },
  execute(key) {
    return frenchKiss.t(key, {
      name1: 'John',
      name2: 'Alice',
      N: 5,
    });
  },
};
