import { NextRequest } from 'next/server';

import { GET } from '@/app/api/proxy-image/route';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({ API_URL: 'http://backend.test/api/v1' }));

afterEach(() => vi.unstubAllGlobals());
function request(url: string) {
  return new NextRequest(
    'http://frontend.test/api/proxy-image?url=' + encodeURIComponent(url),
    { headers: { cookie: 'mat=fixture; private=value' } }
  );
}
describe('image export proxy admission', () => {
  it('does not fetch a restricted original', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(Response.json({ allowed: false }));
    vi.stubGlobal('fetch', fetcher);
    const result = await GET(
      request('http://backend.test/api/storage/posts/post/a.png')
    );
    expect(result.status).toBe(404);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('rechecks redirects before accessing an owned original and never forwards external credentials', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: {
            location: 'http://backend.test/api/storage/posts/post/a.png',
          },
        })
      )
      .mockResolvedValueOnce(Response.json({ allowed: false }));
    vi.stubGlobal('fetch', fetcher);
    const result = await GET(request('https://images.test/logo.png'));
    expect(result.status).toBe(404);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(new Headers(fetcher.mock.calls[0][1]?.headers).has('cookie')).toBe(
      false
    );
  });
  it('preserves allowed image exports without caching protected bytes', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ allowed: true }))
      .mockResolvedValueOnce(
        new Response('SAFE_TEST_IMAGE', {
          headers: { 'content-type': 'image/png' },
        })
      );
    vi.stubGlobal('fetch', fetcher);
    const result = await GET(
      request('http://backend.test/api/storage/posts/post/a.png')
    );
    expect(result.status).toBe(200);
    expect(await result.text()).toBe('SAFE_TEST_IMAGE');
    expect(result.headers.get('cache-control')).toContain('no-store');
  });
  it('does not fetch non-http URLs', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    expect((await GET(request('file:///private'))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
