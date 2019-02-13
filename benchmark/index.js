/* eslint-disable no-console */
/* globals Promise */

const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');

const suites = {};

const expectedResults = {
  raw_string: 'Hello there',
  interpolate: 'Hello John and Alice and John again.',
  plural: 'There are people here.',
  plural_interpolate: 'There is John and 5 people here.',
};

(async function execute() {
  fs.readdirSync(path.join(__dirname, 'tests')).forEach(file => {
    loadTest(require(path.join(__dirname, 'tests', file)));
  });

  for (const [key, modules] of Object.entries(suites)) {
    await runTestSuite(key, modules);
  }
})();

function loadTest({ name, prepare, beforeTest, execute }) {
  if (prepare) {
    prepare();
  }

  Object.entries(expectedResults).forEach(([key, expected]) => {
    const success = execute(key) === expected;
    beforeTest && beforeTest(key);

    suites[key] = suites[key] || [];
    suites[key].push({
      name,
      success,
      test: () => execute(key),
    });
  });
}

function runTestSuite(key, modules) {
  const onCycle = event => {
    const suite = event.target;
    const lib = modules.find(lib => lib.name === suite.name);

    console.log(`(${lib.success ? 'success' : 'failed'}) ${suite.toString()}`);
  };

  return new Promise(resolve => {
    const onComplete = event => {
      const list = modules
        .map((v, i) => event.currentTarget[i])
        .sort((a, b) => b.hz - a.hz);

      const ref = list[0].hz;
      const a = (ref / list[1].hz).toFixed(1);
      const b = (ref / list[list.length - 1].hz).toFixed(1);

      resolve();
      console.log(
        `\x1b[32m${
          list[0].name
        } is ${a} to ${b} times faster than others\x1b[0m`
      );
    };

    console.log(`-- ${key.replace(/_/g, ' ').toUpperCase()} ---------------`);

    modules
      .reduce(
        (suite, lib) => suite.add(lib.name, lib.test),
        new Benchmark.Suite()
      )
      .on('cycle', onCycle)
      .on('complete', onComplete)
      .run({ async: true });
  });
}
