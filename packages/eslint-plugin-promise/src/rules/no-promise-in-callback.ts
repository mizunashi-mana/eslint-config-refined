import { isInsideCallback, isPromise } from '#lib';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow using promises inside of callbacks.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          exemptDeclarations: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      avoidPromiseInCallback: 'Avoid using promises inside of callbacks.',
    },
  },
  create(context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint rule options are typed as `unknown[]`
    const options = (context.options[0] ?? {}) as {
      exemptDeclarations?: boolean;
    };
    const exemptDeclarations = options.exemptDeclarations ?? false;

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- ESLint rule visitor key uses AST node name
      CallExpression(node) {
        if (!isPromise(node)) return;

        // If the promise is returned, it's fine
        if (node.parent.type === 'ReturnStatement') return;

        // Walk up ancestors to find if we're inside a callback
        let current = node.parent as Rule.Node | undefined;
        while (current) {
          if (isInsideCallback(current, exemptDeclarations)) {
            context.report({
              node: node.callee,
              messageId: 'avoidPromiseInCallback',
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
