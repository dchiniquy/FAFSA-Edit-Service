const js = require('@eslint/js');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules/', 'coverage/'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.js'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
  prettierConfig,
];
