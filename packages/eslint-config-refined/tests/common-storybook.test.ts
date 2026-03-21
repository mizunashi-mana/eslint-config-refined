import { describe, expect, it } from "vitest";
import { calculateConfigForSnapshot, createESLint } from "./helpers.js";

describe("common + storybook ruleSets", () => {
  const eslint = createESLint({ ruleSets: ["common", "storybook"] });

  it("should apply correct rules for source files", async () => {
    const config = await calculateConfigForSnapshot(eslint, "src/app.ts");
    expect(config).toMatchSnapshot();
  });

  it("should apply correct rules for story files", async () => {
    const config = await calculateConfigForSnapshot(
      eslint,
      "src/app.stories.ts",
    );
    expect(config).toMatchSnapshot();
  });
});
