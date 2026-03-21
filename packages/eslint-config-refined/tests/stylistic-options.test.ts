import { describe, expect, it } from "vitest";
import { calculateConfigForSnapshot, createESLint } from "./helpers.js";

describe("common ruleSet with custom stylistic options", () => {
  const eslint = createESLint({
    ruleSets: ["common"],
    stylistic: {
      indent: 4,
      semi: false,
      quotes: "double",
      braceStyle: "1tbs",
      commaDangle: "never",
    },
  });

  it("should apply correct rules for source files", async () => {
    const config = await calculateConfigForSnapshot(eslint, "src/app.ts");
    expect(config).toMatchSnapshot();
  });
});
