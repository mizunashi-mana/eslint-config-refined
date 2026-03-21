# eslint-config-refined

A strict, opinionated ESLint shared configuration for TypeScript projects.

## What

`eslint-config-refined` provides a comprehensive set of ESLint rules designed to maintain high-quality JavaScript/TypeScript code. It ships a `buildConfig()` utility that generates a complete ESLint flat config with sensible defaults.

**Key principles:**

- **Strict by default** — always-useful rules are enabled out of the box
- **TypeScript-first** — deep integration with `typescript-eslint` and type-aware linting
- **Customizable where it matters** — style rules and opinionated trade-offs are configurable via rule sets
- **Always up-to-date** — tracks the latest ESLint releases and best practices

## Packages

| Package | Description |
|---|---|
| `@mizunashi_mana/eslint-config-refined` | Main shared ESLint configuration |
| `@mizunashi_mana/eslint-plugin-promise` | Promise-related ESLint rules rewritten for modern ESLint (planned) |

## Quick Start

```bash
npm install --save-dev @mizunashi_mana/eslint-config-refined eslint typescript
```

```js
// eslint.config.js
import { buildConfig } from '@mizunashi_mana/eslint-config-refined';

export default buildConfig({
  ruleSets: ['common', 'node'],
});
```

## License

This project is dual-licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) or [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/), at your option. See [LICENSE](./LICENSE) for details.
