import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-callback-in-promise.js';

const ruleTester = new RuleTester();

describe('no-callback-in-promise', () => {
  it('should disallow callbacks in promise handlers', () => {
    ruleTester.run('no-callback-in-promise', rule, {
      valid: [
        'p.then(() => {})',
        'p.then(() => { doSomething() })',
        // callback() outside of promise
        'callback()',
        'cb(err)',
      ],
      invalid: [
        {
          code: 'p.then(() => { callback(null, result) })',
          errors: [{ messageId: 'avoidCallbackInPromise' }],
        },
        {
          code: 'p.then(() => { cb(null, result) })',
          errors: [{ messageId: 'avoidCallbackInPromise' }],
        },
        {
          code: 'p.catch(() => { next(err) })',
          errors: [{ messageId: 'avoidCallbackInPromise' }],
        },
        {
          code: 'p.then(() => { done() })',
          errors: [{ messageId: 'avoidCallbackInPromise' }],
        },
      ],
    });
  });

  it('should support exceptions option', () => {
    ruleTester.run('no-callback-in-promise', rule, {
      valid: [
        {
          code: 'p.then(() => { next() })',
          options: [{ exceptions: ['next'] }],
        },
      ],
      invalid: [],
    });
  });
});
