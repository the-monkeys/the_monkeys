// @vitest-environment node
import LandingPage from '@/app/page';
import { useLandingCommunity } from '@/hooks/landing/useLandingCommunity';
import { listEvents } from '@/services/events/eventsApi';
import { fetcherV2 } from '@/services/fetcher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'http://127.0.0.1:8081/api/v1',
  LIVE_URL: 'http://127.0.0.1:3000',
}));
vi.mock('@/utils/get-query-client', () => ({
  getQueryClient: () => new QueryClient(),
}));
vi.mock('@/services/fetcher', () => ({
  fetcherV2: vi.fn(async () => ({
    blogs: [],
    has_more: false,
    homepage_policy_version: 'homepage-v1',
  })),
}));
vi.mock('@/services/events/eventsApi', () => ({
  listEvents: vi.fn(async () => ({ events: [] })),
}));
vi.mock('@/app/LandingPageClient', () => ({
  default: function MockLandingPageClient() {
    const { discussions, groups } = useLandingCommunity();
    return (
      <main>
        {discussions.data?.map((post) => (
          <a key={post.public_id} href={`/discussions/${post.public_id}`}>
            {post.body}
          </a>
        ))}
        {groups.data?.map((group) => (
          <a key={group.id} href={`/groups/${group.slug}`}>
            {group.name}
          </a>
        ))}
      </main>
    );
  },
}));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it('hydrates public community links into server HTML without cookies or browser fetching', async () => {
  const fetch = vi.fn(async (_url: string, _options?: RequestInit) =>
    Response.json({
      discussions: [
        {
          public_id: 'ssr-public',
          status: 'visible',
          body: 'Server-rendered public thought',
        },
        { public_id: 'hidden', status: 'hidden', body: 'Secret hidden text' },
      ],
      groups: [
        {
          id: 1,
          slug: 'ssr-group',
          name: 'Server-rendered group',
          status: 'published',
          visibility: 'public',
        },
      ],
    })
  );
  vi.stubGlobal('fetch', fetch);
  const html = renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      {await LandingPage()}
    </QueryClientProvider>
  );
  expect(html).toContain('href="/discussions/ssr-public"');
  expect(html).toContain('Server-rendered public thought');
  expect(html).toContain('href="/groups/ssr-group"');
  expect(html).not.toContain('Secret hidden text');
  expect(fetcherV2).toHaveBeenCalledWith(
    '/blog/homepage?limit=12&offset=0&sort=latest'
  );
  expect(fetcherV2).toHaveBeenCalledWith(
    '/blog/homepage?limit=12&offset=0&sort=trending'
  );
  expect(
    vi
      .mocked(fetcherV2)
      .mock.calls.every(([url]) => url.startsWith('/blog/homepage?'))
  ).toBe(true);
  expect(fetch.mock.calls).toHaveLength(2);
  expect(fetch.mock.calls[0][0]).toBe(
    'http://127.0.0.1:8081/api/v1/discussions'
  );
  expect(fetch.mock.calls[0][1]).toMatchObject({
    credentials: 'omit',
    cache: 'no-store',
  });
});

it('does not fail the landing page when a community endpoint is unavailable', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockRejectedValue(new Error('Local API outage'))
  );
  await expect(LandingPage()).resolves.toBeDefined();
});

it('does not serialize attendee-only meeting access in public event hydration', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ discussions: [], groups: [] }))
  );
  vi.mocked(listEvents).mockResolvedValueOnce({
    events: [
      {
        id: 11,
        title: 'Public workshop',
        slug: 'public-workshop',
        event_type: 'virtual',
        status: 'published',
        visibility: 'public',
        meeting_link: 'https://meeting.example.test/private-homepage-sentinel',
      },
    ],
    total: 1,
  });
  const page = await LandingPage();
  const serialized = JSON.stringify(page);
  expect(serialized).toContain('Public workshop');
  expect(serialized).not.toContain('private-homepage-sentinel');
});
