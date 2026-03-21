# @mizunashi_mana/eslint-plugin-promise

ESLint plugin for Promise best practices, rewritten for ESLint v10.

This is a modern rewrite of [eslint-plugin-promise](https://github.com/eslint-community/eslint-plugin-promise) targeting ESLint v10's flat config and Rule API.

## Install

```bash
npm install --save-dev @mizunashi_mana/eslint-plugin-promise eslint
```

## Usage

Use the recommended config:

```js
// eslint.config.js
import promisePlugin from '@mizunashi_mana/eslint-plugin-promise';

export default [
  ...promisePlugin.configs.recommended,
  // your other configs...
];
```

Or configure individual rules:

```js
// eslint.config.js
import promisePlugin from '@mizunashi_mana/eslint-plugin-promise';

export default [
  {
    plugins: {
      '@mizunashi_mana/promise': promisePlugin,
    },
    rules: {
      '@mizunashi_mana/promise/always-return': 'error',
      '@mizunashi_mana/promise/catch-or-return': 'error',
    },
  },
];
```

> **Note:** If you use `@mizunashi_mana/eslint-config-refined`, these rules are already included in the `common` rule set. No separate setup is needed.

## Rules

| Rule | Description | Recommended |
|---|---|---|
| `always-return` | Require returning inside each `then()` to create readable and reusable Promise chains | error |
| `catch-or-return` | Enforce the use of `catch()` on un-returned promises | error |
| `no-new-statics` | Disallow calling `new` on a Promise static method | error |
| `no-return-wrap` | Disallow wrapping values in `Promise.resolve` or `Promise.reject` when not needed | error |
| `param-names` | Enforce consistent param names and ordering when creating new promises | error |
| `no-callback-in-promise` | Disallow calling a callback inside a `then()` or `catch()` | warn |
| `no-nesting` | Disallow nested `then()` or `catch()` statements | warn |
| `no-promise-in-callback` | Disallow using promises inside of callbacks | warn |
| `no-return-in-finally` | Disallow return statements in `finally()` | warn |
| `valid-params` | Enforces the proper number of arguments are passed to Promise functions | warn |
| `no-multiple-resolved` | Disallow creating new promises with paths that resolve multiple times | off |
| `prefer-await-to-then` | Prefer `await` to `then()`/`catch()`/`finally()` for reading Promise values | off |

## License

This package is dual-licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) or [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/), at your option.
