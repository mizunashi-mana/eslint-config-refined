import { describe, expect, it } from "vitest";
import plugin from "./index.js";

describe("plugin", () => {
  it("should have meta", () => {
    expect(plugin.meta?.name).toBe(
      "@mizunashi_mana/eslint-plugin-promise",
    );
  });

  it("should have recommended config", () => {
    expect(plugin.configs).toHaveProperty("recommended");
    expect(Array.isArray(plugin.configs?.recommended)).toBe(true);
  });
});
