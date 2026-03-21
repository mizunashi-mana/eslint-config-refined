import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export interface StylisticOptions {
  indent?: number | 'tab';
  semi?: boolean;
  quotes?: 'single' | 'double' | 'backtick';
  braceStyle?: '1tbs' | 'stroustrup' | 'allman';
  commaDangle?: 'never' | 'always' | 'always-multiline' | 'only-multiline';
}

export function buildStylisticConfig(options?: StylisticOptions) {
  return defineConfig([
    stylistic.configs.customize({
      indent: options?.indent ?? 2,
      semi: options?.semi ?? true,
      quotes: options?.quotes ?? 'single',
      braceStyle: options?.braceStyle ?? 'stroustrup',
      commaDangle: options?.commaDangle ?? 'always-multiline',
    }),
  ]);
}
