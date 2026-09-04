import { loadEventForMetadata } from '@/app/events/[slug]/eventMetadata';
import EventDetailPage, { generateMetadata } from '@/app/events/[slug]/page';
import { renderToStaticMarkup } from 'react-dom/server';
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

vi.mock('@/app/events/[slug]/EventDetailClient', () => ({
  default: () => null,
}));

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

  it('omits the Authorization header when the mat cookie is absent', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ event: { title: 'Public event' } }),
    } as unknown as Response);

    await loadEventForMetadata('public-event');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.test/events/public-event',
      { cache: 'no-store' }
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

  it('keeps the Event not found metadata fallback for a non-OK lookup', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    const metadata = await generateMetadata({
      params: { slug: 'private-event' },
    });

    expect(metadata.title).toBe('Event not found');
  });

  it('escapes user-controlled closing script tags in event JSON-LD', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        event: {
          id: 1,
          title: 'Unsafe event',
          slug: 'unsafe-event',
          description: '</script><script>alert(1)</script>',
          event_type: 'in_person',
          status: 'published',
        },
      }),
    } as unknown as Response);

    const markup = renderToStaticMarkup(
      await EventDetailPage({ params: { slug: 'unsafe-event' } })
    );

    expect(markup).not.toContain('</script><script>alert(1)</script>');
    expect(markup).toContain(
      '\\u003c/script>\\u003cscript>alert(1)\\u003c/script>'
    );
  });
});
