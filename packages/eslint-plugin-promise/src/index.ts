import { createRequire } from "node:module";
import type { ESLint, Linter } from "eslint";
import alwaysReturn from "./rules/always-return.js";
import catchOrReturn from "./rules/catch-or-return.js";
import noMultipleResolved from "./rules/no-multiple-resolved.js";
import noNesting from "./rules/no-nesting.js";
import noNewStatics from "./rules/no-new-statics.js";
import noPromiseInCallback from "./rules/no-promise-in-callback.js";
import noReturnWrap from "./rules/no-return-wrap.js";
import paramNames from "./rules/param-names.js";
import validParams from "./rules/valid-params.js";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json") as {
  name: string;
  version: string;
};

const PLUGIN_NAMESPACE = "@mizunashi_mana/promise";

const rules: ESLint.Plugin["rules"] = {
  "always-return": alwaysReturn,
  "catch-or-return": catchOrReturn,
  "no-multiple-resolved": noMultipleResolved,
  "no-nesting": noNesting,
  "no-new-statics": noNewStatics,
  "no-promise-in-callback": noPromiseInCallback,
  "no-return-wrap": noReturnWrap,
  "param-names": paramNames,
  "valid-params": validParams,
};

const configs: Record<string, Linter.Config[]> = {};

const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
  rules,
  configs,
} satisfies ESLint.Plugin;

Object.assign(configs, {
  recommended: [
    {
      plugins: {
        [PLUGIN_NAMESPACE]: plugin,
      },
      rules: {
        [`${PLUGIN_NAMESPACE}/always-return`]: "error",
        [`${PLUGIN_NAMESPACE}/catch-or-return`]: "error",
        [`${PLUGIN_NAMESPACE}/no-new-statics`]: "error",
        [`${PLUGIN_NAMESPACE}/no-return-wrap`]: "error",
        [`${PLUGIN_NAMESPACE}/param-names`]: "error",
        [`${PLUGIN_NAMESPACE}/no-multiple-resolved`]: "warn",
        [`${PLUGIN_NAMESPACE}/no-nesting`]: "warn",
        [`${PLUGIN_NAMESPACE}/no-promise-in-callback`]: "warn",
        [`${PLUGIN_NAMESPACE}/valid-params`]: "warn",
      } satisfies Record<string, Linter.RuleEntry>,
    },
  ] satisfies Linter.Config[],
});

export default plugin;
