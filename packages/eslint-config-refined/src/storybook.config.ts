import { defineConfig } from "eslint/config";
import storybook from "eslint-plugin-storybook";

export function buildStorybookConfig() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return defineConfig([storybook.configs["flat/recommended"] as any]);
}
