import { GET } from '@/app/discussions/[id]/image/route';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock('@/lib/discussionPageData', () => ({ loadDiscussion: mocks.load }));
vi.mock('node:fs/promises', () => {
  const readFile = vi.fn().mockResolvedValue(Buffer.from('<svg/>'));
  return { readFile, default: { readFile } };
});
vi.mock('@/constants/api', () => ({
  API_URL: 'http://localhost:8081/api/v1',
  LIVE_URL: 'http://localhost:3000',
}));
vi.mock('next/og', () => ({
  ImageResponse: class extends Response {
    constructor(_element: unknown, options: Record<string, unknown>) {
      super(JSON.stringify(options), {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
      });
    }
  },
}));
beforeEach(() => {
  mocks.load.mockResolvedValue({
    state: 'ok',
    indexable: true,
    discussion: {
      public_id: 'abc',
      status: 'visible',
      body: 'Public message',
      author_username: 'alice',
    },
  });
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockImplementation(
        async (url: string) =>
          new Response(
            url.endsWith('.svg')
              ? '<svg/>'
              : JSON.stringify({ username: 'alice', is_verified: true })
          )
      )
  );
});
afterEach(() => vi.unstubAllGlobals());

it('serves an anonymous landscape preview and a square snap without forwarding credentials', async () => {
  const response = await GET(
    new Request('http://localhost/discussions/abc/image'),
    { params: { id: 'abc' } }
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ width: 1200, height: 630 });
  const square = await GET(
    new Request('http://localhost/discussions/abc/image?variant=snapshot'),
    { params: { id: 'abc' } }
  );
  expect(await square.json()).toMatchObject({ width: 1080, height: 1080 });
  expect(mocks.load).toHaveBeenCalledWith('abc', '');
  expect(response.headers.get('cache-control')).toBe('no-store');
});

it.each([
  { state: 'missing' },
  {
    state: 'ok',
    discussion: {
      public_id: 'abc',
      status: 'visible',
      body: 'private',
      audience: 'group_only',
    },
  },
  {
    state: 'ok',
    discussion: { public_id: 'abc', status: 'deleted', body: 'removed' },
  },
])('does not render private, deleted or missing content', async (found) => {
  mocks.load.mockResolvedValue(found);
  expect(
    (
      await GET(new Request('http://localhost/discussions/abc/image'), {
        params: { id: 'abc' },
      })
    ).status
  ).toBe(404);
});

it('distinguishes service unavailability from a missing discussion', async () => {
  mocks.load.mockResolvedValue({ state: 'unavailable' });
  expect(
    (
      await GET(new Request('http://localhost/discussions/abc/image'), {
        params: { id: 'abc' },
      })
    ).status
  ).toBe(503);
});
