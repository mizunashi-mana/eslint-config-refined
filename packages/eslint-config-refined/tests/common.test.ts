import { describe, expect, it } from 'vitest';
import { calculateConfigForSnapshot, createESLint } from './helpers.js';

describe('common ruleSet', () => {
  const eslint = createESLint({ ruleSets: ['common'] });

  it('should apply correct rules for source files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/app.ts');
    expect(config).toMatchSnapshot();
  });

  it('should apply correct rules for test files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/app.test.ts');
    expect(config).toMatchSnapshot();
  });

  it('should apply correct rules for config files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'eslint.config.ts');
    expect(config).toMatchSnapshot();
  });

  it('should apply correct rules for entrypoint files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/index.ts');
    expect(config).toMatchSnapshot();
  });
});
