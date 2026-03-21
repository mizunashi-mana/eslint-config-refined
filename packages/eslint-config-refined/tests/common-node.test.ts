import { describe, expect, it } from 'vitest';
import { calculateConfigForSnapshot, createESLint } from './helpers.js';

describe('common + node ruleSets', () => {
  const eslint = createESLint({ ruleSets: ['common', 'node'] });

  it('should apply correct rules for source files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/app.ts');
    expect(config).toMatchSnapshot();
  });

  it('should apply correct rules for entrypoint files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/index.ts');
    expect(config).toMatchSnapshot();
  });
});
