// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    node: true,
  },
  extends: ['expo', 'eslint:recommended'],
  ignorePatterns: ['/dist/*'],
  rules: {
    'no-undef': 0,
  },
};
