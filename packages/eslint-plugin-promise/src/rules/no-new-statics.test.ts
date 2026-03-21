import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-new-statics.js';

const ruleTester = new RuleTester();

describe('no-new-statics', () => {
  it('should disallow new on Promise statics', () => {
    ruleTester.run('no-new-statics', rule, {
      valid: [
        'Promise.resolve(value)',
        'Promise.reject(reason)',
        'Promise.all([p1, p2])',
        'Promise.race([p1, p2])',
        'new Promise((resolve, reject) => {})',
      ],
      invalid: [
        {
          code: 'new Promise.resolve(value)',
          errors: [{ messageId: 'avoidNewStatic' }],
          output: 'Promise.resolve(value)',
        },
        {
          code: 'new Promise.reject(reason)',
          errors: [{ messageId: 'avoidNewStatic' }],
          output: 'Promise.reject(reason)',
        },
        {
          code: 'new Promise.all([p1, p2])',
          errors: [{ messageId: 'avoidNewStatic' }],
          output: 'Promise.all([p1, p2])',
        },
        {
          code: 'new Promise.race([p1, p2])',
          errors: [{ messageId: 'avoidNewStatic' }],
          output: 'Promise.race([p1, p2])',
        },
      ],
    });
  });
});
