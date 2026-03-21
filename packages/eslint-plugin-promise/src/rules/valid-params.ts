import { isPromise } from '../lib/is-promise.js';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces the proper number of arguments are passed to Promise functions.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          exclude: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireOneOptionalArgument:
        'Promise.{{ name }}() requires 0 or 1 arguments, but received {{ numArgs }}',
      requireOneArgument:
        'Promise.{{ name }}() requires 1 argument, but received {{ numArgs }}',
      requireTwoOptionalArguments:
        'Promise.{{ name }}() requires 1 or 2 arguments, but received {{ numArgs }}',
    },
  },
  create(context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint rule options are typed as `unknown[]`
    const options = (context.options[0] ?? {}) as { exclude?: string[] };
    const exclude = options.exclude ?? [];

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- ESLint rule visitor key uses AST node name
      CallExpression(node) {
        if (!isPromise(node)) return;
        if (node.callee.type !== 'MemberExpression') return;
        if (node.callee.property.type !== 'Identifier') return;

        const name = node.callee.property.name;
        const numArgs = node.arguments.length;

        if (exclude.includes(name)) return;

        switch (name) {
          case 'resolve':
          case 'reject':
            // Only check Promise.resolve() / Promise.reject() static calls
            if (
              node.callee.object.type === 'Identifier'
              && node.callee.object.name === 'Promise'
              && numArgs > 1
            ) {
              context.report({
                node,
                messageId: 'requireOneOptionalArgument',
                data: { name, numArgs: String(numArgs) },
              });
            }
            break;
          case 'then':
            if (numArgs < 1 || numArgs > 2) {
              context.report({
                node,
                messageId: 'requireTwoOptionalArguments',
                data: { name, numArgs: String(numArgs) },
              });
            }
            break;
          case 'race':
          case 'all':
          case 'allSettled':
          case 'any':
          case 'catch':
          case 'finally':
            if (numArgs !== 1) {
              context.report({
                node,
                messageId: 'requireOneArgument',
                data: { name, numArgs: String(numArgs) },
              });
            }
            break;
          default:
            break;
        }
      },
    };
  },
};

export default rule;
