import { isInsidePromise } from './is-inside-promise.js';
import type { Rule } from 'eslint';

/**
 * Checks if a function node is inside a callback
 * (i.e., has `err` or `error` as the first parameter).
 */
export function isInsideCallback(
  node: Rule.Node,
  exemptDeclarations = false,
): boolean {
  const isFunction
    = node.type === 'FunctionExpression'
      || node.type === 'ArrowFunctionExpression'
      || (!exemptDeclarations && node.type === 'FunctionDeclaration');
  if (!isFunction) return false;

  // It's fine to use promises inside promises
  if (isInsidePromise(node)) return false;

  const funcNode = node as Rule.Node & {
    params: Array<{ type: string; name?: string }>;
  };
  const firstParam = funcNode.params[0];
  if (firstParam?.type !== 'Identifier') return false;

  return firstParam.name === 'err' || firstParam.name === 'error';
}
