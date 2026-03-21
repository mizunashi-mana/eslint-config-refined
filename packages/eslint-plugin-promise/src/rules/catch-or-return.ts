import { isPromise } from '../lib/is-promise.js';
import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

type CallExpressionNode = Rule.Node & ESTree.CallExpression;
type MemberCallNode = CallExpressionNode & {
  callee: ESTree.MemberExpression;
};

function isMemberCallExpression(
  expression: Rule.Node,
): expression is MemberCallNode {
  return (
    expression.type === 'CallExpression'
    && expression.callee.type === 'MemberExpression'
  );
}

function getMemberPropertyName(
  callee: ESTree.MemberExpression,
): string | undefined {
  if (callee.property.type === 'Identifier') return callee.property.name;
  return undefined;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the use of `catch()` on un-returned promises.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowFinally: { type: 'boolean' },
          allowThen: { type: 'boolean' },
          allowThenStrict: { type: 'boolean' },
          terminationMethod: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      terminationMethod: 'Expected {{ terminationMethod }}() or return',
    },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as {
      allowFinally?: boolean;
      allowThen?: boolean;
      allowThenStrict?: boolean;
      terminationMethod?: string | string[];
    };
    const allowThen = options.allowThen ?? false;
    const allowThenStrict = options.allowThenStrict ?? false;
    const allowFinally = options.allowFinally ?? false;
    const terminationMethod
      = typeof options.terminationMethod === 'string'
        ? [options.terminationMethod]
        : (options.terminationMethod ?? ['catch']);

    function isAllowedThenTermination(expression: MemberCallNode): boolean {
      if (!(allowThen || allowThenStrict)) return false;
      if (getMemberPropertyName(expression.callee) !== 'then') return false;
      if (expression.arguments.length !== 2) return false;
      if (allowThen && !allowThenStrict) return true;
      const firstArg = expression.arguments[0];
      return firstArg?.type === 'Literal'
        && firstArg.value === null;
    }

    function isAllowedFinallyTermination(expression: MemberCallNode): boolean {
      if (!allowFinally) return false;
      if (getMemberPropertyName(expression.callee) !== 'finally') return false;
      if (!isPromise(expression.callee.object)) return false;
      return isAllowedPromiseTermination(
        expression.callee.object as Rule.Node,
      );
    }

    function isTerminationMethodCall(expression: MemberCallNode): boolean {
      const name = getMemberPropertyName(expression.callee);
      return name !== undefined && terminationMethod.includes(name);
    }

    function isBracketCatchCall(expression: MemberCallNode): boolean {
      return (
        expression.callee.property.type === 'Literal'
        && expression.callee.property.value === 'catch'
      );
    }

    function isAllowedPromiseTermination(expression: Rule.Node): boolean {
      if (!isMemberCallExpression(expression)) return false;
      return (
        isAllowedThenTermination(expression)
        || isAllowedFinallyTermination(expression)
        || isTerminationMethodCall(expression)
        || isBracketCatchCall(expression)
      );
    }

    return {
      ExpressionStatement(node) {
        if (!isPromise(node.expression)) return;
        if (isAllowedPromiseTermination(node.expression as Rule.Node)) return;

        context.report({
          node,
          messageId: 'terminationMethod',
          data: { terminationMethod: terminationMethod.join('/') },
        });
      },
    };
  },
};

export default rule;
