import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockedCookies } = vi.hoisted(() => ({
  mockedCookies: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mockedCookies,
}));

vi.mock('@/constants/api', () => ({
  API_URL: 'https://api.example.test',
  LIVE_URL: 'https://monkeys.example.test',
}));

import { loadEventForMetadata } from '@/app/events/[slug]/eventMetadata';
import { generateMetadata } from '@/app/events/[slug]/page';

describe('loadEventForMetadata', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    mockedCookies.mockReturnValue({ get: vi.fn().mockReturnValue(undefined) });
  });

  it('forwards the mat cookie without caching when loading an event for metadata', async () => {
    mockedCookies.mockReturnValue({
      get: vi.fn().mockReturnValue({ value: 'token' }),
    });
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ event: { title: 'Draft event' } }),
    } as unknown as Response);

    await loadEventForMetadata('draft-event');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/events/draft-event'),
      expect.objectContaining({
        cache: 'no-store',
        headers: { Authorization: 'Bearer token' },
      })
    );
  });

  it('uses a loaded draft event title for metadata', async () => {
    mockedCookies.mockReturnValue({
      get: vi.fn().mockReturnValue({ value: 'token' }),
    });
    vi.mocked(fetch).mockImplementation(async (_url, init) => {
      const authorized =
        (init?.headers as Record<string, string> | undefined)?.Authorization ===
        'Bearer token';

      return {
        ok: authorized,
        json: vi.fn().mockResolvedValue({
          event: {
            id: 1,
            title: 'Organizer draft',
            slug: 'draft-event',
            event_type: 'in_person',
            status: 'draft',
          },
        }),
      } as unknown as Response;
    });

    const metadata = await generateMetadata({
      params: { slug: 'draft-event' },
    });

    expect(metadata.title).toBe('Organizer draft');
  });
});
