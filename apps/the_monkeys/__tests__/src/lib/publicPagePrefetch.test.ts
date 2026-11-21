// @vitest-environment node
import { prefetchPublicPageMetadata } from '@/lib/publicPagePrefetch';
import { queryKeys } from '@/lib/queryKeys';
import { QueryClient, dehydrate, hydrate } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'http://127.0.0.1:8081/api/v1',
  API_URL_V2: 'http://127.0.0.1:8081/api/v2',
}));
afterEach(() => vi.unstubAllGlobals());
it('deduplicates public author reads, hydrates compatible keys and excludes private fields', async () => {
  const fetch = vi.fn(async (_url: string, _options?: RequestInit) =>
    Response.json({
      user: {
        account_id: 'author',
        username: 'writer',
        first_name: 'Writer',
        bio: 'Public bio',
        location: 'Public location',
        created_at: { seconds: 1 },
        is_verified: true,
        email: 'secret@example.test',
        contact_number: 'secret',
      },
      followers: 3,
      following: 2,
      private_extra: 'secret',
    })
  );
  vi.stubGlobal('fetch', fetch);
  const client = new QueryClient();
  await prefetchPublicPageMetadata(client, { authorIds: ['author', 'author'] });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toBe(
    'http://127.0.0.1:8081/api/v1/user/public/account/author'
  );
  expect(fetch.mock.calls[0][1]).toMatchObject({ credentials: 'omit' });
  const data = client.getQueryData(queryKeys.profile.byAccount('author'));
  expect(data).toMatchObject({
    user: { username: 'writer', bio: 'Public bio', is_verified: true },
    followers: 3,
  });
  expect(JSON.stringify(data)).not.toContain('secret');
});
it('prefetches only allowlisted active-user fields and survives author outages', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      url.includes('/active-users')
        ? Response.json({
            active_users: 1,
            user_details: [
              {
                account_id: 'author',
                username: 'writer',
                first_name: 'Writer',
                email: 'secret@example.test',
              },
            ],
            extra: 'secret',
          })
        : new Response('', { status: 503 })
    )
  );
  const client = new QueryClient();
  await expect(
    prefetchPublicPageMetadata(client, {
      authorIds: ['author'],
      activeUsers: true,
    })
  ).resolves.toBeUndefined();
  expect(
    client.getQueryData(queryKeys.profile.byAccount('author'))
  ).toBeUndefined();
  const data = client.getQueryData(queryKeys.profile.activeUsers('24h'));
  expect(data).toMatchObject({
    active_users: 1,
    user_details: [{ username: 'writer' }],
  });
  expect(JSON.stringify(data)).not.toContain('secret');
});

it('preserves camelCase active-user IDs for the existing consumer after hydration', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        active_users: 1,
        user_details: [
          {
            accountId: 'author',
            username: 'writer',
            email: 'secret@example.test',
          },
        ],
      })
    )
  );
  const serverClient = new QueryClient();
  const browserClient = new QueryClient();
  try {
    await prefetchPublicPageMetadata(serverClient, { activeUsers: true });
    hydrate(browserClient, dehydrate(serverClient));
    const data = browserClient.getQueryData<{
      user_details: Array<{ account_id?: string; accountId?: string }>;
    }>(queryKeys.profile.activeUsers('24h'));
    expect(data?.user_details).toHaveLength(1);
    // useActiveUsers accepts both spellings; normalization must not insert an
    // empty snake_case property that shadows a populated camelCase ID.
    const user = data!.user_details[0];
    expect(user.account_id ?? user.accountId).toBe('author');
    expect(JSON.stringify(data)).not.toContain('secret');
  } finally {
    serverClient.clear();
    browserClient.clear();
  }
});
