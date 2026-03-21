import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./valid-params.js";

const ruleTester = new RuleTester();

describe("valid-params", () => {
  it("should enforce argument counts", () => {
    ruleTester.run("valid-params", rule, {
      valid: [
        "Promise.resolve()",
        "Promise.resolve(value)",
        "Promise.reject()",
        "Promise.reject(reason)",
        "Promise.all([p1, p2])",
        "Promise.race([p1])",
        "Promise.allSettled([p1])",
        "Promise.any([p1])",
        "p.then(fn)",
        "p.then(fn1, fn2)",
        "p.catch(fn)",
        "p.finally(fn)",
        // Not a promise
        "foo.bar()",
      ],
      invalid: [
        {
          code: "Promise.resolve(a, b)",
          errors: [{ messageId: "requireOneOptionalArgument" }],
        },
        {
          code: "Promise.reject(a, b)",
          errors: [{ messageId: "requireOneOptionalArgument" }],
        },
        {
          code: "Promise.all()",
          errors: [{ messageId: "requireOneArgument" }],
        },
        {
          code: "Promise.race()",
          errors: [{ messageId: "requireOneArgument" }],
        },
        {
          code: "p.then()",
          errors: [{ messageId: "requireTwoOptionalArguments" }],
        },
        {
          code: "p.then(a, b, c)",
          errors: [{ messageId: "requireTwoOptionalArguments" }],
        },
        {
          code: "p.catch()",
          errors: [{ messageId: "requireOneArgument" }],
        },
        {
          code: "p.finally()",
          errors: [{ messageId: "requireOneArgument" }],
        },
      ],
    });
  });

  it("should support exclude option", () => {
    ruleTester.run("valid-params", rule, {
      valid: [
        {
          code: "Promise.all()",
          options: [{ exclude: ["all"] }],
        },
      ],
      invalid: [],
    });
  });
});
