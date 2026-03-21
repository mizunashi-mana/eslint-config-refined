import type * as ESTree from "estree";
import type { Rule } from "eslint";

/**
 * Walk statements looking for return statements that belong directly
 * to the given function (not nested functions).
 */
function findDirectReturns(
  statements: ESTree.Statement[],
): ESTree.ReturnStatement[] {
  const returns: ESTree.ReturnStatement[] = [];

  function visit(node: ESTree.Node) {
    if (node.type === "ReturnStatement") {
      returns.push(node);
      return;
    }
    // Don't descend into nested functions
    if (
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression" ||
      node.type === "FunctionDeclaration"
    ) {
      return;
    }
    for (const child of childStatements(node)) {
      visit(child);
    }
  }

  for (const stmt of statements) {
    visit(stmt);
  }
  return returns;
}

function childStatements(node: ESTree.Node): ESTree.Node[] {
  const children: ESTree.Node[] = [];
  const n = node as unknown as Record<string, unknown>;
  for (const key of [
    "body",
    "consequent",
    "alternate",
    "block",
    "handler",
    "finalizer",
    "cases",
  ]) {
    const val = n[key];
    if (Array.isArray(val)) {
      children.push(...(val as ESTree.Node[]));
    } else if (val && typeof val === "object" && "type" in val) {
      children.push(val as ESTree.Node);
    }
  }
  return children;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow return statements in `finally()`.",
    },
    schema: [],
    messages: {
      noReturnInFinally: "No return in finally",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type !== "MemberExpression" ||
          node.callee.property.type !== "Identifier" ||
          node.callee.property.name !== "finally"
        ) {
          return;
        }

        const callback = node.arguments[0];
        if (
          !callback ||
          (callback.type !== "FunctionExpression" &&
            callback.type !== "ArrowFunctionExpression")
        ) {
          return;
        }

        if (callback.body.type !== "BlockStatement") return;

        for (const ret of findDirectReturns(callback.body.body)) {
          context.report({
            node: ret,
            messageId: "noReturnInFinally",
          });
        }
      },
    };
  },
};

export default rule;
