import { ESLint } from 'eslint';
import { buildConfig } from '@mizunashi_mana/eslint-config-refined';

export function createESLint(
  env: Parameters<typeof buildConfig>[0],
): ESLint {
  const config = buildConfig(env);
  return new ESLint({
    overrideConfigFile: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-type-assertion -- ESLint API type mismatch with defineConfig return type
    overrideConfig: config as any,
    cwd: process.cwd(),
  });
}

export async function calculateConfigForSnapshot(
  eslint: ESLint,
  filePath: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint calculateConfigForFile returns untyped config object
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
