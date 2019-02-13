const i18nJS = require('i18n-js');

module.exports = {
  name: 'i18n-js',
  prepare() {
    i18nJS.locale = 'en';
    i18nJS.translations['en'] = {
      raw_string: 'Hello there',
      interpolate: 'Hello {{name1}} and {{name2}} and {{name1}} again.',
      plural: {
        zero: 'There is no one here.',
        one: 'There is someone here.',
        other: 'There are people here.',
      },
      plural_interpolate: {
        zero: 'There is {{name1}} and no one here.',
        one: 'There is {{name1}} and one person here.',
        other: 'There is {{name1}} and {{count}} people here.',
      },
    };
  },
  execute(key) {
    return i18nJS.t(key, {
      name1: 'John',
      name2: 'Alice',
      count: 5,
    });
  },
};