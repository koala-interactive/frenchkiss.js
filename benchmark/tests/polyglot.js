const Polyglot = require('node-polyglot');

let p;

module.exports = {
  name: 'Polyglot.js',
  prepare() {
    p = new Polyglot();
    p.locale('fr');
    p.extend({
      raw_string: 'Hello there',
      interpolate: 'Hello %{name1} and %{name2} and %{name1} again.',
      plural: 'There is someone here. |||| There are people here.',
      plural_interpolate:
        'There is %{name1} and one person here. |||| There is %{name1} and %{smart_count} people here.',
    });
  },
  execute(key) {
    return p.t(key, {
      name1: 'John',
      name2: 'Alice',
      smart_count: 5,
    });
  },
};