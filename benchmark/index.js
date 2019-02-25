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
  const output = {
    tests: [],
    results: {},
  };

  fs.readdirSync(path.join(__dirname, 'tests')).forEach(file => {
    const test = require(path.join(__dirname, 'tests', file));
    output.results[test.name] = [];
    loadTest(test);
  });

  for (const [key, modules] of Object.entries(suites)) {
    output.tests.push(
      key
        .split(/[\s|_]/)
        .map(v => v.charAt(0).toUpperCase() + v.substr(1))
        .join(' ')
    );

    const list = await runTestSuite(key, modules);
    list.forEach(lib => {
      output.results[lib.name].push(lib.hz);
    });
  }

  const results = [
    ['JS Libraries', ...output.tests],
    ...Object.keys(output.results)
      .reverse()
      .map(library => [library, ...output.results[library]]),
  ];

  const statFile = path.join(__dirname, './result.html');
  const fileContent = fs.readFileSync(statFile).toString();

  fs.writeFileSync(
    statFile,
    fileContent.replace(
      /arrayToDataTable\(([^;]+)\);/,
      `arrayToDataTable(${JSON.stringify(results)});`
    )
  );

  console.log(`\x1b[33mGenerated file: ${statFile}\x1b[0m`);
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

      if (list.length > 1) {
        const ref = list[0].hz;
        const a = (ref / list[1].hz).toFixed(1);
        const b = (ref / list[list.length - 1].hz).toFixed(1);

        console.log(
          `\x1b[32m${
            list[0].name
          } is ${a} to ${b} times faster than others\x1b[0m`
        );
      }

      resolve(list);
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
