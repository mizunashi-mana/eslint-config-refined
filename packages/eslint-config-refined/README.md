# @mizunashi_mana/eslint-config-refined

[![npm version](https://img.shields.io/npm/v/%40mizunashi_mana/eslint-config-refined)](https://www.npmjs.com/package/@mizunashi_mana/eslint-config-refined)

A strict, opinionated ESLint shared configuration for TypeScript projects.

## Features

- **Strict by default** — always-useful rules are enabled out of the box
- **TypeScript-first** — deep integration with `typescript-eslint` and type-aware linting
- **Customizable where it matters** — style rules and opinionated trade-offs are configurable via rule sets
- **ESLint v10 native** — designed for ESLint v10 flat config

## Install

```bash
npm install --save-dev @mizunashi_mana/eslint-config-refined eslint typescript
```

## Usage

```js
// eslint.config.js
import { buildConfig } from '@mizunashi_mana/eslint-config-refined';

export default buildConfig({
  ruleSets: ['common', 'node'],
});
```

### `buildConfig(options?)`

| Option | Type | Default | Description |
|---|---|---|---|
| `ruleSets` | `RuleSet[]` | `['common', 'node']` | Rule sets to enable |
| `entrypointFiles` | `string[]` | `['src/index.ts']` | Entrypoint files for import/no-unused-modules etc. |
| `stylistic` | `StylisticOptions` | See below | Code style options |
| `playwrightFiles` | `string[]` | `undefined` | Glob patterns for Playwright test files |
| `disableFixedRules` | `boolean` | `false` | Disable auto-fixable rules (useful for editor integration) |

## Rule Sets

### `common`

Core rules for all JavaScript/TypeScript projects. Includes:

- **js** — ESLint core rules (`@eslint/js` recommended + strict additions)
- **ts** — TypeScript rules (`typescript-eslint` recommendedTypeChecked + strict additions)
- **stylistic** — Code style rules (`@stylistic/eslint-plugin`)
- **imports** — Import ordering and validation (`eslint-plugin-import-x`, `eslint-plugin-unused-imports`)
- **promise** — Promise best practices (`@mizunashi_mana/eslint-plugin-promise`)
- **comments** — ESLint directive comment rules (`@eslint-community/eslint-plugin-eslint-comments`)

### `node`

Node.js-specific rules (`eslint-plugin-n`). Recommended for server-side projects.

### `react`

React rules (`eslint-plugin-react-x` from the `@eslint-react` ecosystem).

### `playwright`

Playwright test rules (`eslint-plugin-playwright`). Use `playwrightFiles` to specify test file patterns.

### `storybook`

Storybook rules (`eslint-plugin-storybook`).

## Stylistic Options

The `stylistic` option configures code style rules:

| Option | Type | Default | Description |
|---|---|---|---|
| `indent` | `number \| 'tab'` | `2` | Indentation size or tab |
| `semi` | `boolean` | `true` | Require semicolons |
| `quotes` | `'single' \| 'double' \| 'backtick'` | `'single'` | Quote style |
| `braceStyle` | `'1tbs' \| 'stroustrup' \| 'allman'` | `'1tbs'` | Brace style |
| `commaDangle` | `'never' \| 'always' \| 'always-multiline' \| 'only-multiline'` | `'always-multiline'` | Trailing comma style |

Example:

```js
export default buildConfig({
  ruleSets: ['common', 'node'],
  stylistic: {
    indent: 4,
    semi: false,
    quotes: 'double',
  },
});
```

## License

This package is dual-licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) or [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/), at your option.
