import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-return-in-finally.js';

const ruleTester = new RuleTester();

describe('no-return-in-finally', () => {
  it('should disallow return in finally', () => {
    ruleTester.run('no-return-in-finally', rule, {
      valid: [
        'p.finally(() => { console.log(\'done\') })',
        'p.finally(() => {})',
        // Arrow expression body (no return statement)
        'p.finally(() => console.log(\'done\'))',
        // Return in nested function is fine
        'p.finally(() => { function foo() { return 1 } })',
        // Return in nested arrow is fine
        'p.finally(() => { const fn = () => { return 1 } })',
      ],
      invalid: [
        {
          code: 'p.finally(() => { return 1 })',
          errors: [{ messageId: 'noReturnInFinally' }],
        },
        {
          code: 'p.finally(function() { return 1 })',
          errors: [{ messageId: 'noReturnInFinally' }],
        },
        {
          code: 'p.finally(() => { if (cond) { return 1 } })',
          errors: [{ messageId: 'noReturnInFinally' }],
        },
      ],
    });
  });
});
