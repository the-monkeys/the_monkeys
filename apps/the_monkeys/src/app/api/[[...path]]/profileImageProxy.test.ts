// @vitest-environment node
import { cookies } from 'next/headers';

import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as proxy from './route';

const api = vi.hoisted(() => ({
  API_URL: 'http://api.example.test/api/v1',
  API_URL_V2: 'http://api.example.test/api/v2',
}));
vi.mock('@/constants/api', () => api);
vi.mock('next/headers', () => ({ cookies: vi.fn() }));
const actualFetch = globalThis.fetch;
const revalidate = 'public, no-cache, max-age=0, must-revalidate';
const noStore = 'no-cache, no-store, must-revalidate';
const path = '/api/v2/storage/profiles/alice/profile';
const upstream = (status = 200, headers: HeadersInit = {}) =>
  new Response(status === 304 ? null : 'image-bytes', { status, headers });
let fetchSpy: ReturnType<typeof vi.fn>;
beforeEach(() => {
  api.API_URL = 'http://api.example.test/api/v1';
  api.API_URL_V2 = 'http://api.example.test/api/v2';
  vi.mocked(cookies).mockReturnValue({
    get: () => ({ value: 'cookie-token' }),
  } as any);
  fetchSpy = vi
    .fn()
    .mockResolvedValue(
      upstream(200, { 'Cache-Control': revalidate, ETag: '"avatar-v1"' })
    );
  vi.stubGlobal('fetch', fetchSpy);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const request = (pathname = path, method = 'GET', headers: HeadersInit = {}) =>
  new Request(`http://frontend.example.test${pathname}`, { method, headers });
const head = (req: Request) => (proxy as any).HEAD(req) as Promise<Response>;

describe('public avatar proxy caching', () => {
  it.each(['', '?t=old-client-value', '?size=50&v=2'])(
    'preserves revalidation on the exact public image path%s',
    async (query) => {
      const res = await proxy.GET(
        request(path + query, 'GET', {
          'If-None-Match': '"avatar-v1"',
          'If-Modified-Since': 'Sun, 18 Oct 2026 20:00:00 GMT',
          Host: 'frontend.example.test',
          Connection: 'close',
        })
      );
      expect(res.status).toBe(200);
      expect(await res.text()).toBe('image-bytes');
      expect(res.headers.get('Cache-Control')).toBe(revalidate);
      expect(res.headers.get('ETag')).toBe('"avatar-v1"');
      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe('http://api.example.test' + path + query);
      expect(init.cache).toBe('no-store');
      expect(init.headers.get('If-None-Match')).toBe('"avatar-v1"');
      expect(init.headers.get('If-Modified-Since')).toBe(
        'Sun, 18 Oct 2026 20:00:00 GMT'
      );
      expect(init.headers.get('Authorization')).toBe('Bearer cookie-token');
      expect(init.headers.has('host')).toBe(false);
      expect(init.headers.has('connection')).toBe(false);
    }
  );
  it('supports old backends without validators or a cache policy', async () => {
    fetchSpy.mockResolvedValue(upstream());
    const res = await proxy.GET(request());
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('image-bytes');
    expect(res.headers.get('ETag')).toBeNull();
    expect(res.headers.get('Cache-Control')).toBe(revalidate);
  });
  it.each([false, true])(
    'returns a bodyless 304, including an upstream adapter with body=%s',
    async (hasBody) => {
      const res = upstream(hasBody ? 200 : 304, {
        ETag: '"avatar-v1"',
        'Cache-Control': revalidate,
      });
      if (hasBody) Object.defineProperty(res, 'status', { value: 304 });
      fetchSpy.mockResolvedValue(res);
      const result = await proxy.GET(
        request(path, 'GET', { 'If-None-Match': '"avatar-v1"' })
      );
      expect(result.status).toBe(304);
      expect(result.body).toBeNull();
      expect(await result.text()).toBe('');
      expect(result.headers.get('ETag')).toBe('"avatar-v1"');
      expect(result.headers.get('Cache-Control')).toBe(revalidate);
    }
  );
  it('serves public image HEAD through GET with validators and no body', async () => {
    const res = await head(
      request(path, 'HEAD', { 'If-None-Match': '"avatar-v1"' })
    );
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
    expect(res.headers.get('Cache-Control')).toBe(revalidate);
    expect(fetchSpy.mock.calls[0][1].method).toBe('GET');
    expect(fetchSpy.mock.calls[0][1].headers.get('If-None-Match')).toBe(
      '"avatar-v1"'
    );
  });
  it('serves anonymous public image HEAD when an old backend GET is public but HEAD requires auth', async () => {
    vi.mocked(cookies).mockReturnValue({ get: () => undefined } as any);
    fetchSpy.mockImplementation(async (_url, init) => {
      if (init.method === 'HEAD')
        return upstream(401, { 'Cache-Control': 'no-store' });
      return upstream(200, {
        ETag: '"legacy-image"',
        'Content-Type': 'image/png',
      });
    });
    const res = await head(request(path + '?size=32', 'HEAD'));
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
    expect(res.headers.get('ETag')).toBe('"legacy-image"');
    expect(res.headers.get('Cache-Control')).toBe(revalidate);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][1].method).toBe('GET');
    expect(fetchSpy.mock.calls[0][1].headers.has('Authorization')).toBe(false);
  });
  it.each([
    '/api/v2/storage/profiles/alice/profile/meta',
    '/api/v2/storage/verifications/request/selfie/content',
    '/api/v2/auth/session',
    '/api/v2/admin/users',
  ])(
    'preserves GET-based HEAD compatibility for existing route %s',
    async (pathname) => {
      fetchSpy.mockImplementation(async (_url, init) =>
        upstream(init.method === 'HEAD' ? 401 : 200, {
          'Cache-Control': 'private, no-store',
        })
      );
      const res = await head(request(pathname, 'HEAD'));
      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
      expect(res.headers.get('Cache-Control')).toContain('no-store');
      expect(fetchSpy.mock.calls[0][1].method).toBe('GET');
      expect(fetchSpy.mock.calls[0][1].headers.get('Authorization')).toBe(
        'Bearer cookie-token'
      );
    }
  );
  it.each([401, 403, 404])(
    'preserves upstream GET status %s for private HEAD callers',
    async (status) => {
      vi.mocked(cookies).mockReturnValue({ get: () => undefined } as any);
      fetchSpy.mockResolvedValue(
        upstream(status, { 'Cache-Control': 'private, no-store' })
      );
      const res = await head(
        request('/api/v2/storage/verifications/request/selfie/content', 'HEAD')
      );
      expect(res.status).toBe(status);
      expect(res.body).toBeNull();
      expect(res.headers.get('Cache-Control')).toContain('no-store');
      expect(fetchSpy.mock.calls[0][1].method).toBe('GET');
      expect(fetchSpy.mock.calls[0][1].headers.has('Authorization')).toBe(
        false
      );
    }
  );

  it('does not pass through an old mutable avatar max-age', async () => {
    fetchSpy.mockResolvedValue(
      upstream(200, { 'Cache-Control': 'public, max-age=3600, immutable' })
    );
    const res = await proxy.GET(request());
    expect(res.headers.get('Cache-Control')).toBe(revalidate);
  });
  it.each([
    '/api/v2/storage/profiles/alice/profile/meta',
    '/api/v2/storage/profiles/alice/profile/url',
    '/api/v2/storage/profiles/alice/profile/',
    '/api/v2/storage/profiles/alice/profile.png',
    '/api/v2/storage/profiles/alice/nested/profile',
    '/api/v2/storage/profiles//profile',
    '/api/v2/storage/verifications/request/selfie/content',
    '/api/v2/storage/posts/private/cover.jpg',
    '/api/v2/storage/events/private/cover',
    '/api/v2/storage/assets/sha256/ab/cd/file.png',
    '/api/v2/admin/storage/profiles/alice/profile',
    '/api/v2/auth/storage/profiles/alice/profile',
  ])('keeps unrelated and private storage uncached: %s', async (pathname) => {
    const res = await proxy.GET(request(pathname));
    expect(res.headers.get('Cache-Control')).toBe(noStore);
    expect(res.headers.get('Expires')).toBe('0');
    expect(res.headers.get('Netlify-Vary')).toBe('query');
  });
  it.each([401, 403, 404, 500])(
    'keeps avatar status %s uncached and unchanged',
    async (status) => {
      fetchSpy.mockResolvedValue(
        upstream(status, {
          'Cache-Control': 'public, max-age=3600',
          'X-Content-Type-Options': 'nosniff',
        })
      );
      const res = await proxy.GET(request());
      expect(res.status).toBe(status);
      expect(await res.text()).toBe('image-bytes');
      expect(res.headers.get('Cache-Control')).toBe(noStore);
      expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    }
  );
  it.each(['private, max-age=60', 'no-store'])(
    'preserves a stricter upstream policy: %s',
    async (policy) => {
      fetchSpy.mockResolvedValue(upstream(200, { 'Cache-Control': policy }));
      const res = await proxy.GET(request());
      expect(res.headers.get('Cache-Control')).toBe(noStore);
    }
  );
  it('preserves cookies, security headers, and explicit authorization', async () => {
    const headers = new Headers({
      'Cache-Control': revalidate,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'",
      Vary: 'Origin',
    });
    headers.append('Set-Cookie', 'one=1; HttpOnly; Secure');
    headers.append('Set-Cookie', 'two=2; HttpOnly; Secure');
    fetchSpy.mockResolvedValue(upstream(200, headers));
    const res = await proxy.GET(
      request(path, 'GET', { Authorization: 'Bearer explicit-token' })
    );
    expect(res.headers.get('Set-Cookie')).toContain('one=1; HttpOnly; Secure');
    expect(res.headers.get('Set-Cookie')).toContain('two=2; HttpOnly; Secure');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Content-Security-Policy')).toBe(
      "default-src 'none'"
    );
    expect(res.headers.get('Vary')).toBe('Origin');
    expect(fetchSpy.mock.calls[0][1].headers.get('Authorization')).toBe(
      'Bearer explicit-token'
    );
  });
  it('leaves auth/admin cache policies unchanged', async () => {
    for (const pathname of ['/api/v2/auth/session', '/api/v2/admin/users']) {
      fetchSpy.mockResolvedValue(
        upstream(200, { 'Cache-Control': 'private, no-store' })
      );
      const res = await proxy.GET(request(pathname));
      expect(res.headers.get('Cache-Control')).toBe('private, no-store');
    }
  });
  it('keeps avatar writes uncached', async () => {
    const res = await proxy.POST(request(path, 'POST'));
    expect(res.headers.get('Cache-Control')).toBe(noStore);
  });
  it('revalidates and replaces public image bytes through real local HTTP', async () => {
    let etag = '"old"';
    let image = 'old-image';
    const seen: { method: string; validator?: string }[] = [];
    const server = createServer((req, res) => {
      seen.push({
        method: req.method!,
        validator: req.headers['if-none-match'],
      });
      if (req.method === 'HEAD') {
        res.writeHead(401);
        res.end();
        return;
      }
      res.setHeader('Cache-Control', revalidate);
      res.setHeader('ETag', etag);
      res.setHeader('Content-Type', 'image/png');
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304);
        res.end();
        return;
      }
      res.end(req.method === 'HEAD' ? undefined : image);
    });
    await new Promise<void>((resolve) =>
      server.listen(0, '127.0.0.1', resolve)
    );
    api.API_URL_V2 = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v2`;
    fetchSpy.mockImplementation(actualFetch);
    try {
      const first = await proxy.GET(request());
      expect(await first.text()).toBe('old-image');
      const unchanged = await proxy.GET(
        request(path + '?size=32', 'GET', {
          'If-None-Match': first.headers.get('ETag')!,
        })
      );
      expect(unchanged.status).toBe(304);
      expect(unchanged.body).toBeNull();
      etag = '"new"';
      image = 'new-image';
      const replaced = await proxy.GET(
        request(path, 'GET', { 'If-None-Match': '"old"' })
      );
      expect(replaced.status).toBe(200);
      expect(await replaced.text()).toBe('new-image');
      expect(replaced.headers.get('ETag')).toBe('"new"');
      const metadata = await head(
        request(path, 'HEAD', { 'If-None-Match': '"new"' })
      );
      expect(metadata.status).toBe(304);
      expect(metadata.body).toBeNull();
      expect(seen).toEqual([
        { method: 'GET' },
        { method: 'GET', validator: '"old"' },
        { method: 'GET', validator: '"old"' },
        { method: 'GET', validator: '"new"' },
      ]);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    }
  });
});
