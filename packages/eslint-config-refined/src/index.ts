import { defineConfig } from "eslint/config";
import { buildGlobalsConfig } from "./globals.config.js";
import { buildJsConfig } from "./js.config.js";
import { buildTsConfig } from "./ts.config.js";

export type RuleSet = "common" | "node";

export interface BuildConfigEnv {
  disableFixedRules?: boolean;
  ruleSets?: RuleSet[];
  entrypointFiles?: string[];
}

export function buildConfig(env?: BuildConfigEnv) {
  const ruleSets = env?.ruleSets ?? ["common", "node"];
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
        );
        break;
      case "node":
        // TODO: implement node config in a follow-up task
        break;
    }
  }

  return defineConfig(rules);
}
