import { EventManage } from '@/components/events/EventManage';
import { queryKeys } from '@/lib/queryKeys';
import { Attendee, EventItem } from '@/services/events/eventTypes';
import { listAttendees, listCoupons } from '@/services/events/eventsApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));
vi.mock('@/services/events/eventsApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/events/eventsApi')>()),
  listAttendees: vi.fn(),
  listCoupons: vi.fn(),
}));

const event: EventItem = {
  id: 1,
  slug: 'large-local-event',
  title: 'Large local event',
  status: 'published',
  event_type: 'virtual',
};
let roster: Attendee[];
let client: QueryClient;

beforeEach(() => {
  roster = Array.from({ length: 1005 }, (_, i) => ({
    id: i + 1,
    user_name: `person${i + 1}`,
    user_email: `person${i + 1}@example.test`,
    status: 'confirmed',
  }));
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  vi.mocked(listCoupons).mockResolvedValue({ coupons: [] });
  vi.mocked(listAttendees).mockImplementation(async (_slug, params) => ({
    attendees: roster.slice(
      params?.offset ?? 0,
      (params?.offset ?? 0) + (params?.limit ?? 200)
    ),
    total: roster.length,
  }));
});
afterEach(() => {
  cleanup();
  client.clear();
  vi.clearAllMocks();
});

function renderManage(currentEvent = event) {
  return render(
    <QueryClientProvider client={client}>
      <EventManage event={currentEvent} />
    </QueryClientProvider>
  );
}
function next() {
  fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
}

describe('Manage attendee pagination', () => {
  it('loads 50 at a time, can reach beyond 200, and can return to the previous page', async () => {
    renderManage();
    await screen.findByText('Showing 1 to 50 of 1,005');
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      51
    );
    expect(screen.getByText('@person1')).toBeTruthy();
    expect(screen.queryByText('@person51')).toBeNull();
    expect(
      screen
        .getByRole('button', { name: 'Previous page' })
        .hasAttribute('disabled')
    ).toBe(true);
    for (let page = 1; page <= 4; page++) {
      next();
      await screen.findByText(
        `Showing ${page * 50 + 1} to ${(page + 1) * 50} of 1,005`
      );
    }
    expect(screen.getByText('@person201')).toBeTruthy();
    expect(listAttendees).toHaveBeenLastCalledWith(event.slug, {
      limit: 50,
      offset: 200,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    await screen.findByText('Showing 151 to 200 of 1,005');
    expect(screen.getByText('@person151')).toBeTruthy();
  });

  it('stops on the final partial page without dropping the last attendees', async () => {
    roster = roster.slice(0, 55);
    renderManage();
    await screen.findByText('Showing 1 to 50 of 55');
    next();
    await screen.findByText('Showing 51 to 55 of 55');
    expect(screen.getByText('@person55')).toBeTruthy();
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      6
    );
    expect(
      screen.getByRole('button', { name: 'Next page' }).hasAttribute('disabled')
    ).toBe(true);
  });

  it('offers a retry for a failed page instead of showing an old page as new data', async () => {
    renderManage();
    await screen.findByText('Showing 1 to 50 of 1,005');
    vi.mocked(listAttendees).mockRejectedValueOnce(
      new Error('Temporary local test failure')
    );
    next();
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      expect.stringContaining('Could not load attendees')
    );
    expect(screen.queryByText('@person1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry attendees' }));
    await screen.findByText('Showing 51 to 100 of 1,005');
  });

  it('keeps preview and roster pages separate while allowing prefix invalidation', async () => {
    // Seed exactly the key used by the compact confirmed-attendee preview.
    client.setQueryData(
      [
        ...queryKeys.events.attendees(event.slug),
        { limit: 18, offset: 0, status: 'confirmed' },
      ],
      {
        attendees: roster.slice(0, 18),
        total: 1005,
      }
    );
    renderManage();
    await screen.findByText('Showing 1 to 50 of 1,005');
    next();
    await screen.findByText('Showing 51 to 100 of 1,005');
    await client.invalidateQueries({
      queryKey: queryKeys.events.attendees(event.slug),
      refetchType: 'none',
    });
    const pages = client
      .getQueryCache()
      .findAll({ queryKey: queryKeys.events.attendees(event.slug) });
    expect(pages).toHaveLength(3);
    expect(pages.every((page) => page.state.isInvalidated)).toBe(true);
  });

  it('resets the page when navigating to another event', async () => {
    const view = renderManage();
    await screen.findByText('Showing 1 to 50 of 1,005');
    next();
    await screen.findByText('Showing 51 to 100 of 1,005');
    view.rerender(
      <QueryClientProvider client={client}>
        <EventManage event={{ ...event, slug: 'other-event' }} />
      </QueryClientProvider>
    );
    await screen.findByText('Showing 1 to 50 of 1,005');
    expect(listAttendees).toHaveBeenLastCalledWith('other-event', {
      limit: 50,
      offset: 0,
    });
  });

  it('returns to a valid page if the roster shrinks after a refresh', async () => {
    roster = roster.slice(0, 55);
    renderManage();
    await screen.findByText('Showing 1 to 50 of 55');
    next();
    await screen.findByText('Showing 51 to 55 of 55');
    roster = roster.slice(0, 12);
    await client.invalidateQueries({
      queryKey: queryKeys.events.attendees(event.slug),
    });
    await screen.findByText('Showing 1 to 12 of 12');
    expect(screen.getByText('@person12')).toBeTruthy();
  });
});
