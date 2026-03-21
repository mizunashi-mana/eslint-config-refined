import { describe, expect, it } from "vitest";
import { buildConfig } from "./index.js";

describe("buildConfig", () => {
  it("returns an array of ESLint configs", () => {
    const configs = buildConfig();
    expect(Array.isArray(configs)).toBe(true);
  });

  it("returns configs with rules when common ruleset is used", () => {
    const configs = buildConfig({ ruleSets: ["common"] });
    expect(configs.length).toBeGreaterThan(0);
  });

  it("includes globals config by default", () => {
    const configs = buildConfig({ ruleSets: [] });
    expect(configs.length).toBeGreaterThan(0);
  });

  it("uses default entrypointFiles when not specified", () => {
    const configs = buildConfig();
    expect(Array.isArray(configs)).toBe(true);
  });

  it("accepts custom entrypointFiles", () => {
    const configs = buildConfig({ entrypointFiles: ["src/main.ts"] });
    expect(Array.isArray(configs)).toBe(true);
  });
});
