import React from 'react';

import GroupsPageClient from '@/app/groups/GroupsPageClient';
import { EventsDiscover } from '@/components/events/discover/EventsDiscover';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  eventData: undefined as unknown,
  groupData: undefined as unknown,
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'local' } }),
}));
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
  useEventList: () => ({ data: state.eventData, isLoading: !state.eventData }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupList: () => ({ data: state.groupData, isLoading: !state.groupData }),
  useUserGroups: () => ({ data: undefined, isLoading: false }),
}));
vi.mock('@/components/events/EventGridCard', () => ({
  EventGridCard: ({ event }: { event: { title: string } }) => (
    <div>{event.title}</div>
  ),
}));
vi.mock('@/components/groups/GroupGridCard', () => ({
  GroupGridCard: ({ group }: { group: { name: string } }) => (
    <div>{group.name}</div>
  ),
}));
vi.mock('@/components/events/discover/CommunityGroups', () => ({
  CommunityGroups: () => null,
}));

const events = [
  {
    id: 1,
    slug: 'initial-event',
    title: 'Initial public event',
    event_type: 'virtual' as const,
    status: 'published' as const,
  },
];
const groups = [
  {
    id: 1,
    slug: 'initial-group',
    name: 'Initial public group',
    status: 'published' as const,
    visibility: 'public' as const,
  },
];

beforeEach(() => {
  state.eventData = undefined;
  state.groupData = undefined;
});
afterEach(cleanup);

describe('discovery initial snapshot respects browser controls', () => {
  it('removes the initial event snapshot as soon as a search is typed', () => {
    render(<EventsDiscover signedIn initialEvents={events} />);
    expect(screen.queryByText('Initial public event')).not.toBeNull();
    fireEvent.change(screen.getByPlaceholderText('Search events or topics'), {
      target: { value: 'different event' },
    });
    expect(screen.queryByText('Initial public event')).toBeNull();
  });

  it('does not replace a completed empty event response with the initial snapshot', () => {
    state.eventData = { events: [] };
    render(<EventsDiscover signedIn initialEvents={events} />);
    expect(screen.queryByText('Initial public event')).toBeNull();
  });

  it('removes the group snapshot when the city filter changes', () => {
    render(<GroupsPageClient initialGroups={groups} />);
    expect(screen.queryByText('Initial public group')).not.toBeNull();
    fireEvent.change(screen.getByPlaceholderText('City'), {
      target: { value: 'Bengaluru' },
    });
    expect(screen.queryByText('Initial public group')).toBeNull();
  });

  it('does not show public discovery as the viewer’s own groups', () => {
    render(<GroupsPageClient initialGroups={groups} />);
    fireEvent.click(screen.getByRole('button', { name: 'Your groups' }));
    expect(screen.queryByText('Initial public group')).toBeNull();
  });

  it('respects a completed empty group response', () => {
    state.groupData = { groups: [] };
    render(<GroupsPageClient initialGroups={groups} />);
    expect(screen.queryByText('Initial public group')).toBeNull();
  });
});
