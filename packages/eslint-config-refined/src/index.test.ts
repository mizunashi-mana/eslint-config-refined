import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";
import { buildConfig } from "./index.js";

describe("buildConfig snapshot tests", () => {
  describe("common ruleSet", () => {
    const eslint = createESLint({ ruleSets: ["common"] });

    it("should apply correct rules for source files", async () => {
      const config = await calculateConfigForSnapshot(eslint, "src/app.ts");
      expect(config).toMatchSnapshot();
    });

    it("should apply correct rules for test files", async () => {
      const config = await calculateConfigForSnapshot(
        eslint,
        "src/app.test.ts",
      );
      expect(config).toMatchSnapshot();
    });

    it("should apply correct rules for config files", async () => {
      const config = await calculateConfigForSnapshot(
        eslint,
        "eslint.config.ts",
      );
      expect(config).toMatchSnapshot();
    });

    it("should apply correct rules for entrypoint files", async () => {
      const config = await calculateConfigForSnapshot(eslint, "src/index.ts");
      expect(config).toMatchSnapshot();
    });
  });

  describe("common + node ruleSets", () => {
    const eslint = createESLint({ ruleSets: ["common", "node"] });

    it("should apply correct rules for source files", async () => {
      const config = await calculateConfigForSnapshot(eslint, "src/app.ts");
      expect(config).toMatchSnapshot();
    });

    it("should apply correct rules for entrypoint files", async () => {
      const config = await calculateConfigForSnapshot(eslint, "src/index.ts");
      expect(config).toMatchSnapshot();
    });
  });

  describe("common + node ruleSets with disableFixedRules", () => {
    const eslint = createESLint({
      ruleSets: ["common", "node"],
      disableFixedRules: true,
    });

    it("should apply correct rules for source files", async () => {
      const config = await calculateConfigForSnapshot(eslint, "src/app.ts");
      expect(config).toMatchSnapshot();
    });
  });
});

function createESLint(env: Parameters<typeof buildConfig>[0]): ESLint {
  const config = buildConfig(env);
  return new ESLint({
    overrideConfigFile: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    overrideConfig: config as any,
    cwd: process.cwd(),
  });
}

async function calculateConfigForSnapshot(eslint: ESLint, filePath: string) {
  const config = (await eslint.calculateConfigForFile(filePath)) as Record<
    string,
    unknown
  > & {
    languageOptions?: Record<string, unknown>;
  };

  return {
    ...config,
    language: undefined,
    defaultLanguageOptions: undefined,
    plugins: undefined,
    languageOptions: config.languageOptions
      ? {
          ...config.languageOptions,
          parser: undefined,
          parserOptions: undefined,
        }
      : undefined,
    settings: undefined,
  };
}
