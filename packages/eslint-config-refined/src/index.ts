import { defineConfig } from "eslint/config";
import { buildCommentsConfig } from "./comments.config.js";
import { buildGlobalsConfig } from "./globals.config.js";
import { buildImportsConfig } from "./imports.config.js";
import { buildJsConfig } from "./js.config.js";
import { buildNodeConfig } from "./node.config.js";
import { buildPlaywrightConfig } from "./playwright.config.js";
import { buildPromiseConfig } from "./promise.config.js";
import { buildReactConfig } from "./react.config.js";
import { buildStorybookConfig } from "./storybook.config.js";
import {
  type StylisticOptions,
  buildStylisticConfig,
} from "./stylistic.config.js";
import { buildTsConfig } from "./ts.config.js";

export type RuleSet = "common" | "node" | "react" | "playwright" | "storybook";

export type { StylisticOptions };

export interface BuildConfigEnv {
  disableFixedRules?: boolean;
  ruleSets?: RuleSet[];
  entrypointFiles?: string[];
  stylistic?: StylisticOptions;
  playwrightFiles?: string[];
}

export function buildConfig(env?: BuildConfigEnv) {
  const ruleSets = env?.ruleSets ?? ["common", "node"];
  const disableFixedRules =
    env?.disableFixedRules ?? process.env.DISABLE_FIXED_RULES === "true";
  const entrypointFiles = env?.entrypointFiles ?? ["src/index.ts"];

  const rules: Parameters<typeof defineConfig>[0] = [
    buildGlobalsConfig(),
  ];

  for (const ruleSet of ruleSets) {
    switch (ruleSet) {
      case "common":
        rules.push(
          buildJsConfig({ entrypointFiles }),
          buildTsConfig(),
          buildStylisticConfig(env?.stylistic),
          buildImportsConfig({ disableFixedRules }),
          buildPromiseConfig(),
          buildCommentsConfig(),
        );
        break;
      case "node":
        rules.push(buildNodeConfig({ entrypointFiles }));
        break;
      case "react":
        rules.push(buildReactConfig());
        break;
      case "playwright":
        rules.push(buildPlaywrightConfig({ files: env?.playwrightFiles }));
        break;
      case "storybook":
        rules.push(buildStorybookConfig());
        break;
    }
  }

  return defineConfig(rules);
}
