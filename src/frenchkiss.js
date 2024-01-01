'use strict';

import { compileCode } from './compiler';

export const cache = {};
export const store = {};

let _plural = {};
let _locale = '';
let _fallback = '';

/**
 * Default function used in case of missing key
 * Returns the translation you want
 *
 * @param {String}
 * @returns {String}
 */
let missingKeyHandler = key => key;

/**
 * Default function used in case of missing variable
 * Returns the value you want
 *
 * @param {String} variable
 * @param {String} key
 * @param {String} language
 * @returns {String}
 */
let missingVariableHandler = () => '';

/**
 * Get compiled code from cache or ask to generate it
 *
 * @param {String} key
 * @param {String} language
 * @returns {Function|null}
 */
const getCompiledCode = (key, language) =>
  (cache[language] && cache[language][key]) ||
  (store[language] &&
    typeof store[language][key] === 'string' &&
    (cache[language][key] = compileCode(store[language][key])));

/**
 * Get back translation and interpolate values stored in 'params' parameter
 *
 * @param {String} key the key to search the translation from
 * @param {Object?} params object to interpolate/plural/select
 * @param {String?} language overwrite the defined language
 * @returns {String}
 */
export const t = (key, params, language) => {
  let fn,
    lang = language || _locale;

  // Try to get the specified or locale
  if (lang) {
    fn = getCompiledCode(key, lang);

    if (fn) {
      return fn(params, _plural[lang], key, lang, missingVariableHandler);
    }
  }

  lang = _fallback;

  // Try to get the fallback language
  if (lang) {
    fn = getCompiledCode(key, lang);

    if (fn) {
      return fn(params, _plural[lang], key, lang, missingVariableHandler);
    }
  }

  return missingKeyHandler(key, params, language || _locale);
};

/**
 * Set a function to handle missing key to :
 * - Returns the translation you want
 * - Report the problem to your server
 *
 * @param {Function} fn
 */
export const onMissingKey = fn => {
  missingKeyHandler = fn;
};

/**
 * Set a function to handle missing variable to:
 * - Returns the value you want
 * - Report the poblem to your server
 *
 * @param {Function} fn
 */
export const onMissingVariable = fn => {
  missingVariableHandler = fn;
};

/**
 * Getter/setter for locale
 *
 * @param {String} language
 * @returns {String}
 */
export const locale = language => {
  if (language) {
    _locale = language;
  }
  return _locale;
};

/**
 * Getter/setter for fallback
 *
 * @param {String} language
 * @returns {String}
 */
export const fallback = language => {
  if (language) {
    _fallback = language;
  }
  return _fallback;
};

/**
 * Set table for specific language
 *
 * @param {String} language
 * @param {Object} table
 */
export const set = (language, table) => {
  cache[language] = {};
  store[language] = flattenObjectKeys(table, '');
};

/**
 * Flatten keys for flat object { [string]: string }
 *
 * @param {Object} data
 * @param {String} prefix
 */
const flattenObjectKeys = (data, prefix) => {
  let table = {};
  const keys = Object.keys(data);
  const count = keys.length;

  for (let i = 0; i < count; ++i) {
    const key = keys[i];
    const prefixKey = prefix + key;

    if (typeof data[key] === 'object') {
      table = Object.assign(
        table,
        flattenObjectKeys(data[key], prefixKey + '.')
      );
    } else {
      table[prefixKey] = String(data[key]);
    }
  }
  return table;
};

/**
 * Set plural category function
 * The function get the value as argument and you specify the group to returns
 * It can be "one", "few", "many" or in fact everything else you want.
 *
 * @param {String} language
 * @param {Function} fn
 */
export const plural = (language, fn) => {
  _plural[language] = fn;
};

/**
 * Extend language table without reseting the stored data
 *
 * @param {String} language
 * @param {Object} table
 */
export const extend = (language, table) => {
  if (!store[language]) {
    store[language] = {};
  }

  if (!cache[language]) {
    cache[language] = {};
  }

  extendStoreRecursive(store[language], cache[language], table, '');
};

/**
 * Helper to extends store recursively
 *
 * @param {Object} store
 * @param {Object} cache
 * @param {Object} table
 * @param {String} prefix
 * @internal
 */
const extendStoreRecursive = (store, cache, table, prefix) => {
  const keys = Object.keys(table);
  const count = keys.length;

  for (let i = 0; i < count; ++i) {
    const key = keys[i];
    const targetKey = prefix + key;

    if (typeof table[key] === 'object') {
      extendStoreRecursive(store, cache, table[key], targetKey + '.');
    } else if (store[targetKey] !== table[key]) {
      delete cache[targetKey];
      store[targetKey] = String(table[key]);
    }
  }
};

/**
 * Clear language table
 *
 * @param {String} language
 * @param {Object} table
 */
export const unset = language => {
  delete cache[language];
  delete store[language];
};

/**
 * Export all as default
 */
export default {
  cache,
  store,
  t,
  onMissingKey,
  onMissingVariable,
  locale,
  fallback,
  set,
  unset,
  extend,
  plural,
};
