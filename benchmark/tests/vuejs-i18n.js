
const Vue = require('vue');
const VueI18n = require('vue-i18n');

let vueI18n;

module.exports = {
  name: 'Vue I18n',
  prepare() {
    Vue.use(VueI18n);
    vueI18n = new VueI18n({
      locale: 'en',
      messages: {
        en: {
          raw_string: 'Hello there',
          interpolate: 'Hello {name1} and %{name2} and {name1} again.',
          plural: 'There is someone here. | There are people here.',
          plural_interpolate:
            'There is %{name1} and one person here. | There is %{name1} and %{count} people here.',
        },
      },
    });
  },
  execute(key) {
    return vueI18n._tc(key, 'en', vueI18n._getMessages(), vueI18n, 5, {
      name1: 'John',
      name2: 'Alice',
    });
  },
};