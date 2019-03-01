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
 * Get back a translation and returns the optimized function
 * Store the function in the cache to re-use it
 *
 * @param {String} key
 * @param {String} language
 * @returns {Function|null}
 */
const getCompiledCode = (key, language) => {
  if (!cache[language]) {
    cache[language] = {};
  }

  if (
    !cache[language][key] &&
    store[language] &&
    typeof store[language][key] === 'string'
  ) {
    cache[language][key] = compileCode(store[language][key]);
  }

  return cache[language][key];
};

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

  if (lang) {
    fn = getCompiledCode(key, lang);
  }

  // Try to get the fallback language
  if (!fn && _fallback) {
    lang = _fallback;
    fn = getCompiledCode(key, lang);
  }

  return fn ? fn(params, _plural[lang]) : missingKeyHandler(key);
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
 * Getter/setter for locale
 *
 * @param {String} language
 * @returns {String}
 */
export const locale = language => {
  if (language && language !== _locale) {
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
  if (language && language !== _fallback) {
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
  store[language] = table;
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

  const keys = Object.keys(table);
  const count = keys.length;

  for (let i = 0; i < count; ++i) {
    const key = keys[i];
    store[language][key] = table[key];
    delete cache[language][key];
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
  locale,
  fallback,
  set,
  unset,
  extend,
  plural,
};
