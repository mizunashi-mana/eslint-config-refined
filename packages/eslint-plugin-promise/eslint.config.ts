import { buildConfig } from '@mizunashi_mana/eslint-config-refined';

export default [
  {
    ignores: ['dist/**'],
  },
  ...buildConfig(),
];
