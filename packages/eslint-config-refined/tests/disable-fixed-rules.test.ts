import { describe, expect, it } from 'vitest';
import { calculateConfigForSnapshot, createESLint } from './helpers.js';

describe('common + node ruleSets with disableFixedRules', () => {
  const eslint = createESLint({
    ruleSets: ['common', 'node'],
    disableFixedRules: true,
  });

  it('should apply correct rules for source files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/app.ts');
    expect(config).toMatchSnapshot();
  });
});
