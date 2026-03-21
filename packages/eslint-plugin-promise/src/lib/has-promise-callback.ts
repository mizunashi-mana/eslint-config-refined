import type * as ESTree from "estree";

/**
 * Checks whether a CallExpression is a promise callback call
 * (i.e., `.then()` or `.catch()`).
 */
export function hasPromiseCallback(node: ESTree.Node): boolean {
  if (node.type !== "CallExpression") return false;
  if (node.callee.type !== "MemberExpression") return false;
  const { property } = node.callee;
  if (property.type !== "Identifier") return false;
  return property.name === "then" || property.name === "catch";
}
