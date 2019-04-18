module.exports = {
  presets: [['@babel/env', { loose: true }]],
  env: {
    esm: {
      presets: [['@babel/env', { modules: false }]],
    },
  },
};
