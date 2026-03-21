import type * as ESTree from "estree";
import type { Rule } from "eslint";

/**
 * Checks if a function node is directly inside a promise callback
 * (i.e., is an argument to `.then()` or `.catch()`).
 */
export function isInsidePromise(node: Rule.Node): boolean {
  const isFunctionExpression =
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression";
  if (!isFunctionExpression) return false;

  const parent = node.parent;
  if (!parent || parent.type !== "CallExpression") return false;

  const { callee } = parent as ESTree.CallExpression;
  if (callee.type !== "MemberExpression") return false;

  const { property } = callee;
  if (property.type !== "Identifier") return false;

  return property.name === "then" || property.name === "catch";
}
