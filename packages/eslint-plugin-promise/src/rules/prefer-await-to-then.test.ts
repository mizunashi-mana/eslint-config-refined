import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './prefer-await-to-then.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
  },
});

describe('prefer-await-to-then', () => {
  it('should prefer await to then in async functions', () => {
    ruleTester.run('prefer-await-to-then', rule, {
      valid: [
        // Not in async function
        'p.then(() => {})',
        'p.catch(() => {})',
        // Already awaited
        'async function foo() { await p }',
        // Awaited then is ok (non-strict)
        'async function foo() { await p.then(() => {}) }',
      ],
      invalid: [
        {
          code: 'async function foo() { p.then(() => {}) }',
          errors: [{ messageId: 'preferAwaitToThen' }],
        },
        {
          code: 'async function foo() { p.catch(() => {}) }',
          errors: [{ messageId: 'preferAwaitToThen' }],
        },
        {
          code: 'async function foo() { p.finally(() => {}) }',
          errors: [{ messageId: 'preferAwaitToThen' }],
        },
        {
          code: 'const foo = async () => { p.then(() => {}) }',
          errors: [{ messageId: 'preferAwaitToThen' }],
        },
      ],
    });
  });

  it('should support strict mode', () => {
    ruleTester.run('prefer-await-to-then', rule, {
      valid: [],
      invalid: [
        {
          code: 'async function foo() { await p.then(() => {}) }',
          options: [{ strict: true }],
          errors: [{ messageId: 'preferAwaitToThen' }],
        },
      ],
    });
  });
});
