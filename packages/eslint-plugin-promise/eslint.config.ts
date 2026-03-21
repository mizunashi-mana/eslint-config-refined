import { buildConfig } from '@mizunashi_mana/eslint-config-refined';

export default [
  {
    ignores: ['dist/**'],
  },
  ...buildConfig(),
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
