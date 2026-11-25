import { imageAccessPolicy } from '@/lib/sensitiveImagePolicy';
import { describe, expect, it, vi } from 'vitest';

const origin = 'http://frontend.test';
const api = 'http://backend.test/api/v1';
describe('sensitive image admission', () => {
  it('leaves unrelated static images unchanged', async () => {
    const fetcher = vi.fn();
    expect(
      await imageAccessPolicy(
        '/images/logo.svg',
        origin,
        api,
        new Headers(),
        fetcher
      )
    ).toEqual({ allowed: true, protected: false });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('checks both current storage aliases and old post URLs', async () => {
    for (const path of [
      '/api/v2/storage/posts/post/a.png',
      '/api/storage/events/event/cover',
      '/api/v1/files/post/post/a.png',
    ]) {
      const fetcher = vi
        .fn()
        .mockResolvedValue(Response.json({ allowed: false }));
      expect(
        (await imageAccessPolicy(path, origin, api, new Headers(), fetcher))
          .allowed
      ).toBe(false);
      const url = new URL(String(fetcher.mock.calls[0][0]));
      expect(url.origin).toBe('http://backend.test');
      expect(url.searchParams.get('path')).toBe(
        path.replace(/^\/api\/storage\//, '/api/v2/storage/')
      );
    }
  });
  it('forwards session credentials only to the configured policy service', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ allowed: true }));
    const result = await imageAccessPolicy(
      'https://monkeys.support/api/storage/posts/post/a.png',
      origin,
      api,
      new Headers({
        cookie: 'analytics=private; mat=fixture',
        authorization: 'Bearer fixture',
        'x-user-role': 'Admin',
      }),
      fetcher
    );
    expect(result).toEqual({ allowed: true, protected: true });
    const options = fetcher.mock.calls[0][1];
    expect(new Headers(options.headers).get('cookie')).toBe('mat=fixture');
    expect(new Headers(options.headers).get('x-user-role')).toBeNull();
    expect(options.cache).toBe('no-store');
    expect(options.redirect).toBe('error');
  });
  it('fails closed on missing configuration, a policy outage or invalid data', async () => {
    for (const fetcher of [
      vi.fn().mockRejectedValue(new Error('private detail')),
      vi.fn().mockResolvedValue(new Response('broken')),
      vi
        .fn()
        .mockResolvedValue(Response.json({ allowed: true }, { status: 503 })),
    ]) {
      expect(
        (
          await imageAccessPolicy(
            '/api/storage/posts/post/a.png',
            origin,
            api,
            new Headers(),
            fetcher
          )
        ).allowed
      ).toBe(false);
    }
    expect(
      (
        await imageAccessPolicy(
          '/api/storage/posts/post/a.png',
          origin,
          undefined,
          new Headers(),
          vi.fn()
        )
      ).allowed
    ).toBe(false);
  });
  it('never shares optimized proxy-wrapper images or unsupported schemes', async () => {
    const fetcher = vi.fn();
    for (const source of [
      '/api/proxy-image?url=https%3A%2F%2Fimages.test%2Fa.png',
      'javascript:alert(1)',
      'file:///private',
    ]) {
      expect(
        (await imageAccessPolicy(source, origin, api, new Headers(), fetcher))
          .allowed
      ).toBe(false);
    }
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('recognises encoded storage prefixes', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(Response.json({ allowed: false }));
    const result = await imageAccessPolicy(
      '/%61pi/v2/storage/assets/sha256/aa/aa/asset.png',
      origin,
      api,
      new Headers(),
      fetcher
    );
    expect(result.allowed).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
