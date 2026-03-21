import type * as ESTree from "estree";
import type { Rule } from "eslint";
import { isPromise } from "../lib/is-promise.js";

function isInPromise(node: Rule.Node): boolean {
  let current: Rule.Node | null = node;
  // Walk up to find the closest function expression
  while (current) {
    if (
      current.type === "ArrowFunctionExpression" ||
      current.type === "FunctionExpression"
    ) {
      break;
    }
    current = current.parent ?? null;
  }
  if (!current) return false;

  let functionNode: Rule.Node = current;
  // Skip .bind() calls
  while (
    functionNode.parent?.type === "MemberExpression" &&
    functionNode.parent.object === functionNode &&
    functionNode.parent.property.type === "Identifier" &&
    functionNode.parent.property.name === "bind" &&
    functionNode.parent.parent?.type === "CallExpression" &&
    (
      functionNode.parent.parent as ESTree.CallExpression &
        Rule.NodeParentExtension
    ).callee === functionNode.parent
  ) {
    functionNode = functionNode.parent.parent;
  }

  return Boolean(functionNode.parent && isPromise(functionNode.parent));
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow wrapping values in `Promise.resolve` or `Promise.reject` when not needed.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowReject: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      resolve: "Avoid wrapping return values in Promise.resolve",
      reject: "Expected throw instead of Promise.reject",
    },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as { allowReject?: boolean };
    const allowReject = options.allowReject ?? false;

    function checkCallExpression(
      callExpr: ESTree.CallExpression,
      reportNode: Rule.Node,
    ) {
      if (!isInPromise(reportNode)) return;
      if (callExpr.callee.type !== "MemberExpression") return;
      if (callExpr.callee.object.type !== "Identifier") return;
      if (callExpr.callee.object.name !== "Promise") return;
      if (callExpr.callee.property.type !== "Identifier") return;

      if (callExpr.callee.property.name === "resolve") {
        context.report({ node: reportNode, messageId: "resolve" });
      } else if (!allowReject && callExpr.callee.property.name === "reject") {
        context.report({ node: reportNode, messageId: "reject" });
      }
    }

    return {
      ReturnStatement(node) {
        if (node.argument?.type === "CallExpression") {
          checkCallExpression(node.argument, node);
        }
      },
      "ArrowFunctionExpression > CallExpression"(node: Rule.Node) {
        checkCallExpression(node as unknown as ESTree.CallExpression, node);
      },
    };
  },
};

export default rule;
