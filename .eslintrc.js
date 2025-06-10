// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['/dist/*'],
  rules: {
    'no-undef': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
