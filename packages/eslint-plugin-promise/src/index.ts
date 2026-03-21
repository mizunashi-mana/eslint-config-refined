import { createRequire } from "node:module";
import type { ESLint, Linter } from "eslint";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json") as {
  name: string;
  version: string;
};

const rules: ESLint.Plugin["rules"] = {};

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
        "@mizunashi_mana/promise": plugin,
      },
      rules: {} as Record<string, Linter.RuleEntry>,
    },
  ] satisfies Linter.Config[],
});

export default plugin;
