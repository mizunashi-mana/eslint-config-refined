import { isPromiseConstructorWithInlineExecutor } from '../lib/is-promise-constructor.js';
import type { Rule, Scope } from 'eslint';

function* iterateAllPrevPathSegments(
  segment: Rule.CodePathSegment,
): Iterable<Rule.CodePathSegment[]> {
  yield* iterate(segment, []);

  function* iterate(
    seg: Rule.CodePathSegment,
    processed: Rule.CodePathSegment[],
  ): Iterable<Rule.CodePathSegment[]> {
    if (processed.includes(seg)) return;
    const nextProcessed = [seg, ...processed];

    for (const prev of seg.prevSegments) {
      if (prev.prevSegments.length === 0) {
        yield [prev];
      }
      else {
        for (const segments of iterate(prev, nextProcessed)) {
          yield [prev, ...segments];
        }
      }
    }
  }
}

function* iterateAllNextPathSegments(
  segment: Rule.CodePathSegment,
): Iterable<Rule.CodePathSegment[]> {
  yield* iterate(segment, []);

  function* iterate(
    seg: Rule.CodePathSegment,
    processed: Rule.CodePathSegment[],
  ): Iterable<Rule.CodePathSegment[]> {
    if (processed.includes(seg)) return;
    const nextProcessed = [seg, ...processed];

    for (const next of seg.nextSegments) {
      if (next.nextSegments.length === 0) {
        yield [next];
      }
      else {
        for (const segments of iterate(next, nextProcessed)) {
          yield [next, ...segments];
        }
      }
    }
  }
}

function findSameRoutePathSegment(
  segment: Rule.CodePathSegment,
): Rule.CodePathSegment | null {
  const routeSegments = new Set<Rule.CodePathSegment>();
  for (const route of iterateAllPrevPathSegments(segment)) {
    if (routeSegments.size === 0) {
      for (const seg of route) {
        routeSegments.add(seg);
      }
      continue;
    }
    for (const seg of routeSegments) {
      if (!route.includes(seg)) {
        routeSegments.delete(seg);
      }
    }
  }

  for (const routeSegment of routeSegments) {
    let hasUnreached = false;
    for (const segments of iterateAllNextPathSegments(routeSegment)) {
      if (!segments.includes(segment)) {
        hasUnreached = true;
        break;
      }
    }
    if (!hasUnreached) return routeSegment;
  }
  return null;
}

interface ReportData {
  node: Rule.Node;
  resolved: Rule.Node;
  kind: 'certain' | 'potential';
}

class CodePathSegmentInfo {
  pathInfo: CodePathInfo;
  segment: Rule.CodePathSegment;
  private _resolved: Rule.Node | null = null;
  potentiallyResolved: Rule.Node | null = null;

  constructor(pathInfo: CodePathInfo, segment: Rule.CodePathSegment) {
    this.pathInfo = pathInfo;
    this.segment = segment;
  }

  get resolved(): Rule.Node | null {
    return this._resolved;
  }

  set resolved(identifier: Rule.Node | null) {
    this._resolved = identifier;
    if (identifier) this.pathInfo.resolvedCount++;
  }
}

class CodePathInfo {
  segmentInfos = new Map<Rule.CodePathSegment, CodePathSegmentInfo>();
  resolvedCount = 0;
  currentSegments = new Set<Rule.CodePathSegment>();

  onSegmentEnter(segment: Rule.CodePathSegment) {
    this.currentSegments.add(segment);
  }

  onSegmentExit(segment: Rule.CodePathSegment) {
    this.currentSegments.delete(segment);
  }

  getCurrentSegmentInfos(): CodePathSegmentInfo[] {
    return [...this.currentSegments].map((segment) => {
      const info = this.segmentInfos.get(segment);
      if (info) return info;
      const newInfo = new CodePathSegmentInfo(this, segment);
      this.segmentInfos.set(segment, newInfo);
      return newInfo;
    });
  }

  * iterateReports(
    promiseCtx: PromiseCodePathContext,
  ): Iterable<ReportData> {
    const targets = [...this.segmentInfos.values()].filter(
      info => info.resolved,
    );
    for (const segmentInfo of targets) {
      const result = this._getAlreadyResolvedData(
        segmentInfo.segment,
        promiseCtx,
      );
      if (result) {
        yield {
          node: segmentInfo.resolved!,
          resolved: result.resolved,
          kind: result.kind,
        };
      }
    }
  }

  private _getAlreadyResolvedData(
    segment: Rule.CodePathSegment,
    promiseCtx: PromiseCodePathContext,
  ): { resolved: Rule.Node; kind: 'certain' | 'potential' } | null {
    const prevSegments = segment.prevSegments.filter(
      prev => !promiseCtx.isResolvedTryBlockCodePathSegment(prev),
    );
    if (prevSegments.length === 0) return null;

    const prevSegmentInfos = prevSegments.map(prev =>
      this._getProcessedSegmentInfo(prev, promiseCtx),
    );

    if (prevSegmentInfos.every(info => info.resolved)) {
      return {
        resolved: prevSegmentInfos[0].resolved!,
        kind: 'certain',
      };
    }

    for (const prevSegmentInfo of prevSegmentInfos) {
      if (prevSegmentInfo.resolved) {
        return {
          resolved: prevSegmentInfo.resolved,
          kind: 'potential',
        };
      }
      if (prevSegmentInfo.potentiallyResolved) {
        let potential = false;
        if (prevSegmentInfo.segment.nextSegments.length === 1) {
          potential = true;
        }
        else {
          const segmentInfo = this.segmentInfos.get(segment);
          if (segmentInfo?.resolved) {
            if (
              prevSegmentInfo.segment.nextSegments.every((next) => {
                const nextSegmentInfo = this.segmentInfos.get(next);
                return nextSegmentInfo?.resolved === segmentInfo.resolved;
              })
            ) {
              potential = true;
            }
          }
        }
        if (potential) {
          return {
            resolved: prevSegmentInfo.potentiallyResolved,
            kind: 'potential',
          };
        }
      }
    }

    const sameRoute = findSameRoutePathSegment(segment);
    if (sameRoute) {
      const sameRouteSegmentInfo = this._getProcessedSegmentInfo(sameRoute);
      if (sameRouteSegmentInfo.potentiallyResolved) {
        return {
          resolved: sameRouteSegmentInfo.potentiallyResolved,
          kind: 'potential',
        };
      }
    }
    return null;
  }

  private _getProcessedSegmentInfo(
    segment: Rule.CodePathSegment,
    promiseCtx?: PromiseCodePathContext,
  ): CodePathSegmentInfo {
    const segmentInfo = this.segmentInfos.get(segment);
    if (segmentInfo) return segmentInfo;

    const newInfo = new CodePathSegmentInfo(this, segment);
    this.segmentInfos.set(segment, newInfo);

    if (promiseCtx) {
      const alreadyResolvedData = this._getAlreadyResolvedData(
        segment,
        promiseCtx,
      );
      if (alreadyResolvedData) {
        if (alreadyResolvedData.kind === 'certain') {
          newInfo.resolved = alreadyResolvedData.resolved;
        }
        else {
          newInfo.potentiallyResolved = alreadyResolvedData.resolved;
        }
      }
    }
    return newInfo;
  }
}

class PromiseCodePathContext {
  private readonly resolvedSegmentIds = new Set<string>();

  addResolvedTryBlockCodePathSegment(segment: Rule.CodePathSegment) {
    this.resolvedSegmentIds.add(segment.id);
  }

  isResolvedTryBlockCodePathSegment(
    segment: Rule.CodePathSegment,
  ): boolean {
    return this.resolvedSegmentIds.has(segment.id);
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow creating new promises with paths that resolve multiple times.',
    },
    schema: [],
    messages: {
      alreadyResolved:
        'Promise should not be resolved multiple times. Promise is already resolved on line {{line}}.',
      potentiallyAlreadyResolved:
        'Promise should not be resolved multiple times. Promise is potentially resolved on line {{line}}.',
    },
  },
  create(context) {
    const reported = new Set<Rule.Node>();
    const promiseCodePathContext = new PromiseCodePathContext();

    function report(
      node: Rule.Node,
      resolved: Rule.Node,
      kind: 'certain' | 'potential',
    ) {
      if (reported.has(node)) return;
      reported.add(node);
      context.report({
        node: node.parent!,
        messageId:
          kind === 'certain'
            ? 'alreadyResolved'
            : 'potentiallyAlreadyResolved',
        data: {
          line: String(resolved.loc?.start.line ?? 0),
        },
      });
    }

    function verifyMultipleResolvedPath(codePathInfo: CodePathInfo) {
      for (const { node, resolved, kind } of codePathInfo.iterateReports(
        promiseCodePathContext,
      )) {
        report(node, resolved, kind);
      }
    }

    const codePathInfoStack: CodePathInfo[] = [];
    const resolverReferencesStack: Array<Set<Scope.Variable['references'][0]['identifier']>>
      = [new Set()];
    let lastThrowableExpression: Rule.Node | null = null;

    return {
      'FunctionExpression, ArrowFunctionExpression': function (node: Rule.Node) {
        if (!node.parent || !isPromiseConstructorWithInlineExecutor(node.parent)) { return; }

        const resolverReferences
          = new Set<Scope.Variable['references'][0]['identifier']>();
        const funcNode = node as Rule.Node & {
          params: Array<{ type: string; name?: string }>;
        };
        const resolvers = funcNode.params.filter(
          (p): p is { type: 'Identifier'; name: string } =>
            p.type === 'Identifier',
        );

        const scope = context.sourceCode.getScope(node);
        for (const resolver of resolvers) {
          const variable = scope.set.get(resolver.name);
          if (!variable) continue;
          for (const reference of variable.references) {
            resolverReferences.add(reference.identifier);
          }
        }

        resolverReferencesStack.unshift(resolverReferences);
      },
      'FunctionExpression:exit, ArrowFunctionExpression:exit': function (
        node: Rule.Node,
      ) {
        if (!node.parent || !isPromiseConstructorWithInlineExecutor(node.parent)) { return; }
        resolverReferencesStack.shift();
      },
      onCodePathStart() {
        codePathInfoStack.unshift(new CodePathInfo());
      },
      onCodePathEnd() {
        const codePathInfo = codePathInfoStack.shift()!;
        if (codePathInfo.resolvedCount > 1) {
          verifyMultipleResolvedPath(codePathInfo);
        }
      },
      'CallExpression, MemberExpression, NewExpression, ImportExpression, YieldExpression:exit': function (
        node: Rule.Node,
      ) {
        lastThrowableExpression = node;
      },
      onCodePathSegmentStart(segment: Rule.CodePathSegment) {
        codePathInfoStack[0].onSegmentEnter(segment);
      },
      onUnreachableCodePathSegmentStart(segment: Rule.CodePathSegment) {
        codePathInfoStack[0].onSegmentEnter(segment);
      },
      onCodePathSegmentEnd(
        segment: Rule.CodePathSegment,
        node: Rule.Node,
      ) {
        if (
          node.type === 'CatchClause'
          && lastThrowableExpression?.type === 'CallExpression'
          && node.parent?.type === 'TryStatement'
          && node.parent.range
          && lastThrowableExpression.range
          && node.parent.range[0] <= lastThrowableExpression.range[0]
          && lastThrowableExpression.range[1] <= node.parent.range[1]
        ) {
          const resolverReferences = resolverReferencesStack[0];
          const callee = (
            lastThrowableExpression as unknown as {
              callee: Rule.Node;
            }
          ).callee;
          if (resolverReferences.has(callee as never)) {
            promiseCodePathContext.addResolvedTryBlockCodePathSegment(segment);
          }
        }
        codePathInfoStack[0].onSegmentExit(segment);
      },
      onUnreachableCodePathSegmentEnd(segment: Rule.CodePathSegment) {
        codePathInfoStack[0].onSegmentExit(segment);
      },
      'CallExpression > Identifier.callee': function (node: Rule.Node) {
        const codePathInfo = codePathInfoStack[0];
        const resolverReferences = resolverReferencesStack[0];
        if (!resolverReferences.has(node as never)) return;

        for (const segmentInfo of codePathInfo.getCurrentSegmentInfos()) {
          if (segmentInfo.resolved) {
            report(node, segmentInfo.resolved, 'certain');
            continue;
          }
          segmentInfo.resolved = node;
        }
      },
    };
  },
};

export default rule;
