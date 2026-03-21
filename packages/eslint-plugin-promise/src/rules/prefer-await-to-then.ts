import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer `await` to `then()`/`catch()`/`finally()` for reading Promise values.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          strict: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferAwaitToThen: 'Prefer await to then()/catch()/finally().',
    },
  },
  create(context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint rule options are typed as `unknown[]`
    const options = (context.options[0] ?? {}) as { strict?: boolean };
    const strict = options.strict ?? false;

    function isPromiseMethod(name: string): boolean {
      return name === 'then' || name === 'catch' || name === 'finally';
    }

    function isInsideAsyncFunction(node: Rule.Node): boolean {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Rule.Node.parent is always Rule.Node but we need optional for loop termination
      let current = node.parent as Rule.Node | undefined;
      while (current) {
        if (
          (current.type === 'FunctionDeclaration'
            || current.type === 'FunctionExpression'
            || current.type === 'ArrowFunctionExpression')
          && (current as { async?: boolean }).async === true
        ) {
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Rule.Node.parent is always Rule.Node but we need optional for loop termination
        current = current.parent as Rule.Node | undefined;
      }
      return false;
    }

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- ESLint rule visitor key uses AST selector
      'CallExpression > MemberExpression.callee': function (node: Rule.Node) {
        if (node.type !== 'MemberExpression') return;
        if (node.property.type !== 'Identifier') return;
        if (!isPromiseMethod(node.property.name)) return;

        // In strict mode, always flag. Otherwise only flag if not after await.
        if (!strict) {
          // Check if the call expression is already awaited
          const callExpr = node.parent;
          if (callExpr.parent?.type === 'AwaitExpression') return;
        }

        // Only report if we're not inside an async function
        // (or always report if strict)
        if (!strict && !isInsideAsyncFunction(node)) return;

        context.report({
          node: node.property,
          messageId: 'preferAwaitToThen',
        });
      },
    };
  },
};

export default rule;
