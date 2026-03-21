import { buildConfig } from './src/index.ts';

export default [
  {
    ignores: ['dist/**'],
  },
  ...buildConfig(),
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];
