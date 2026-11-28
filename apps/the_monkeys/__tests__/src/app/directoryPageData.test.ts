import {
  directoryPageState,
  publicDirectoryEvents,
  publicDirectoryGroups,
} from '@/lib/directoryPageData';
import { queryKeys } from '@/lib/queryKeys';
import { QueryClient, hydrate } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({ API_URL: 'http://127.0.0.1:8081/api/v1' }));
const event = {
  id: 1,
  title: 'Public event',
  slug: 'public-event',
  status: 'published',
  visibility: 'public',
  event_type: 'virtual',
};
const group = {
  id: 2,
  name: 'Public group',
  slug: 'public-group',
  status: 'published',
  visibility: 'public',
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('anonymous directory data', () => {
  it('keeps published/live events, removes restricted states and malformed/duplicate entries', () => {
    const events = publicDirectoryEvents([
      event,
      { ...event, id: 3, slug: 'live', status: 'live' },
      event,
      ...['private', 'unlisted', 'group_members', undefined].map(
        (visibility) => ({ ...event, id: 4, visibility })
      ),
      ...['draft', 'cancelled', 'completed'].map((status) => ({
        ...event,
        id: 5,
        status,
      })),
      { ...event, id: 6, event_type: 'invalid' },
      { ...event, slug: '' },
      null,
      {},
    ]);
    expect(events.map((item) => item.slug)).toEqual(['public-event', 'live']);
  });

  it('preserves real card prices, times, series and location while excluding nested private fields', () => {
    const [item] = publicDirectoryEvents([
      {
        ...event,
        start_time: { seconds: '1900000000', nanos: 0 },
        meeting_link: 'protected-link',
        viewer_reactions: ['love'],
        secret: 'private',
        series_id: 42,
        recurrence_text: 'Every week',
        tags: ['tech'],
        upcoming_dates: ['2030-06-10T12:00:00Z'],
        venue: {
          name: 'Public venue',
          city: 'Pune',
          secret: 'private-venue-field',
        },
        ticket_tiers: [
          {
            id: 4,
            name: 'Ticket',
            price: 99,
            capacity: 20,
            currency: 'INR',
            secret: 'private-tier-field',
          },
        ],
      },
    ]);
    expect(item).toMatchObject({
      start_time: '2030-03-17T17:46:40.000Z',
      series_id: 42,
      recurrence_text: 'Every week',
      tags: ['tech'],
      venue: { name: 'Public venue', city: 'Pune' },
      ticket_tiers: [{ price: 99, currency: 'INR' }],
    });
    expect(JSON.stringify(item)).not.toMatch(
      /protected-link|viewer_reactions|secret|private/
    );
    expect(
      publicDirectoryEvents([
        {
          ...event,
          tags: {},
          ticket_tiers: [null, {}],
          start_time: { seconds: 'bad' },
        },
      ])[0]
    ).toMatchObject({ ticket_tiers: [] });
  });

  it('retains public published groups without viewer badges or arbitrary response fields', () => {
    const groups = publicDirectoryGroups([
      {
        ...group,
        viewer_role: 'organizer',
        viewer_member_status: 'active',
        secret: 'private',
      },
      group,
      null,
      {},
      { ...group, id: 3, visibility: 'private' },
      { ...group, id: 4, status: 'archived' },
      { ...group, id: 5, name: '' },
    ]);
    expect(groups).toEqual([group]);
  });

  it('seeds only the initial filter keys and lets a successful directory survive the other failing', async () => {
    const fetch = vi.fn(async (url: string) =>
      url.includes('/events?')
        ? new Response('unavailable', { status: 503 })
        : Response.json({ groups: [group] })
    );
    vi.stubGlobal('fetch', fetch);
    const state = await directoryPageState(true);
    const client = new QueryClient();
    hydrate(client, state);
    expect(
      client.getQueryData(queryKeys.groups.list({ limit: 30, offset: 0 }))
    ).toEqual({ groups: [group] });
    expect(client.getQueryData(queryKeys.groups.list({ limit: 8 }))).toEqual({
      groups: [group],
    });
    expect(
      client.getQueryData(queryKeys.groups.list({ limit: 30, offset: 30 }))
    ).toBeUndefined();
    expect(
      client.getQueryData(
        queryKeys.groups.list({ limit: 30, offset: 0, q: 'different' })
      )
    ).toBeUndefined();
    expect(
      client.getQueryData(
        queryKeys.events.list({ limit: 12, offset: 0, date: 'upcoming' })
      )
    ).toBeUndefined();
    expect(state.queries.every((query) => query.queryKey[1] === 'list')).toBe(
      true
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('distinguishes legitimate empty API lists from invalid responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ groups: null }))
    );
    expect((await directoryPageState()).queries[0].state.data).toEqual({
      groups: [],
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ groups: {}, error: 'Unavailable' }))
    );
    expect((await directoryPageState()).queries).toEqual([]);
  });

  it('aborts a slow public fetch and leaves the client query available to retry', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new Error('Aborted'))
          );
        })
    );
    vi.stubGlobal('fetch', fetch);
    const pending = directoryPageState();
    await vi.advanceTimersByTimeAsync(5000);
    expect((await pending).queries).toEqual([]);
    expect(fetch.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });
});
