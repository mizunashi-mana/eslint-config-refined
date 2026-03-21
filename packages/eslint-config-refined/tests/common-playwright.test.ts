import { describe, expect, it } from 'vitest';
import { calculateConfigForSnapshot, createESLint } from './helpers.js';

describe('common + playwright ruleSets', () => {
  const eslint = createESLint({ ruleSets: ['common', 'playwright'] });

  it('should apply correct rules for source files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/app.ts');
    expect(config).toMatchSnapshot();
  });

  it('should apply correct rules for test files', async () => {
    const config = await calculateConfigForSnapshot(
      eslint,
      'src/app.test.ts',
    );
    expect(config).toMatchSnapshot();
  });
});
