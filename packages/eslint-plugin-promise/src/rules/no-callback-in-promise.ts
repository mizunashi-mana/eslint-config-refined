import { isInsidePromise } from '../lib/is-inside-promise.js';
import type { Rule } from 'eslint';

const DEFAULT_CALLBACKS = ['done', 'cb', 'callback', 'next'];

function isNamedCallback(name: string, exceptions: string[]): boolean {
  return DEFAULT_CALLBACKS.filter(cb => !exceptions.includes(cb)).some(
    cb => name === cb,
  );
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow calling a callback inside a `then()` or `catch()`.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      avoidCallbackInPromise:
        'Avoid calling back inside of a promise.',
    },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as {
      exceptions?: string[];
    };
    const exceptions = options.exceptions ?? [];

    return {
      CallExpression(node) {
        if (
          node.callee.type !== 'Identifier'
          || !isNamedCallback(node.callee.name, exceptions)
        ) {
          return;
        }

        // Check if we're inside a promise callback
        let current = node.parent as Rule.Node | undefined;
        while (current) {
          if (isInsidePromise(current)) {
            context.report({
              node,
              messageId: 'avoidCallbackInPromise',
            });
            return;
          }
          current = current.parent as Rule.Node | undefined;
        }
      },
    };
  },
};

export default rule;
