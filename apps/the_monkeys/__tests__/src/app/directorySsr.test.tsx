// @vitest-environment node
import { type ReactNode, isValidElement } from 'react';

import EventsPage from '@/app/events/page';
import GroupsPage from '@/app/groups/page';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'http://127.0.0.1:8081/api/v1',
  LIVE_URL: 'http://127.0.0.1:3000',
  API_URL_V2: 'http://127.0.0.1:8081/api/v2',
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: undefined }),
}));
vi.mock('@/hooks/useIPLocation', () => ({
  useIPLocation: () => ({
    city: '',
    countryName: '',
    latitude: 0,
    longitude: 0,
    isLoading: true,
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/events',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/components/icon', () => ({ default: () => null }));
vi.mock('@/services/events/eventsApi', () => ({
  listEvents: vi.fn(),
  listUserEvents: vi.fn(),
  listAttendingEvents: vi.fn(),
}));
vi.mock('@/services/groups/groupsApi', () => ({
  listGroups: vi.fn(),
  listUserGroups: vi.fn(),
}));

const event = {
  id: 1,
  slug: 'public-workshop',
  title: 'Public workshop',
  status: 'published',
  visibility: 'public',
  event_type: 'virtual',
  start_time: '2030-06-01T12:00:00Z',
  meeting_link: 'secret-meeting-link',
  viewer_reactions: ['love'],
  private_extra: 'secret-event-field',
};
const group = {
  id: 2,
  slug: 'public-community',
  name: 'Public community',
  status: 'published',
  visibility: 'public',
  description: 'A public community for local makers.',
  viewer_role: 'organizer',
  viewer_member_status: 'active',
  private_extra: 'secret-group-field',
};

function render(node: ReactNode) {
  return renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>{node}</QueryClientProvider>
  );
}
function snapshots(node: ReactNode): unknown[] {
  if (Array.isArray(node)) return node.flatMap(snapshots);
  if (!isValidElement<{ children?: ReactNode; state?: unknown }>(node))
    return [];
  if (node.type === HydrationBoundary) return [node.props.state];
  return snapshots(node.props.children);
}
function schemas(html: string) {
  return Array.from(
    html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)
  ).flatMap((match) => {
    const data = JSON.parse(match[1]);
    return data['@graph'] || [data];
  });
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      Response.json(
        url.includes('/events?')
          ? {
              events: [
                event,
                { ...event, id: 3, slug: 'draft', status: 'draft' },
                { ...event, id: 4, slug: 'private', visibility: 'private' },
              ],
            }
          : {
              groups: [
                group,
                { ...group, id: 5, slug: 'hidden', visibility: 'unlisted' },
                { ...group, id: 6, slug: 'draft-group', status: 'draft' },
              ],
            }
      )
    )
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('directory HTML before browser effects', () => {
  it('renders real event and community card links while browser location is pending', async () => {
    const html = render(await EventsPage());
    expect(html).toContain('href="/events/public-workshop"');
    expect(html).toContain('href="/groups/public-community"');
    expect(html).not.toContain('href="/events/draft"');
    expect(html).not.toContain('href="/events/private"');
    expect(html).toContain('sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
  });

  it('renders public groups in the existing directory card layout', async () => {
    const html = render(await GroupsPage());
    expect(html).toContain('href="/groups/public-community"');
    expect(html).toContain('A public community for local makers.');
    expect(html).not.toContain('href="/groups/hidden"');
    expect(html).not.toContain('href="/groups/draft-group"');
    expect(html).not.toContain('Updating');
  });

  it('uses exactly the visible event FAQ questions and answers in JSON-LD', async () => {
    const html = render(await EventsPage());
    const faq = schemas(html).filter((item) => item['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    const visible = Array.from(
      html.matchAll(
        /<details[^>]*>\s*<summary[^>]*>(.*?)<\/summary>\s*<p[^>]*>(.*?)<\/p>/g
      )
    ).map((match) => ({
      question: match[1].replace(/<[^>]*>/g, ''),
      answer: match[2],
    }));
    expect(visible).toHaveLength(4);
    expect(
      faq[0].mainEntity.map(
        (item: { name: string; acceptedAnswer: { text: string } }) => ({
          question: item.name,
          answer: item.acceptedAnswer.text,
        })
      )
    ).toEqual(visible);
  });

  it('does not emit FAQ schema on groups where no FAQ is displayed', async () => {
    expect(
      schemas(render(await GroupsPage())).some(
        (item) => item['@type'] === 'FAQPage'
      )
    ).toBe(false);
  });

  it('omits credentials, disables shared response caching, and strips non-public hydration fields', async () => {
    const pages = [await EventsPage(), await GroupsPage()];
    expect(vi.mocked(fetch).mock.calls.length).toBeGreaterThan(0);
    for (const [url, init] of vi.mocked(fetch).mock.calls) {
      expect(String(url)).toMatch(
        /^http:\/\/127\.0\.0\.1:8081\/api\/v1\/(events|groups)\?/
      );
      expect(init).toMatchObject({ credentials: 'omit', cache: 'no-store' });
      expect(init?.headers).toBeUndefined();
    }
    const serialized = JSON.stringify(pages.flatMap(snapshots));
    expect(serialized).toContain('public-workshop');
    expect(serialized).toContain('public-community');
    for (const secret of [
      'secret-meeting-link',
      'secret-event-field',
      'secret-group-field',
      'viewer_role',
      'viewer_member_status',
      'viewer_reactions',
    ])
      expect(serialized).not.toContain(secret);
  });

  it('keeps both pages usable when the public API fails, with no fabricated item links', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Local API unavailable'))
    );
    for (const page of [EventsPage, GroupsPage]) {
      const html = render(await page());
      expect(html).not.toContain('href="/events/public-workshop"');
      expect(html).not.toContain('href="/groups/public-community"');
      expect(html).toContain('Search');
    }
  });
});
