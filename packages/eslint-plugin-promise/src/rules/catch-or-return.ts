import type { Rule } from "eslint";
import { isPromise } from "../lib/is-promise.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce the use of `catch()` on un-returned promises.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowFinally: { type: "boolean" },
          allowThen: { type: "boolean" },
          allowThenStrict: { type: "boolean" },
          terminationMethod: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } },
            ],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      terminationMethod: "Expected {{ terminationMethod }}() or return",
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
    const terminationMethod =
      typeof options.terminationMethod === "string"
        ? [options.terminationMethod]
        : (options.terminationMethod ?? ["catch"]);

    function isAllowedPromiseTermination(
      expression: Rule.Node,
    ): boolean {
      // .then(fn, fn) with two arguments
      if (
        (allowThen || allowThenStrict) &&
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        expression.callee.property.type === "Identifier" &&
        expression.callee.property.name === "then" &&
        expression.arguments.length === 2
      ) {
        if (allowThen && !allowThenStrict) return true;
        // allowThenStrict: first arg must be null
        const firstArg = expression.arguments[0];
        if (
          firstArg.type === "Literal" &&
          firstArg.value === null
        ) {
          return true;
        }
      }

      // .finally() after an allowed termination
      if (
        allowFinally &&
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        expression.callee.property.type === "Identifier" &&
        expression.callee.property.name === "finally" &&
        isPromise(expression.callee.object) &&
        isAllowedPromiseTermination(
          expression.callee.object as Rule.Node,
        )
      ) {
        return true;
      }

      // terminationMethod (default: catch)
      if (
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        expression.callee.property.type === "Identifier" &&
        terminationMethod.includes(expression.callee.property.name)
      ) {
        return true;
      }

      // Bracket notation: ['catch']()
      if (
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        expression.callee.property.type === "Literal" &&
        expression.callee.property.value === "catch"
      ) {
        return true;
      }

      return false;
    }

    return {
      ExpressionStatement(node) {
        if (!isPromise(node.expression)) return;
        if (isAllowedPromiseTermination(node.expression as Rule.Node)) return;

        context.report({
          node,
          messageId: "terminationMethod",
          data: { terminationMethod: terminationMethod.join("/") },
        });
      },
    };
  },
};

export default rule;
