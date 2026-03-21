import type { Rule } from 'eslint';
import type * as ESTree from 'estree';

function isFunctionWithBlockStatement(node: ESTree.Node): boolean {
  if (node.type === 'FunctionExpression') return true;
  if (node.type === 'ArrowFunctionExpression') {
    return node.body.type === 'BlockStatement';
  }
  return false;
}

function isMemberCall(
  memberName: string,
  node: ESTree.Node,
): node is ESTree.CallExpression {
  return (
    node.type === 'CallExpression'
    && node.callee.type === 'MemberExpression'
    && !node.callee.computed
    && node.callee.property.type === 'Identifier'
    && node.callee.property.name === memberName
  );
}

function isFirstArgument(node: Rule.Node): boolean {
  const parent = node.parent;
  return parent !== null && parent.type === 'CallExpression' && parent.arguments[0] === node;
}

type InlineThenFunction = Rule.Node
  & (ESTree.FunctionExpression | ESTree.ArrowFunctionExpression);

function isInlineThenFunctionExpression(
  node: Rule.Node,
): node is InlineThenFunction {
  return (
    isFunctionWithBlockStatement(node)
    && node.parent !== null
    && isMemberCall('then', node.parent)
    && isFirstArgument(node)
  );
}

function isLastCallback(node: InlineThenFunction): boolean {
  let target: Rule.Node = node.parent;
  let parent = target.parent as Rule.Node | undefined;
  while (parent) {
    if (parent.type === 'ExpressionStatement') return true;
    if (
      parent.type === 'UnaryExpression'
      && (parent as ESTree.UnaryExpression).operator === 'void'
    ) {
      return true;
    }

    let nextTarget: Rule.Node | null = null;
    if (parent.type === 'SequenceExpression') {
      const expressions = (parent as ESTree.SequenceExpression).expressions;
      if (expressions[expressions.length - 1] !== target) return true;
      nextTarget = parent;
    }
    else if (
      parent.type === 'ChainExpression'
      || parent.type === 'AwaitExpression'
    ) {
      nextTarget = parent;
    }
    else if (parent.type === 'MemberExpression') {
      if (
        isMemberCall('catch', parent.parent)
        || isMemberCall('finally', parent.parent)
      ) {
        nextTarget = parent.parent;
      }
    }

    if (nextTarget) {
      target = nextTarget;
      parent = target.parent;
      continue;
    }
    return false;
  }
  return false;
}

function getRootObjectName(node: ESTree.Node): string | undefined {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression') return getRootObjectName(node.object);
  return undefined;
}

function isIgnoredAssignment(
  node: ESTree.Statement,
  ignoredVars: string[],
): boolean {
  if (node.type !== 'ExpressionStatement') return false;
  const expr = node.expression;
  if (expr.type !== 'AssignmentExpression') return false;
  const rootName = getRootObjectName(expr.left);
  return rootName !== undefined && ignoredVars.includes(rootName);
}

interface BranchInfo {
  good: boolean;
  node: Rule.Node;
}

interface FuncInfo {
  branchIDStack: string[];
  branchInfoMap: Record<string, BranchInfo | undefined>;
}

function peek<T>(arr: T[]): T {
  const value = arr[arr.length - 1];
  if (value === undefined) {
    throw new Error('peek called on empty array');
  }
  return value;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require returning inside each `then()` to create readable and reusable Promise chains.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreLastCallback: { type: 'boolean' },
          ignoreAssignmentVariable: {
            type: 'array',
            items: { type: 'string', pattern: '^[\\w$]+$' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      thenShouldReturnOrThrow: 'Each then() should return a value or throw',
    },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as {
      ignoreLastCallback?: boolean;
      ignoreAssignmentVariable?: string[];
    };
    const ignoreLastCallback = options.ignoreLastCallback ?? false;
    const ignoreAssignmentVariable = options.ignoreAssignmentVariable ?? [
      'globalThis',
    ];

    const funcInfoStack: FuncInfo[] = [];

    function markCurrentBranchAsGood() {
      const funcInfo = peek(funcInfoStack);
      const currentBranchID = peek(funcInfo.branchIDStack);
      const branchInfo = funcInfo.branchInfoMap[currentBranchID];
      if (branchInfo) {
        branchInfo.good = true;
      }
    }

    return {
      'ReturnStatement:exit': markCurrentBranchAsGood,
      'ThrowStatement:exit': markCurrentBranchAsGood,
      'ExpressionStatement > CallExpression > MemberExpression[object.name="process"][property.name="exit"]:exit':
        markCurrentBranchAsGood,
      'ExpressionStatement > CallExpression > MemberExpression[object.name="process"][property.name="abort"]:exit':
        markCurrentBranchAsGood,

      onCodePathSegmentStart(
        segment: Rule.CodePathSegment,
        node: Rule.Node,
      ) {
        const funcInfo = peek(funcInfoStack);
        funcInfo.branchIDStack.push(segment.id);
        funcInfo.branchInfoMap[segment.id] = { good: false, node };
      },

      onCodePathSegmentEnd() {
        const funcInfo = peek(funcInfoStack);
        funcInfo.branchIDStack.pop();
      },

      onCodePathStart() {
        funcInfoStack.push({
          branchIDStack: [],
          branchInfoMap: {},
        });
      },

      onCodePathEnd(path: Rule.CodePath, node: Rule.Node) {
        const funcInfo = funcInfoStack.pop();
        if (!funcInfo) return;

        if (!isInlineThenFunctionExpression(node)) return;
        if (ignoreLastCallback && isLastCallback(node)) return;

        if (ignoreAssignmentVariable.length > 0 && isLastCallback(node)) {
          const body = (
            node as ESTree.FunctionExpression | ESTree.ArrowFunctionExpression
          ).body;
          if (body.type === 'BlockStatement') {
            for (const statement of body.body) {
              if (isIgnoredAssignment(statement, ignoreAssignmentVariable)) {
                return;
              }
            }
          }
        }

        for (const segment of path.finalSegments) {
          const branch = funcInfo.branchInfoMap[segment.id];
          if (branch && !branch.good) {
            context.report({
              messageId: 'thenShouldReturnOrThrow',
              node: branch.node,
            });
          }
        }
      },
    };
  },
};

export default rule;
