import type * as ESTree from 'estree';

export function isPromiseConstructor(
  node: ESTree.Node,
): node is ESTree.NewExpression & {
  callee: ESTree.Identifier & { name: 'Promise' };
} {
  return (
    node.type === 'NewExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === 'Promise'
  );
}

export function isPromiseConstructorWithInlineExecutor(
  node: ESTree.Node,
): node is ESTree.NewExpression & {
  callee: ESTree.Identifier & { name: 'Promise' };
  arguments: [ESTree.FunctionExpression | ESTree.ArrowFunctionExpression];
} {
  if (!isPromiseConstructor(node)) return false;
  if (node.arguments.length !== 1) return false;
  const executor = node.arguments[0];
  return (
    executor !== undefined
    && (executor.type === 'FunctionExpression'
      || executor.type === 'ArrowFunctionExpression')
  );
}
