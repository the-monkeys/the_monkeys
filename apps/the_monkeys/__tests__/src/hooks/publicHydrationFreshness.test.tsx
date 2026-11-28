import { useEventDetail } from '@/hooks/events/useEventQueries';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { queryKeys } from '@/lib/queryKeys';
import { validateSession } from '@/services/auth/auth';
import { getEvent } from '@/services/events/eventsApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/events/eventsApi', () => ({
  getEvent: vi.fn(async () => ({
    event: {
      title: 'Workshop',
      meeting_link: 'https://meeting.example.test/local-confirmed',
    },
    viewer_rsvp_status: 'confirmed',
  })),
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
vi.mock('@/services/auth/auth', () => ({ validateSession: vi.fn() }));
const clients: QueryClient[] = [];
const session = {
  account_id: 'viewer-id',
  username: 'viewer',
  email: 'viewer@example.test',
};
function setup(authenticated = true) {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: false } },
  });
  clients.push(client);
  client.setQueryDefaults(queryKeys.auth.session(), { staleTime: Infinity });
  if (authenticated) client.setQueryData(queryKeys.auth.session(), session);
  return client;
}
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
  vi.clearAllMocks();
});

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
    const client = setup();
    client.setQueryData(queryKeys.events.detail('workshop'), {
      event: { title: 'Workshop' },
    });
    render(
      <QueryClientProvider client={client}>
        <EventViewer />
      </QueryClientProvider>
    );
    expect(screen.getByRole('status').textContent).toBe('Public event');
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe(
        'Confirmed meeting access'
      )
    );
  });
  it('refreshes membership and management access immediately after public hydration', async () => {
    const client = setup();
    client.setQueryData(queryKeys.groups.detail('creators'), {
      group: { name: 'Creators', viewer_role: 'viewer' },
    });
    render(
      <QueryClientProvider client={client}>
        <GroupViewer />
      </QueryClientProvider>
    );
    expect(screen.getByRole('status').textContent).toBe('Public group');
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe('Manage group')
    );
  });
});

it('retains public first paint and waits for real pending authentication before the privileged recheck', async () => {
  const client = setup(false);
  client.setQueryData(queryKeys.events.detail('workshop'), {
    event: { title: 'Workshop' },
  });
  let resolve!: (value: typeof session) => void;
  vi.mocked(validateSession).mockReturnValue(
    new Promise((done) => {
      resolve = done;
    })
  );
  render(
    <QueryClientProvider client={client}>
      <EventViewer />
    </QueryClientProvider>
  );
  expect(screen.getByRole('status').textContent).toBe('Public event');
  expect(getEvent).not.toHaveBeenCalled();
  await act(async () => {
    resolve(session);
  });
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe(
      'Confirmed meeting access'
    )
  );
  expect(client.getQueryData(queryKeys.events.detail('workshop'))).toEqual({
    event: { title: 'Workshop' },
  });
  expect(
    client.getQueryData(queryKeys.events.detail('workshop', session.account_id))
  ).toMatchObject({ viewer_rsvp_status: 'confirmed' });
});
