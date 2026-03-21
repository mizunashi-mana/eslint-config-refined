import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./no-nesting.js";

const ruleTester = new RuleTester();

describe("no-nesting", () => {
  it("should disallow nested promises", () => {
    ruleTester.run("no-nesting", rule, {
      valid: [
        "p.then(() => {})",
        "p.then(function () {})",
        "p.catch(() => {})",
        // Flat chain
        "p.then(() => {}).then(() => {})",
        // Variable reference from outer scope is allowed
        "p.then((val) => { return other.then((v) => val + v) })",
      ],
      invalid: [
        {
          code: "p.then(() => { q.then(() => {}) })",
          errors: [{ messageId: "avoidNesting" }],
        },
        {
          code: "p.then(() => { q.catch(() => {}) })",
          errors: [{ messageId: "avoidNesting" }],
        },
        {
          code: "p.catch(() => { q.then(() => {}) })",
          errors: [{ messageId: "avoidNesting" }],
        },
      ],
    });
  });
});
