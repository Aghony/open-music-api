import globals from 'globals';
import pluginJs from '@eslint/js';
import dicodingConfig from 'eslint-config-dicodingacademy';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  dicodingConfig, // Tidak perlu spread (...), langsung gunakan objeknya
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: {
      camelcase: 'off',
    }
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  pluginJs.configs.recommended,
];

