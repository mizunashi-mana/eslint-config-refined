import type { Rule } from "eslint";
import { isPromiseConstructorWithInlineExecutor } from "../lib/is-promise-constructor.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce consistent param names and ordering when creating new promises.",
    },
    schema: [
      {
        type: "object",
        properties: {
          resolvePattern: { type: "string" },
          rejectPattern: { type: "string" },
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
    const options = (context.options[0] ?? {}) as {
      resolvePattern?: string;
      rejectPattern?: string;
    };
    const resolvePattern = new RegExp(
      options.resolvePattern ?? "^_?resolve$",
      "u",
    );
    const rejectPattern = new RegExp(
      options.rejectPattern ?? "^_?reject$",
      "u",
    );

    return {
      NewExpression(node) {
        if (!isPromiseConstructorWithInlineExecutor(node)) return;

        const params = node.arguments[0].params;
        if (!params.length) return;

        const resolveParam = params[0];
        if (
          resolveParam?.type === "Identifier" &&
          !resolvePattern.test(resolveParam.name)
        ) {
          context.report({
            node: resolveParam,
            messageId: "resolveParamNames",
            data: { resolvePattern: resolvePattern.source },
          });
        }

        const rejectParam = params[1];
        if (
          rejectParam?.type === "Identifier" &&
          !rejectPattern.test(rejectParam.name)
        ) {
          context.report({
            node: rejectParam,
            messageId: "rejectParamNames",
            data: { rejectPattern: rejectPattern.source },
          });
        }
      },
    };
  },
};

export default rule;
