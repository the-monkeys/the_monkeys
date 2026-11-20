import type { ReactNode } from 'react';

import EventsPageClient from '@/app/events/EventsPageClient';
import GroupsPageClient from '@/app/groups/GroupsPageClient';
import { queryKeys } from '@/lib/queryKeys';
import { listAttendingEvents, listEvents } from '@/services/events/eventsApi';
import { listGroups, listUserGroups } from '@/services/groups/groupsApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const control = vi.hoisted(() => ({
  location: {
    city: '',
    countryName: '',
    latitude: 0,
    longitude: 0,
    isLoading: true,
  },
  session: undefined as { username: string } | undefined,
  params: new URLSearchParams(),
  push: vi.fn(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: control.session }),
}));
vi.mock('@/hooks/useIPLocation', () => ({
  useIPLocation: () => control.location,
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: control.push }),
  usePathname: () => '/events',
  useSearchParams: () => control.params,
}));
vi.mock('@/constants/api', () => ({ LIVE_URL: 'http://127.0.0.1:3000' }));
vi.mock('@/components/icon', () => ({ default: () => null }));
vi.mock('@/services/events/eventsApi', () => ({
  listEvents: vi.fn(async () => ({
    events: [
      {
        id: 3,
        slug: 'matching-event',
        title: 'Matching event',
        visibility: 'public',
        status: 'published',
        event_type: 'virtual',
      },
    ],
  })),
  listUserEvents: vi.fn(async () => ({ events: [] })),
  listAttendingEvents: vi.fn(async () => ({ events: [] })),
}));
vi.mock('@/services/groups/groupsApi', () => ({
  listGroups: vi.fn(async () => ({
    groups: [
      {
        id: 4,
        slug: 'matching-group',
        name: 'Matching group',
        visibility: 'public',
        status: 'published',
      },
    ],
  })),
  listUserGroups: vi.fn(async () => ({
    groups: [
      {
        id: 5,
        slug: 'private-member-group',
        name: 'Private member group',
        visibility: 'private',
        status: 'published',
      },
    ],
  })),
}));
vi.mock('@/components/events/discover/CommunityGroups', () => ({
  CommunityGroups: () => <div>Group browser</div>,
}));

function client() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  qc.setQueryData(
    queryKeys.events.list({ limit: 12, offset: 0, date: 'upcoming' }),
    {
      events: [
        {
          id: 1,
          slug: 'ssr-event',
          title: 'SSR event',
          visibility: 'public',
          status: 'published',
          event_type: 'virtual',
        },
      ],
    }
  );
  const groups = [
    {
      id: 2,
      slug: 'ssr-group',
      name: 'SSR group',
      visibility: 'public',
      status: 'published',
    },
  ];
  qc.setQueryData(queryKeys.groups.list({ limit: 30, offset: 0 }), { groups });
  qc.setQueryData(queryKeys.groups.list({ limit: 8 }), { groups });
  return qc;
}
function view(node: ReactNode, qc: QueryClient) {
  return <QueryClientProvider client={qc}>{node}</QueryClientProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  control.location = {
    city: '',
    countryName: '',
    latitude: 0,
    longitude: 0,
    isLoading: true,
  };
  control.session = undefined;
  control.params = new URLSearchParams();
  vi.stubGlobal(
    'fetch',
    vi.fn(() => {
      throw new Error('Unexpected unmocked fetch');
    })
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('directory seeds and existing browser behavior', () => {
  it('keeps server event links until location is ready, then applies location and debounced search', async () => {
    const qc = client();
    const result = render(view(<EventsPageClient />, qc));
    expect(
      screen.getAllByRole('link', { name: 'SSR event' }).length
    ).toBeGreaterThan(0);
    expect(listEvents).not.toHaveBeenCalled();
    control.location = {
      city: 'Pune',
      countryName: 'India',
      latitude: 18.52,
      longitude: 73.85,
      isLoading: false,
    };
    result.rerender(view(<EventsPageClient />, qc));
    await waitFor(() =>
      expect(listEvents).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'Pune',
          user_lat: 18.52,
          user_lng: 73.85,
          radius: 25,
          limit: 12,
          offset: 0,
        })
      )
    );
    await screen.findAllByRole('link', { name: 'Matching event' });
    fireEvent.change(screen.getByPlaceholderText('Search events or topics'), {
      target: { value: 'workshop' },
    });
    await waitFor(() =>
      expect(listEvents).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'workshop', date: 'upcoming' })
      )
    );
    fireEvent.click(screen.getByRole('button', { name: 'Everywhere' }));
    await waitFor(() => {
      const filters = vi.mocked(listEvents).mock.calls.at(-1)?.[0];
      expect(filters?.q).toBe('workshop');
      expect(filters?.location).toBeUndefined();
      expect(filters?.user_lat).toBeUndefined();
      expect(filters?.radius).toBeUndefined();
    });
  });

  it('preserves group search, city, category, and anonymous login guard', async () => {
    const qc = client();
    render(view(<GroupsPageClient />, qc));
    expect(
      screen.getAllByRole('link', { name: 'SSR group' }).length
    ).toBeGreaterThan(0);
    expect(listGroups).not.toHaveBeenCalled();
    fireEvent.change(screen.getByPlaceholderText('Search groups'), {
      target: { value: 'makers' },
    });
    fireEvent.change(screen.getByPlaceholderText('City'), {
      target: { value: 'Pune' },
    });
    await waitFor(() =>
      expect(listGroups).toHaveBeenCalledWith(
        expect.objectContaining({
          q: 'makers',
          city: 'Pune',
          limit: 30,
          offset: 0,
        })
      )
    );
    await screen.findAllByRole('link', { name: 'Matching group' });
    fireEvent.click(screen.getByRole('button', { name: 'Networking' }));
    await waitFor(() =>
      expect(listGroups).toHaveBeenCalledWith(
        expect.objectContaining({ topics: ['networking'] })
      )
    );
    fireEvent.click(screen.getByRole('button', { name: 'Your groups' }));
    expect(control.push).toHaveBeenCalledWith('/auth/login');
    expect(listUserGroups).not.toHaveBeenCalled();
  });

  it('loads authenticated group membership with its own query instead of the public seed', async () => {
    control.session = { username: 'member' };
    render(view(<GroupsPageClient />, client()));
    fireEvent.click(screen.getByRole('button', { name: 'Your groups' }));
    await screen.findAllByRole('link', { name: 'Private member group' });
    expect(listUserGroups).toHaveBeenCalledWith(
      'member',
      expect.objectContaining({ limit: 30, offset: 0 })
    );
    expect(screen.queryByRole('link', { name: 'SSR group' })).toBeNull();
  });

  it('preserves event auth redirects and emits FAQ schema only while its FAQ is displayed', () => {
    const qc = client();
    const result = render(view(<EventsPageClient />, qc));
    expect(
      result.container.querySelectorAll('script[type="application/ld+json"]')
    ).toHaveLength(1);
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Going' }), {
      button: 0,
      ctrlKey: false,
    });
    expect(control.push).toHaveBeenCalledWith(
      expect.stringContaining('callbackURL=')
    );
    expect(listAttendingEvents).not.toHaveBeenCalled();
    control.params = new URLSearchParams('tab=groups');
    result.rerender(view(<EventsPageClient />, qc));
    expect(screen.getByText('Group browser')).toBeDefined();
    expect(
      result.container.querySelector('script[type="application/ld+json"]')
    ).toBeNull();
    expect(screen.queryByText('Community FAQ')).toBeNull();
  });
});
