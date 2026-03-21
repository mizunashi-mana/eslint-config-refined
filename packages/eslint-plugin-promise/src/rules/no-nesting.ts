import type { Rule, Scope } from "eslint";
import { hasPromiseCallback } from "../lib/has-promise-callback.js";
import { isInsidePromise } from "../lib/is-inside-promise.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow nested `then()` or `catch()` statements.",
    },
    schema: [],
    messages: {
      avoidNesting: "Avoid nesting promises.",
    },
  },
  create(context) {
    /**
     * Stack of callback function scopes.
     * Scopes are in order closest to the current node.
     */
    const callbackScopes: Scope.Scope[] = [];

    function* iterateDefinedReferences(
      scope: Scope.Scope,
    ): Iterable<Scope.Reference> {
      for (const variable of scope.variables) {
        for (const reference of variable.references) {
          yield reference;
        }
      }
    }

    return {
      ":function"(node: Rule.Node) {
        if (isInsidePromise(node)) {
          callbackScopes.unshift(context.sourceCode.getScope(node));
        }
      },
      ":function:exit"(node: Rule.Node) {
        if (isInsidePromise(node)) {
          callbackScopes.shift();
        }
      },
      CallExpression(node) {
        if (!hasPromiseCallback(node)) return;
        if (!callbackScopes.length) return;

        // Allow nesting when the inner promise callback references variables
        // defined in the outer callback scope (e.g., using the outer callback's
        // parameter). This indicates the nesting is intentional because the inner
        // promise depends on the outer callback's value.
        const closestCallbackScope = callbackScopes[0];
        for (const reference of iterateDefinedReferences(
          closestCallbackScope,
        )) {
          const isReferencedInCallbackArgs = node.arguments.some(
            (arg) =>
              arg.range &&
              reference.identifier.range &&
              arg.range[0] <= reference.identifier.range[0] &&
              reference.identifier.range[1] <= arg.range[1],
          );
          if (isReferencedInCallbackArgs) {
            return;
          }
        }

        if (
          node.callee.type === "MemberExpression" &&
          node.callee.property.type === "Identifier"
        ) {
          context.report({
            node: node.callee.property,
            messageId: "avoidNesting",
          });
        }
      },
    };
  },
};

export default rule;
