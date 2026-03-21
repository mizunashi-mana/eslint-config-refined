import { buildConfig } from './src/index.ts';

export default [
  {
    ignores: ['dist/**'],
  },
  ...buildConfig(),
];
