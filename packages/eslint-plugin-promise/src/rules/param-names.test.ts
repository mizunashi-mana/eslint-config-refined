import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './param-names.js';

const ruleTester = new RuleTester();

describe('param-names', () => {
  it('should enforce param names', () => {
    ruleTester.run('param-names', rule, {
      valid: [
        'new Promise((resolve, reject) => {})',
        'new Promise((resolve) => {})',
        'new Promise((_resolve, _reject) => {})',
        'new Promise(function (resolve, reject) {})',
        // Not a Promise constructor
        'new Other((yes, no) => {})',
        // No inline executor
        'new Promise(executor)',
      ],
      invalid: [
        {
          code: 'new Promise((yes, no) => {})',
          errors: [{ messageId: 'resolveParamNames' }, { messageId: 'rejectParamNames' }],
        },
        {
          code: 'new Promise((done) => {})',
          errors: [{ messageId: 'resolveParamNames' }],
        },
        {
          code: 'new Promise((resolve, fail) => {})',
          errors: [{ messageId: 'rejectParamNames' }],
        },
      ],
    });
  });

  it('should support custom patterns', () => {
    ruleTester.run('param-names', rule, {
      valid: [
        {
          code: 'new Promise((ok, fail) => {})',
          options: [{ resolvePattern: '^ok$', rejectPattern: '^fail$' }],
        },
      ],
      invalid: [
        {
          code: 'new Promise((resolve, reject) => {})',
          options: [{ resolvePattern: '^ok$', rejectPattern: '^fail$' }],
          errors: [{ messageId: 'resolveParamNames' }, { messageId: 'rejectParamNames' }],
        },
      ],
    });
  });
});
