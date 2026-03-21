import { isPromiseConstructorWithInlineExecutor } from '#lib';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce consistent param names and ordering when creating new promises.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          resolvePattern: { type: 'string', format: 'regex' },
          rejectPattern: { type: 'string', format: 'regex' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      resolveParamNames:
        'Promise constructor parameters must be named to match "{{ resolvePattern }}"',
      rejectParamNames:
        'Promise constructor parameters must be named to match "{{ rejectPattern }}"',
    },
  },
  create(context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint rule options are typed as `unknown[]`
    const options = (context.options[0] ?? {}) as {
      resolvePattern?: string;
      rejectPattern?: string;
    };
    const resolvePattern = new RegExp(
      options.resolvePattern ?? '^_?resolve$',
      'v',
    );
    const rejectPattern = new RegExp(
      options.rejectPattern ?? '^_?reject$',
      'v',
    );

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- ESLint rule visitor key uses AST node name
      NewExpression(node) {
        if (!isPromiseConstructorWithInlineExecutor(node)) return;

        const params = node.arguments[0].params;
        if (params.length === 0) return;

        const resolveParam = params[0];
        if (
          resolveParam?.type === 'Identifier'
          && !resolvePattern.test(resolveParam.name)
        ) {
          context.report({
            node: resolveParam,
            messageId: 'resolveParamNames',
            data: { resolvePattern: resolvePattern.source },
          });
        }

        if (params.length >= 2) {
          const rejectParam = params[1];
          if (
            rejectParam?.type === 'Identifier'
            && !rejectPattern.test(rejectParam.name)
          ) {
            context.report({
              node: rejectParam,
              messageId: 'rejectParamNames',
              data: { rejectPattern: rejectPattern.source },
            });
          }
        }
      },
    };
  },
};

export default rule;
