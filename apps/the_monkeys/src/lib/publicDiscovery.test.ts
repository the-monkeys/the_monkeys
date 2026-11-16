import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadDiscoveryEvents, loadDiscoveryGroups } from './publicDiscovery';

vi.mock('@/constants/api', () => ({
  API_URL: 'http://127.0.0.1:4999/api/v1',
  API_URL_V2: 'http://127.0.0.1:4999/api/v2',
}));

afterEach(() => vi.unstubAllGlobals());

describe('anonymous discovery snapshots', () => {
  it('loads one bounded upcoming page and strips restricted event fields', async () => {
    const event = {
      id: 1,
      slug: 'public-event',
      title: 'A public event',
      status: 'published',
      visibility: 'public',
      event_type: 'virtual',
      start_time: '2099-01-01T10:00:00Z',
      meeting_link: 'https://private.invalid/meeting',
      viewer_rsvp: { email: 'private@example.invalid' },
      venue: { city: 'Bengaluru', internal_note: 'secret' },
    };
    const fetcher = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          events: [
            event,
            { ...event, id: 2, slug: 'draft', status: 'draft' },
            { ...event, id: 3, slug: 'private', visibility: 'private' },
            null,
            { id: 4, status: 'published', visibility: 'public' },
          ],
        }),
      });
    vi.stubGlobal('fetch', fetcher);
    const rows = await loadDiscoveryEvents();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      title: 'A public event',
      slug: 'public-event',
      venue: { city: 'Bengaluru' },
    });
    expect(JSON.stringify(rows)).not.toMatch(
      /private\.invalid|private@example|internal_note|viewer_rsvp/
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toMatch(/^http:\/\/127\.0\.0\.1:4999\/api\/v1\/events\?/);
    expect(url).toContain('limit=12');
    expect(url).toContain('date=upcoming');
    expect(options.headers).not.toHaveProperty('Cookie');
  });

  it('returns only published public groups without membership or invitation data', async () => {
    const group = {
      id: 1,
      slug: 'writers',
      name: 'Writers',
      status: 'published',
      visibility: 'public',
      viewer_role: 'organizer',
      invite_token: 'do-not-serialize',
      topics: ['Writing'],
    };
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({
            groups: [
              group,
              { ...group, id: 2, visibility: 'unlisted' },
              { ...group, id: 3, visibility: 'private' },
              { ...group, id: 4, status: 'draft' },
            ],
          }),
        })
    );
    const rows = await loadDiscoveryGroups();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: 'Writers', topics: ['Writing'] });
    expect(JSON.stringify(rows)).not.toMatch(
      /viewer_role|invite_token|do-not-serialize/
    );
  });

  it('isolates malformed payloads and temporary API failures from page rendering', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ groups: 'bad' }),
      })
      .mockRejectedValueOnce(new Error('offline'));
    vi.stubGlobal('fetch', fetcher);
    await expect(loadDiscoveryEvents()).resolves.toEqual([]);
    await expect(loadDiscoveryGroups()).resolves.toEqual([]);
    await expect(loadDiscoveryEvents()).resolves.toEqual([]);
  });

  it('bounds valid results and removes unexpected nested fields in legacy protobuf times', async () => {
    const future = {
      seconds: '4070908800',
      nanos: 0,
      private_token: 'must-not-escape',
    };
    const rows = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      slug: `event-${i}`,
      title: `Event ${i}`,
      status: 'published',
      visibility: 'public',
      event_type: 'virtual',
      start_time: future,
      upcoming_dates: [future],
      description: { invalid: true },
    }));
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ events: rows }) })
    );
    const found = await loadDiscoveryEvents();
    expect(found).toHaveLength(12);
    expect(found[0].start_time).toEqual({ seconds: '4070908800', nanos: 0 });
    expect(found[0].description).toBeUndefined();
    expect(JSON.stringify(found)).not.toContain('must-not-escape');
  });

  it('normalizes invalid timestamps before the existing date cards render them', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({
            events: [
              {
                id: 1,
                slug: 'time-pending',
                title: 'Time pending',
                status: 'published',
                visibility: 'public',
                event_type: 'virtual',
                start_time: { seconds: '1e100' },
                end_time: 'invalid date',
              },
            ],
          }),
        })
    );
    const [event] = await loadDiscoveryEvents();
    expect(event.start_time).toBeUndefined();
    expect(event.end_time).toBeUndefined();
  });
});
