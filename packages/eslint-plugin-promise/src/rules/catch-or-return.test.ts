import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './catch-or-return.js';

const ruleTester = new RuleTester();

describe('catch-or-return', () => {
  it('should require catch or return', () => {
    ruleTester.run('catch-or-return', rule, {
      valid: [
        'p.then(() => {}).catch(() => {})',
        'function foo() { return p.then(() => {}) }',
        'p.catch(() => {})',
        // Not a promise
        'foo()',
      ],
      invalid: [
        {
          code: 'p.then(() => {})',
          errors: [{ messageId: 'terminationMethod' }],
        },
        {
          code: 'Promise.resolve(1).then(() => {})',
          errors: [{ messageId: 'terminationMethod' }],
        },
      ],
    });
  });

  it('should support allowFinally', () => {
    ruleTester.run('catch-or-return', rule, {
      valid: [
        {
          code: 'p.then(() => {}).catch(() => {}).finally(() => {})',
          options: [{ allowFinally: true }],
        },
      ],
      invalid: [
        {
          code: 'p.then(() => {}).finally(() => {})',
          options: [{ allowFinally: true }],
          errors: [{ messageId: 'terminationMethod' }],
        },
      ],
    });
  });

  it('should support allowThen', () => {
    ruleTester.run('catch-or-return', rule, {
      valid: [
        {
          code: 'p.then(fn, errFn)',
          options: [{ allowThen: true }],
        },
      ],
      invalid: [],
    });
  });
});
