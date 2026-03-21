import { describe, expect, it } from "vitest";
import { buildConfig } from "./index.js";

describe("buildConfig", () => {
  it("returns an array of ESLint configs", () => {
    const configs = buildConfig();
    expect(Array.isArray(configs)).toBe(true);
  });
});
