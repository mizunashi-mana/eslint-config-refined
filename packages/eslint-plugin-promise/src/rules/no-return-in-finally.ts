import type { Rule, SourceCode } from 'eslint';
import type * as ESTree from 'estree';

/**
 * Walk statements looking for return statements that belong directly
 * to the given function (not nested functions).
 */
function findDirectReturns(
  statements: ESTree.Statement[],
  visitorKeys: SourceCode.VisitorKeys,
): ESTree.ReturnStatement[] {
  const returns: ESTree.ReturnStatement[] = [];

  function visit(node: ESTree.Node) {
    if (node.type === 'ReturnStatement') {
      returns.push(node);
      return;
    }
    // Don't descend into nested functions
    if (
      node.type === 'FunctionExpression'
      || node.type === 'ArrowFunctionExpression'
      || node.type === 'FunctionDeclaration'
    ) {
      return;
    }
    const keys = visitorKeys[node.type];
    if (!keys) return;
    for (const key of keys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Accessing dynamic AST child properties via visitor keys requires Record assertion
      const val = (node as unknown as Record<string, unknown>)[key];
      if (Array.isArray(val)) {
        for (const child of val) {
          if (typeof child === 'object' && child !== null && 'type' in child) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Array.isArray narrows to `any[]`; element is validated by type-in check
            visit(child as ESTree.Node);
          }
        }
      }
      else if (typeof val === 'object' && val !== null && 'type' in val) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Dynamic property access returns `unknown`; validated by type-in check
        visit(val as ESTree.Node);
      }
    }
  }

  for (const stmt of statements) {
    visit(stmt);
  }
  return returns;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow return statements in `finally()`.',
    },
    schema: [],
    messages: {
      noReturnInFinally: 'No return in finally',
    },
  },
  create(context) {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- ESLint rule visitor key uses AST node name
      CallExpression(node) {
        if (
          node.callee.type !== 'MemberExpression'
          || node.callee.property.type !== 'Identifier'
          || node.callee.property.name !== 'finally'
        ) {
          return;
        }

        if (node.arguments.length === 0) return;

        const callback = node.arguments[0];
        // noUncheckedIndexedAccess guard — length check above guarantees existence
        if (
          callback === undefined
          || (callback.type !== 'FunctionExpression'
            && callback.type !== 'ArrowFunctionExpression')
        ) {
          return;
        }

        if (callback.body.type !== 'BlockStatement') return;

        for (const ret of findDirectReturns(
          callback.body.body,
          context.sourceCode.visitorKeys,
        )) {
          context.report({
            node: ret,
            messageId: 'noReturnInFinally',
          });
        }
      },
    };
  },
};

export default rule;
