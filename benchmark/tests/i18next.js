const i18next = require('i18next');
const intervalPlural = require('i18next-intervalplural-postprocessor');

module.exports = {
  name: 'i18next',
  prepare() {
    i18next.use(intervalPlural).init({
      lng: 'en',
      resources: {
        en: {
          translation: {
            raw_string: 'Hello there',
            interpolate: 'Hello {{name1}} and {{name2}} and {{name1}} again.',
            plural:
              '(0){There is no one here.};(1){There is someone here.};(2-inf){There are people here.};',
            plural_interpolate:
              '(0){There is {{name1}} and no one here.};(1){There is {{name1}} and one person here.};(2-inf){There is {{name1}} and $t(plural_hack) people here.};',
            plural_hack: '{{count}}',
          },
        },
      },
    });
  },
  execute(key) {
    return i18next.t(key, {
      name1: 'John',
      name2: 'Alice',
      count: 5,
      postProcess: 'interval',
    });
  },
};
