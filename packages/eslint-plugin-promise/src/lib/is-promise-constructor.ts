import type * as ESTree from "estree";

export function isPromiseConstructor(
  node: ESTree.Node,
): node is ESTree.NewExpression & {
  callee: ESTree.Identifier & { name: "Promise" };
} {
  return (
    node.type === "NewExpression" &&
    node.callee.type === "Identifier" &&
    node.callee.name === "Promise"
  );
}

export function isPromiseConstructorWithInlineExecutor(
  node: ESTree.Node,
): node is ESTree.NewExpression & {
  callee: ESTree.Identifier & { name: "Promise" };
  arguments: [ESTree.FunctionExpression | ESTree.ArrowFunctionExpression];
} {
  return (
    isPromiseConstructor(node) &&
    node.arguments.length === 1 &&
    (node.arguments[0].type === "FunctionExpression" ||
      node.arguments[0].type === "ArrowFunctionExpression")
  );
}
