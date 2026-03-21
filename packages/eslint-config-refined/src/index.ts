import type { Linter } from "eslint";

export interface BuildConfigEnv {
  tsconfigPath?: string;
}

export function buildConfig(_env?: BuildConfigEnv): Linter.Config[] {
  return [];
}
