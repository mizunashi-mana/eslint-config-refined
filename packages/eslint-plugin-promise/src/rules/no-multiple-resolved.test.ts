import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-multiple-resolved.js';

const ruleTester = new RuleTester();

describe('no-multiple-resolved', () => {
  it('should detect multiple resolve/reject calls', () => {
    ruleTester.run('no-multiple-resolved', rule, {
      valid: [
        'new Promise((resolve) => { resolve(1) })',
        'new Promise((resolve, reject) => { if (cond) { resolve(1) } else { reject(err) } })',
        // Not a Promise constructor
        'new Other((resolve) => { resolve(1); resolve(2) })',
        // No inline executor
        'new Promise(executor)',
      ],
      invalid: [
        {
          code: 'new Promise((resolve) => { resolve(1); resolve(2) })',
          errors: [{ messageId: 'alreadyResolved' }],
        },
        {
          code: 'new Promise((resolve, reject) => { resolve(1); reject(err) })',
          errors: [{ messageId: 'alreadyResolved' }],
        },
      ],
    });
  });
});
