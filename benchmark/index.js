/* eslint-env node */
/* eslint-disable no-console */
/* globals goog Promise */
'use strict';

const Benchmark = require('benchmark');
const frenchKiss = require('../dist/umd/frenchkiss.js');
const Polyglot = require('node-polyglot');
const i18nJS = require('i18n-js');
const Vue = require('vue');
const VueI18n = require('vue-i18n');
require('google-closure-library');

const suites = {};
const tests = {
  raw_string: 'Hello there',
  interpolate: 'Hello John and Alice and John again.',
  plural: 'There are people here.',
  plural_interpolate: 'There is John and 5 people here.',
};

const test = ({ name, prepare, beforeExecute, execute }) => {
  if (prepare) {
    prepare();
  }

  Object.entries(tests).forEach(([key, expected]) => {
    const success = execute(key) === expected;
    beforeExecute && beforeExecute(key);

    suites[key] = suites[key] || [];
    suites[key].push({
      name,
      success,
      test: () => execute(key),
    });
  });
};

// ------------------------------

let p;
test({
  name: 'polyglot',
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
});

// -------------------------------

test({
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
});

// -------------------------------

let vueI18n;
test({
  name: 'vuejs-i18n',
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
});

// ------------------------------

let dataMsg;
let result = {};
test({
  name: 'google closure',
  prepare() {
    goog.require('goog.i18n.MessageFormat');
    dataMsg = {
      raw_string: 'Hello there',
      interpolate: 'Hello {name1} and {name2} and {name1} again.',
      plural:
        'There {N,plural,=0{is no one}=1{is someone}other{are people}} here.',
      plural_interpolate:
        'There is {name1} and {N,plural,=0{no one}=1{one person}other{{N} people}} here.',
    };
  },
  beforeExecute(key) {
    delete result[key];
  },
  execute(key) {
    if (!result[key]) {
      result[key] = new goog.i18n.MessageFormat(dataMsg[key]);
    }

    return result[key].format({
      name1: 'John',
      name2: 'Alice',
      N: 5,
    });
  },
});

// ------------------------------

test({
  name: require('../package.json').name,
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
  beforeExecute(key) {
    // Reset cache to get the initial compile time in the result
    //console.log(frenchKiss.store.fr[key], frenchKiss.cache.fr[key].toString());
    delete frenchKiss.cache.fr[key];
  },
  execute(key) {
    return frenchKiss.t(key, {
      name1: 'John',
      name2: 'Alice',
      N: 5,
    });
  },
});

// ------------------------------

function createTestSuite(key, modules) {
  return new Promise(resolve => {
    console.log(
      '-- ' +
        key.replace(/_/g, ' ').toUpperCase() +
        ' -----------------------------------------'
    );

    let suite = new Benchmark.Suite();

    modules.forEach(lib => {
      suite = suite.add(lib.name, lib.test);
    });

    suite
      .on('cycle', function(event) {
        console.log(` ${event.target.toString()}`);
      })
      .on('complete', function() {
        const list = modules.map((v, i) => this[i]).sort((a, b) => b.hz - a.hz);
        const ref = list[0].hz;
        const a = (ref / list[1].hz).toFixed(1);
        const b = (ref / list[list.length - 1].hz).toFixed(1);

        console.log(
          `\x1b[32m ${
            list[0].name
          } is ${a} to ${b} times faster than others\x1b[0m`
        );
        resolve();
      })
      .run({ async: true });
  });
}

let promise = Promise.resolve();
Object.entries(suites).forEach(([key, modules]) => {
  promise = promise.then(() => createTestSuite(key, modules));
});
