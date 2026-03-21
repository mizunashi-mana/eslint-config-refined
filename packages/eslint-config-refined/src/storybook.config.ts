import { defineConfig } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';

export function buildStorybookConfig() {
  // TODO: Remove `as any` when eslint-plugin-storybook adds ESLint v10 type support
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-type-assertion -- eslint-plugin-storybook lacks ESLint v10 types
  return defineConfig([storybook.configs['flat/recommended'] as any]);
}
