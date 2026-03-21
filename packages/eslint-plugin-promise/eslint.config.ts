import { buildConfig } from '@mizunashi_mana/eslint-config-refined';

export default [
  {
    ignores: ['dist/**'],
  },
  ...buildConfig(),
  {
    files: ['src/**/*.ts'],
    rules: {
      // Relative parent imports are standard in library packages without path aliases
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];
