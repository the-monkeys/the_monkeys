import { useEventDetail } from '@/hooks/events/useEventQueries';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { queryKeys } from '@/lib/queryKeys';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/events/eventsApi', () => ({
  getEvent: async () => ({
    event: {
      title: 'Workshop',
      meeting_link: 'https://meeting.example.test/local-confirmed',
    },
    viewer_rsvp_status: 'confirmed',
  }),
}));
vi.mock('@/services/groups/groupsApi', () => ({
  getGroup: async () => ({
    group: {
      name: 'Creators',
      viewer_role: 'organizer',
      viewer_member_status: 'active',
    },
  }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: undefined }),
}));
afterEach(cleanup);

function EventViewer() {
  const { data } = useEventDetail('workshop');
  return (
    <output>
      {data?.viewer_rsvp_status === 'confirmed'
        ? 'Confirmed meeting access'
        : 'Public event'}
    </output>
  );
}
function GroupViewer() {
  const { data } = useGroupDetail('creators');
  return (
    <output>
      {data?.group?.viewer_role === 'organizer'
        ? 'Manage group'
        : 'Public group'}
    </output>
  );
}

describe('viewer access after public first-paint data', () => {
  it('refreshes RSVP access immediately despite the global one-minute public cache default', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000, retry: false } },
    });
    client.setQueryData(queryKeys.events.detail('workshop'), {
      event: { title: 'Workshop' },
    });
    render(
      <QueryClientProvider client={client}>
        <EventViewer />
      </QueryClientProvider>
    );
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe(
        'Confirmed meeting access'
      )
    );
  });
  it('refreshes membership and management access immediately after public hydration', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000, retry: false } },
    });
    client.setQueryData(queryKeys.groups.detail('creators'), {
      group: { name: 'Creators', viewer_role: 'viewer' },
    });
    render(
      <QueryClientProvider client={client}>
        <GroupViewer />
      </QueryClientProvider>
    );
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe('Manage group')
    );
  });
});
