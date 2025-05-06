// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    node: true,
  },
  extends: ['expo', 'eslint:recommended', 'plugin:import/typescript'],
  ignorePatterns: ['/dist/*'],
  rules: {
    'no-undef': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
