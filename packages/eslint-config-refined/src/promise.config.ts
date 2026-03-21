import promisePlugin from '@mizunashi_mana/eslint-plugin-promise';
import { defineConfig } from 'eslint/config';

export function buildPromiseConfig() {
  return defineConfig([
    ...promisePlugin.configs.recommended,
    {
      rules: {
        '@mizunashi_mana/promise/always-return': [
          'error',
          { ignoreLastCallback: true },
        ],
        '@mizunashi_mana/promise/no-multiple-resolved': 'error',
        '@mizunashi_mana/promise/no-promise-in-callback': 'error',
        '@mizunashi_mana/promise/prefer-await-to-then': 'error',
      },
    },
  ]);
}
