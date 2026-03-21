import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./always-return.js";

const ruleTester = new RuleTester();

describe("always-return", () => {
  it("should require return in then callbacks", () => {
    ruleTester.run("always-return", rule, {
      valid: [
        "p.then(() => { return 1 })",
        "p.then(() => { throw new Error() })",
        "p.then(() => 1)",
        "p.then(function() { return 1 })",
        // Second argument (rejection handler) is not checked
        "p.then(() => { return 1 }, () => {})",
        // Not a then() first arg
        "p.catch(() => {})",
      ],
      invalid: [
        {
          code: "p.then(function() { console.log('x') })",
          errors: [{ messageId: "thenShouldReturnOrThrow" }],
        },
        {
          code: "p.then(() => { console.log('x') })",
          errors: [{ messageId: "thenShouldReturnOrThrow" }],
        },
      ],
    });
  });

  it("should support ignoreLastCallback", () => {
    ruleTester.run("always-return", rule, {
      valid: [
        {
          code: "p.then(() => { console.log('x') })",
          options: [{ ignoreLastCallback: true }],
        },
        {
          // Last callback followed by catch is still "last"
          code: "p.then(() => { console.log('x') }).catch(() => {})",
          options: [{ ignoreLastCallback: true }],
        },
      ],
      invalid: [
        {
          // Not last callback (followed by another then)
          code: "p.then(() => { console.log('x') }).then(() => { return 1 })",
          options: [{ ignoreLastCallback: true }],
          errors: [{ messageId: "thenShouldReturnOrThrow" }],
        },
      ],
    });
  });
});
