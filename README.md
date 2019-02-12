# FrenchKiss.js

[![Build Status](https://travis-ci.com/koala-interactive/frenchkiss.js.svg)](https://travis-ci.com/koala-interactive/frenchkiss.js)
[![File size](https://img.shields.io/badge/GZIP%20size-1021%20B-brightgreen.svg)](./dist/umd/frenchkiss.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

FrenchKiss.js is a blazing fast lightweight i18n helper library written in JavaScript, working both in the browser and NodeJS environments. It provides a simple and really fast solution for handling internationalization.

FrenchKiss is by now, _the fastest i18n JS package_ out there, working **5 to 1000 times faster** than any others by **JIT compiling** the translations, try it by running the benchmarks !

---

## 🚀 Installation

Install with [yarn](https://yarnpkg.com):

    $ yarn add frenchkiss

Or install using [npm](https://npmjs.org):

    $ npm i frenchkiss

## ⏳ Running the tests

    $ npm test

## ⚙️ Running the benchmarks

    $ cd benchmark
    $ yarn
    $ node .

|                |            Raw String |           Interpolate |                Plural |  Plural + Interpolate |
| :------------- | --------------------: | --------------------: | --------------------: | --------------------: |
| vuejs-i18n     |        79,205 ops/sec |        73,128 ops/sec |        73,128 ops/sec |        49,862 ops/sec |
| google closure |       379,684 ops/sec |        35,172 ops/sec |        35,172 ops/sec |        21,972 ops/sec |
| i18n-js        |        86,734 ops/sec |        48,019 ops/sec |        48,194 ops/sec |        16,140 ops/sec |
| Polyglot       |         3,769 ops/sec |         3,563 ops/sec |         3,220 ops/sec |         3,196 ops/sec |
| **frenchkiss** | **4,023,760 ops/sec** | **2,286,641 ops/sec** | **3,042,214 ops/sec** | **1,383,317 ops/sec** |

---

## 📖 Documentation

- [frenchkiss.locale()](#frenchkisslocalelanguage-string-string)
- [frenchkiss.set()](#frenchkisssetlanguage-string-table-object)
- [frenchkiss.t()](#frenchkisstkey-string-params-object-lang-string-string)
- [frenchkiss.extend()](#frenchkissextendlanguage-string-table-object)
- [frenchkiss.unset()](#frenchkiss.unsetlanguage-string)
- [frenchkiss.fallback()](#frenchkissfallbacklanguage-string-string)
- [frenchkiss.onMissingKey()](#frenchkissonMissingKeyfn-Function)
- [SELECT expression](#select-expression)
- [PLURAL expression](#plural-expression)
- [Plural category](#plural-category)
- [Nested expressions](#nested-expressions)

### Minimal code

Tell FrenchKiss what to returns by simply giving it a table object, where the key is the search reference and the value is the already-translated string.

```js
import frenchkiss from 'frenchkiss';

// Define the locale language
frenchkiss.locale('en');

// Add translations in each languages
frenchkiss.set('en', {
  hello: 'Hello {name} !',
  goodbye: 'Bye !',
  // and other sentences...
});

frenchkiss.t('hello', {
  name: 'John',
}); // => 'Hello John !'
```

---

### frenchkiss.locale(language?: string): string

Get or set the locale, it will define what table FrenchKiss have to work with.

> **Note:** If you are working with NodeJS and concurrent requests, you can use the third parameter (language) of `t()` to avoid language collision.

---

### frenchkiss.set(language: string, table: object)

Define the translation table for the language. Any call to the specified language erase all the previously stored data.

```js
frenchkiss.set('en', {
  hello: 'Hi, ',
  howareyou: 'How are you ?',
  // ...
});
```

---

### frenchkiss.t(key: string, params?: object, lang?: string): string

The most used method to returns translation. It's built with performance in mind
Here is what you should know about it :

- ✅ It does support multiple interpolation variable
- ✅ It supports interpolation.
- ✅ It supports `PLURAL`.
- ✅ It supports `SELECT`.
- ✅ It supports nested `PLURAL`, `SELECT` and `variables`.
- ❌ It does not support nested keys _(to keep it fast)_.
- ❌ It does not support date, number, devise formatting (maybe check for [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/NumberFormat) and [Intl.DateTimeFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/DateTimeFormat)).

```js
set('en', {
  hello: 'Hello {name} !',
});

t('hello'); // => 'Hello  !'
t('hello', { name: 'John' }); // => 'Hello John !'
t('hello', { name: 'Anna' }); // => 'Hello Anna !'
```

> **Note:** By default, if no parameters are given it will be interpreted as an empty string.

If you are working with concurrent connections it's also possible to use the third parameter `lang` to force the language to use.
Doing a generator that forces the language use and pass it to your function can be what you are looking for.

```js
frenchkiss.locale('fr');
frenchkiss.set('en', {
  hello: 'Hello {name} !',
});

// Helper
const generateLanguageTranslator = lang => {
  return (key, params) => frenchkiss.t(key, params, lang);
};

// Generate t that force language
const t = generateLanguageTranslator('en');

// Force result in english
t('hello'); // => 'Hello  !'
t('hello', { name: 'John' }); // => 'Hello John !'
t('hello', { name: 'Anna' }); // => 'Hello Anna !'
```

---

### frenchkiss.extend(language: string, table: object)

Extend the translation table for the language. In contrary of `set()`, the previously stored data will be kept.

---

### frenchkiss.unset(language: string)

If you need to clean the data of a stored language for memory optimizations, unset is all you need.

---

### frenchkiss.fallback(language?: string): string

Get or set the fallback. Define what table FrenchKiss will use to fallback in case the locale table doesn't have the required translation.

```js
import { locale, fallback, set, t } from 'frenchkiss';

set('fr', {
  hello: 'Bonjour, ',
});

set('en', {
  hello: 'Hi, ',
  howareyou: 'How are you ?',
});

locale('fr');
fallback('en');

t('hello'); // => 'Bonjour, ' <- from 'fr' locale
t('howareyou'); // => 'How are you ?' <- from 'en' fallback
```

---

### frenchkiss.onMissingKey(fn: Function)

When the client requests a missing key, frenchKiss will returns the key as result. It's possible to handle it and return what you want or just send an event to your error reporting system.

```js
frenchkiss.t('missingkey'); // => 'missingkey'

frenchkiss.onMissingKey(key => {
  // Send error to your server
  sendReport(`Missing the key "${key}" in ${frenchkiss.locale()} language.`);

  // Returns the text you want
  return `An error happened (${key})`;
});

frenchkiss.t('missingkey'); // => 'An error happened (missingkey)'
```

---

### SELECT expression

If you need to display different text messages depending on the value of a variable, you need to translate all of those text messages... or you can handle this with a select ICU expression.

```js
set('en', {
  your_pet:
    'You own {pet, select, dog{a good boy} cat{an evil cat} other{a {pet} ! What is that?}}!',
});

t('your_pet', { pet: 'dog' }); // => 'You own a good boy!'
t('your_pet', { pet: 'cat' }); // => 'You own an evil cat!'
t('your_pet', { pet: 'rat' }); // => 'You own a rat ! What is that?!'
```

- The first parameter is the variable you want to check (`pet`).
- The second parameter identifies this as a `select` expression type.
- The third parameter is a pattern consisting of keys and their matching values.

> Phrases support select expression, based on [ICU FormatMessage](http://userguide.icu-project.org/formatparse/messages).

---

### PLURAL expression

It's basically the same as select, except you have to use the "=" symbol for direct checking.

```js
set('en', {
  bought_apple:
    'I {count, plural, =0{did not bought apples} =1{bought one apple} other{bought {count} apples}}!',
});

t('bought_apple', { count: 0 }); // => 'I did not bought apples!'
t('bought_apple', { count: 1 }); // => 'I bought one apple!'
t('bought_apple', { count: 5 }); // => 'I bought 5 apples!'
```

- The first parameter is the variable you want to check.
- The second parameter identifies this as a `plural` expression type.
- The third parameter is a pattern consisting of keys and their matching values.

> ⚠️ Like the select expression, the plural is a lightweight version of [ICU FormatMessage](http://userguide.icu-project.org/formatparse/messages) (`offset:1` and `#` are not integrated).

---

### Plural Category

It's also possible to work with plural category. Multiple languages have multiple pluralization rules. You'll have to write a function returning the type to check.
The functions are not included by default in the package (not needed in most cases). But you can extract them from other populars repositories:

- [Angular](https://github.com/angular/angular/blob/master/packages/common/src/i18n/localization.ts#L94)
- [Polyglot](https://github.com/airbnb/polyglot.js/blob/master/index.js#L49)
- others.

```js
import { locale, set, t, plural } from 'frenchkiss';

set('en', {
  takemymoney:
    'Take {N} dollar{{N, plural, one{} =5{s! Take it} other{s}} please.',
});

// Set here your plural category function
plural('en', n => (n !== 1 ? 'one' : 'other'));
plural('fr', n => (n === 0 || i === 1 ? 'one' : 'other'));
// etc.

t('takemymoney', { N: 0 }); // => 'Take 0 dollar please.'
t('takemymoney', { N: 1 }); // => 'Take 1 dollar please.'
t('takemymoney', { N: 2 }); // => 'Take 2 dollars please.'
t('takemymoney', { N: 5 }); // => 'Take 5 dollars! Take it please.'
```

---

### Nested expressions

For advanced usage, it's also possible to do nested select, plural and interpolations.

```js
set('fr', {
  timeago: `Updated: {minutes, plural,
    =0 {just now}
    =1 {one minute ago}
    other {
      {minutes} minutes ago by {gender, select,
        male {male}
        female {female}
        other {other}
      }
    }
  }`,
});

t('timeago', { minutes: 0, gender: 'male' }); // => 'Updated: just now'
t('timeago', { minutes: 1, gender: 'male' }); // => 'Updated: one minute ago'
t('timeago', { minutes: 5, gender: 'male' }); // => 'Updated: 5 minutes ago by male'
```
