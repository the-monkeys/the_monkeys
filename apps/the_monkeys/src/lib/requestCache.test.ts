import { describe, expect, it, vi } from 'vitest';

import { requestCache } from './requestCache';

describe('request cache adapter', () => {
  it('preserves the wrapped async function contract', async () => {
    const loader = vi.fn(async (id: string) => ({ id }));
    const cachedLoader = requestCache(loader);

    await expect(cachedLoader('post-1')).resolves.toEqual({ id: 'post-1' });
  });
});
