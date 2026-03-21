import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-return-wrap.js';

const ruleTester = new RuleTester();

describe('no-return-wrap', () => {
  it('should disallow unnecessary wrapping', () => {
    ruleTester.run('no-return-wrap', rule, {
      valid: [
        'p.then(() => { return value })',
        'p.then((val) => val)',
        'p.then(() => { throw new Error() })',
        // Not inside a promise
        'function foo() { return Promise.resolve(1) }',
      ],
      invalid: [
        {
          code: 'p.then(() => { return Promise.resolve(1) })',
          errors: [{ messageId: 'resolve' }],
        },
        {
          code: 'p.then(() => { return Promise.reject(err) })',
          errors: [{ messageId: 'reject' }],
        },
        {
          code: 'p.then(() => Promise.resolve(1))',
          errors: [{ messageId: 'resolve' }],
        },
      ],
    });
  });

  it('should respect allowReject option', () => {
    ruleTester.run('no-return-wrap', rule, {
      valid: [
        {
          code: 'p.then(() => { return Promise.reject(err) })',
          options: [{ allowReject: true }],
        },
      ],
      invalid: [
        {
          code: 'p.then(() => { return Promise.resolve(1) })',
          options: [{ allowReject: true }],
          errors: [{ messageId: 'resolve' }],
        },
      ],
    });
  });
});
