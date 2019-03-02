'use strict';

// Block type enum
const TYPE_TEXT = 0;
const TYPE_VARIABLE = 1;
const TYPE_EXPRESSION = 2;

// Helpers to parse ICU patterns
const VARIABLE_REGEXP = /^\s*\w+\s*$/;
const EXPRESSION_REGEXP = /^\s*(\w+)\s*,\s*(select|plural)\s*,/i;

/**
 * Helper to escape text avoiding XSS
 *
 * @param {String} text
 * @returns {String}
 */
const escapeText = JSON.stringify; // (text) => '"' + text.replace(/(["\\])/g, '\\$1').replace(/[\n\r]/g, '\\n') + '"';

/**
 * Helper to bind variable name to value.
 * Default to onMissingVariable returns if not defined
 *
 * Mapping :
 * - undefined -> ''
 * - null -> ''
 * - 0 -> 0
 * - 155 -> 155
 * - 'test' -> 'test'
 * - not defined -> onMissingVariable(value, key, language)
 *
 * @param {String} text
 * @returns {String}
 */
const escapeVariable = text =>
  // prettier-ignore
  '(p["' + text + '"]||(p["' + text + '"]=="0"?0:"' + text + '" in p?"":v("' + text + '",k,l)))';

/**
 * Compile the translation to executable optimized function
 *
 * @param {String} text
 * @returns {Function}
 */
export function compileCode(text) {
  const plural = {};
  const parts = parseBlocks(text);
  const code = generateCode(parts, plural);

  const pluralVars = Object.keys(plural);
  const size = pluralVars.length;
  const pluralCode = [];

  // Plural category cache look up
  for (let i = 0; i < size; ++i) {
    pluralCode[i] = pluralVars[i] + ':f(p["' + pluralVars[i] + '"])';
  }

  return new Function(
    'a', // params
    'f', // plural category function
    'k', // key
    'l', // language
    'v', // missingVariableHandler
    'var p=a||{}' +
      (size ? ',m=f?{' + pluralCode + '}:{}' : '') +
      ';return ' +
      code
  );
}

/**
 * Generate code to evaluate blocks
 *
 * @param {Array} parts
 * @param {Object} plural
 * @returns {String}
 */
function generateCode(parts, plural) {
  const codes = [];
  const size = parts.length;

  for (let i = 0; i < size; ++i) {
    const p = parts[i];
    const type = p[0];
    const value = p[1];

    let code = '';

    if (type === TYPE_TEXT && value) {
      code = escapeText(value);
    } else if (type === TYPE_VARIABLE) {
      code = escapeVariable(value.trim());
    } else if (type === TYPE_EXPRESSION) {
      const variable = p[2];
      const cases = p[3];
      const isPlural = p[4];
      const count = cases.length;

      // Generate ternary check
      for (let j = 0; j < count; ++j) {
        if (isPlural) {
          if (cases[j][0][0] === '=') {
            // Plural mode with '=5'
            // Direct assignment check
            code +=
              'p["' + variable + '"]==' + escapeText(cases[j][0].substr(1));
          } else {
            // Category check (zero, one, few, many)
            // Send plural back so we can pre-cache the values
            plural[variable] = 1;
            code += 'm["' + variable + '"]==' + escapeText(cases[j][0]);
          }
        } else {
          // SELECT mode, direct assignement check
          code += 'p["' + variable + '"]==' + escapeText(cases[j][0]);
        }
        code += '?' + generateCode(cases[j][1], plural) + ':';
      }

      // Add default value
      code = '(' + code + generateCode(value, plural) + ')';
    }

    if (code) {
      codes.push(code);
    }
  }

  return codes.join('+') || '""';
}

/**
 * Helper to break patterns into blocks, allowing to extract texts,
 * variables and expressions and also blocks in expressions
 *
 * @param {String} text
 * @returns {Array}
 */
function parseBlocks(text) {
  let stackSize = 0;
  let fragment = '';
  const size = text.length;
  const blocks = [];

  for (let i = 0; i < size; ++i) {
    const c = text[i];
    let code;

    if (c === '{') {
      if (!stackSize++) {
        code = [TYPE_TEXT, fragment];
      }
    } else if (c === '}') {
      if (!--stackSize) {
        code = VARIABLE_REGEXP.test(fragment)
          ? [TYPE_VARIABLE, fragment]
          : EXPRESSION_REGEXP.test(fragment)
          ? parseExpression(fragment)
          : [TYPE_TEXT, fragment];
      }
    }

    if (code) {
      blocks.push(code);
      fragment = '';
    } else {
      fragment += c;
    }
  }

  blocks.push([TYPE_TEXT, fragment]);

  return blocks;
}

/**
 * Helper to parse expression
 * {N,plural,=0{x}=1{y}other{z}}
 * {color,select,red{x}green{y}other{z}}
 *
 * @param {String} text
 * @returns {Array}
 */
function parseExpression(text) {
  const matches = text.match(EXPRESSION_REGEXP);
  const variable = matches[1];
  const isPlural = matches[2][0].toLowerCase() === 'p';
  const parts = parseBlocks(text.replace(EXPRESSION_REGEXP, ''));
  const size = parts.length;
  const cases = [];

  let defaultValue = [TYPE_TEXT, ''];

  for (let i = 0; i < size - 1; ) {
    let value = parts[i++][1].trim();
    const result = parseBlocks(parts[i++][1]);

    if (value === 'other') {
      defaultValue = result;
    } else if (isPlural && value[0] === '=') {
      cases.unshift([value, result]);
    } else {
      cases.push([value, result]);
    }
  }

  return [TYPE_EXPRESSION, defaultValue, variable, cases, isPlural];
}
