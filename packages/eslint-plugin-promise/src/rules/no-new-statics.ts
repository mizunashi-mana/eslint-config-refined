import type { Rule } from "eslint";
import { PROMISE_STATICS } from "../lib/promise-statics.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow calling `new` on a Promise static method.",
    },
    fixable: "code",
    schema: [],
    messages: {
      avoidNewStatic: "Avoid calling 'new' on 'Promise.{{ name }}()'",
    },
  },
  create(context) {
    return {
      NewExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "Promise" &&
          node.callee.property.type === "Identifier" &&
          PROMISE_STATICS.has(node.callee.property.name)
        ) {
          context.report({
            node,
            messageId: "avoidNewStatic",
            data: { name: node.callee.property.name },
            fix(fixer) {
              const sourceCode = context.sourceCode;
              const newToken = sourceCode.getFirstToken(node);
              if (!newToken || newToken.value !== "new") return null;
              const nextToken = sourceCode.getTokenAfter(newToken);
              if (!nextToken) return null;
              return fixer.removeRange([newToken.range[0], nextToken.range[0]]);
            },
          });
        }
      },
    };
  },
};

export default rule;
