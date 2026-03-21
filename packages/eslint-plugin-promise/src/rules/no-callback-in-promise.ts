import { isInsidePromise } from '#lib';
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint rule options are typed as `unknown[]`
    const options = (context.options[0] ?? {}) as {
      exceptions?: string[];
    };
    const exceptions = options.exceptions ?? [];

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- ESLint rule visitor key uses AST node name
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Rule.Node.parent is always Rule.Node but we need optional for loop termination
          current = current.parent as Rule.Node | undefined;
        }
      },
    };
  },
};

export default rule;
