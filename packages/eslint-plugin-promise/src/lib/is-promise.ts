import { PROMISE_STATICS } from './promise-statics.js';
import type * as ESTree from 'estree';

/**
 * Checks whether a node is a promise expression.
 * Matches: `.then()`, `.catch()`, `.finally()`, `Promise.staticMethod()`,
 * or chained calls on any of those.
 */
export function isPromise(expression: ESTree.Node): boolean {
  if (
    expression.type !== 'CallExpression'
    || expression.callee.type !== 'MemberExpression'
  ) {
    return false;
  }

  const { property } = expression.callee;
  if (property.type === 'Identifier') {
    const { name } = property;

    // .then(), .catch(), .finally()
    if (name === 'then' || name === 'catch' || name === 'finally') {
      return true;
    }

    // Promise.staticMethod()
    if (
      expression.callee.object.type === 'Identifier'
      && expression.callee.object.name === 'Promise'
      && PROMISE_STATICS.has(name)
      && name !== 'withResolvers'
    ) {
      return true;
    }
  }

  // Chained: somePromise.anything()
  return isPromise(expression.callee.object);
}
