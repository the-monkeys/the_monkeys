import sitemap from '@/app/discussions/sitemap';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'http://api.test',
  API_URL_V2: 'http://api.test',
  LIVE_URL: 'https://monkeys.com.co',
  WSS_URL: '',
  WSS_URL_V2: '',
  FRN_URL: '',
}));

afterEach(() => vi.unstubAllGlobals());

it('publishes at most 200 public thread URLs including older cursor pages', async () => {
  let page = 0;
  const requests: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      requests.push(url);
      const prefix = page++;
      return new Response(
        JSON.stringify({
          discussions: Array.from({ length: 20 }, (_, i) => ({
            public_id: `p${prefix}-${i}`,
            body: 'Public thread',
            status: 'visible',
          })),
        })
      );
    })
  );
  const entries = await sitemap();
  expect(entries).toHaveLength(200);
  expect(entries.at(-1)?.url).toBe('https://monkeys.com.co/discussions/p9-19');
  expect(requests).toHaveLength(10);
  expect(requests[1]).toBe('http://api.test/discussions?before_id=p0-19');
  expect(new Set(entries.map((entry) => entry.url)).size).toBe(200);
});

it('keeps restricted and removed threads out of the sitemap', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async (url: string) =>
        new Response(
          JSON.stringify(
            url.includes('/groups?')
              ? { groups: [] }
              : {
                  discussions: [
                    { public_id: 'legacy', status: 'visible' },
                    {
                      public_id: 'members',
                      status: 'visible',
                      audience: 'group_only',
                    },
                    {
                      public_id: 'private',
                      status: 'visible',
                      audience: 'private',
                    },
                    { public_id: 'removed', status: 'removed' },
                  ],
                }
          )
        )
    )
  );
  expect((await sitemap()).map((entry) => entry.url)).toEqual([
    'https://monkeys.com.co/discussions/legacy',
  ]);
});
