import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-promise-in-callback.js';

const ruleTester = new RuleTester();

describe('no-promise-in-callback', () => {
  it('should disallow promises in callbacks', () => {
    ruleTester.run('no-promise-in-callback', rule, {
      valid: [
        'function foo() { p.then(() => {}) }',
        // Promise returned from callback is fine
        'function foo(err) { return p.then(() => {}) }',
        // Not inside a callback
        'p.then(() => {})',
      ],
      invalid: [
        {
          code: 'function foo(err) { p.then(() => {}) }',
          errors: [{ messageId: 'avoidPromiseInCallback' }],
        },
        {
          code: 'function foo(error) { p.then(() => {}) }',
          errors: [{ messageId: 'avoidPromiseInCallback' }],
        },
        {
          code: '(err) => { p.then(() => {}) }',
          errors: [{ messageId: 'avoidPromiseInCallback' }],
        },
      ],
    });
  });
});
