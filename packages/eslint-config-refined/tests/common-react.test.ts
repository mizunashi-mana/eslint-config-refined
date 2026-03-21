import { describe, expect, it } from 'vitest';
import { calculateConfigForSnapshot, createESLint } from './helpers.js';

describe('common + react ruleSets', () => {
  const eslint = createESLint({ ruleSets: ['common', 'react'] });

  it('should apply correct rules for source files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/app.tsx');
    expect(config).toMatchSnapshot();
  });

  it('should apply correct rules for test files', async () => {
    const config = await calculateConfigForSnapshot(eslint, 'src/app.test.tsx');
    expect(config).toMatchSnapshot();
  });
});
