import type { Rule } from "eslint";
import { isPromise } from "../lib/is-promise.js";
import { isInsideCallback } from "../lib/is-inside-callback.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow using promises inside of callbacks.",
    },
    schema: [
      {
        type: "object",
        properties: {
          exemptDeclarations: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      avoidPromiseInCallback: "Avoid using promises inside of callbacks.",
    },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as {
      exemptDeclarations?: boolean;
    };
    const exemptDeclarations = options.exemptDeclarations ?? false;

    return {
      CallExpression(node) {
        if (!isPromise(node)) return;

        // If the promise is returned, it's fine
        if (node.parent?.type === "ReturnStatement") return;

        // Walk up ancestors to find if we're inside a callback
        let current = node.parent as Rule.Node | undefined;
        while (current) {
          if (isInsideCallback(current, exemptDeclarations)) {
            context.report({
              node: node.callee,
              messageId: "avoidPromiseInCallback",
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
