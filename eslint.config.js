// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  expoConfig,
  {
    ignores: ['dist/*']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      semi: ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'prefer-const': 'error',
      'comma-dangle': ['error', 'never'],
      'eol-last': ['error', 'always']
    }
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/keyword-spacing': [
        'error',
        { before: true, after: true }
      ],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always']
    }
  },
  {
    languageOptions: { globals: globals.browser }
  }
]);
