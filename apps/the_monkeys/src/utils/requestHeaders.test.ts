import { beforeEach, describe, expect, it } from 'vitest';

describe('getAllRequestHeaders', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: undefined,
    });
  });

  it('returns browser metadata without waiting for public IP discovery', async () => {
    const { getAllRequestHeaders } = await import('./requestHeaders');

    const headers = await Promise.race([
      getAllRequestHeaders(),
      new Promise<never>((_, reject) => {
        window.setTimeout(
          () => reject(new Error('request headers waited for public IP')),
          50
        );
      }),
    ]);

    expect(headers).not.toHaveProperty('X-Real-IP');
    expect(headers).toHaveProperty('X-User-Agent');
    expect(headers).toHaveProperty('X-Dark-Mode', '0');
  });
});
