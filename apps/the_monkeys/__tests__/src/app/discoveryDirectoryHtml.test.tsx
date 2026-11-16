// @vitest-environment node
import React from 'react';

import EventsPage from '@/app/events/page';
import GroupsPage from '@/app/groups/page';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const loaders = vi.hoisted(() => ({ events: vi.fn(), groups: vi.fn() }));
vi.mock('@/lib/publicDiscovery', () => ({
  loadDiscoveryEvents: loaders.events,
  loadDiscoveryGroups: loaders.groups,
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/events',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: null }) }));
vi.mock('@/hooks/useIPLocation', () => ({
  useIPLocation: () => ({
    city: '',
    country: '',
    countryName: '',
    latitude: 0,
    longitude: 0,
    isLoading: true,
    error: false,
  }),
}));
vi.mock('@/hooks/events/useEventQueries', () => ({
  useEventList: () => ({ data: undefined, isLoading: true }),
  useUserEvents: () => ({ data: undefined, isLoading: false }),
  useAttendingEvents: () => ({ data: undefined, isLoading: false }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupList: () => ({ data: undefined, isLoading: true }),
  useUserGroups: () => ({ data: undefined, isLoading: false }),
}));
vi.mock('@/components/events/EventGridCard', () => ({
  EventGridCard: ({ event }: { event: { slug: string; title: string } }) => (
    <a href={`/events/${event.slug}`}>{event.title}</a>
  ),
}));
vi.mock('@/components/groups/GroupGridCard', () => ({
  GroupGridCard: ({ group }: { group: { slug: string; name: string } }) => (
    <a href={`/groups/${group.slug}`}>{group.name}</a>
  ),
}));
vi.mock('@/components/events/discover/CommunityGroups', () => ({
  CommunityGroups: () => null,
}));

beforeEach(() => {
  loaders.events.mockResolvedValue([
    {
      id: 1,
      title: 'A public workshop',
      slug: 'workshop',
      event_type: 'virtual',
      status: 'published',
      visibility: 'public',
    },
  ]);
  loaders.groups.mockResolvedValue([
    {
      id: 1,
      name: 'Public writers',
      slug: 'writers',
      status: 'published',
      visibility: 'public',
    },
  ]);
});

describe('existing discovery directories before browser JavaScript', () => {
  it('renders event cards while location detection and the browser query are pending', async () => {
    const html = renderToStaticMarkup(await EventsPage());
    expect(html).toContain('href="/events/workshop"');
    expect(html).toContain('A public workshop');
    expect(html).not.toContain('Research events and meetups');
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('Upcoming events');
  });

  it('renders public groups in the existing directory without waiting for location', async () => {
    const html = renderToStaticMarkup(await GroupsPage());
    expect(html).toContain('href="/groups/writers"');
    expect(html).toContain('Public writers');
    expect(html).not.toContain('No groups yet');
  });
});
