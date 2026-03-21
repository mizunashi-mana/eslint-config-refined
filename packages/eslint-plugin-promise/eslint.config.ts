import { buildConfig } from '@mizunashi_mana/eslint-config-refined';

export default [
  {
    ignores: ['dist/**'],
  },
  ...buildConfig(),
  {
    rules: {
      // TODO: Fix :exit pseudo-class usage for ESLint v10 compatibility
      '@mizunashi_mana/promise/always-return': 'off',
      '@mizunashi_mana/promise/no-multiple-resolved': 'off',
      '@mizunashi_mana/promise/no-nesting': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      // ESLint rule visitors use AST node names (PascalCase) and selectors as method keys
      '@typescript-eslint/naming-convention': 'off',
      // Relative parent imports are standard in library packages without path aliases
      'no-restricted-imports': 'off',
      // ESLint Rule API requires frequent type assertions for AST node types
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      // TODO: Fix pre-existing code patterns below
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      'complexity': 'off',
      'eqeqeq': 'off',
      'no-plusplus': 'off',
      'require-unicode-regexp': 'off',
      '@stylistic/max-statements-per-line': 'off',
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];
