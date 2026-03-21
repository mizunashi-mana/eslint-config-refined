import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer `await` to `then()`/`catch()`/`finally()` for reading Promise values.",
    },
    schema: [
      {
        type: "object",
        properties: {
          strict: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferAwaitToThen: "Prefer await to then()/catch()/finally().",
    },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as { strict?: boolean };
    const strict = options.strict ?? false;

    function isPromiseMethod(name: string): boolean {
      return name === "then" || name === "catch" || name === "finally";
    }

    function isInsideAsyncFunction(node: Rule.Node): boolean {
      let current = node.parent as Rule.Node | undefined;
      while (current) {
        if (
          (current.type === "FunctionDeclaration" ||
            current.type === "FunctionExpression" ||
            current.type === "ArrowFunctionExpression") &&
          (current as { async?: boolean }).async
        ) {
          return true;
        }
        current = current.parent as Rule.Node | undefined;
      }
      return false;
    }

    return {
      "CallExpression > MemberExpression.callee"(node: Rule.Node) {
        if (node.type !== "MemberExpression") return;
        if (node.property.type !== "Identifier") return;
        if (!isPromiseMethod(node.property.name)) return;

        // In strict mode, always flag. Otherwise only flag if not after await.
        if (!strict) {
          // Check if the call expression is already awaited
          const callExpr = node.parent;
          if (callExpr?.parent?.type === "AwaitExpression") return;
        }

        // Only report if we're not inside an async function
        // (or always report if strict)
        if (!strict && !isInsideAsyncFunction(node)) return;

        context.report({
          node: node.property,
          messageId: "preferAwaitToThen",
        });
      },
    };
  },
};

export default rule;
