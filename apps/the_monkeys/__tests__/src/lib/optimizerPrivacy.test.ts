import { expect, it } from 'vitest';

it('disables the framework cache that can otherwise retain newly restricted image bytes', async () => {
  const config = (await import('../../../next.config.mjs')).default;
  expect(config.images?.unoptimized).toBe(true);
});
