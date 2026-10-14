import { loadGroupForMetadata } from '@/app/groups/[slug]/groupMetadata';
import GroupDetailPage, { generateMetadata } from '@/app/groups/[slug]/page';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockedCookies, mockedNotFound } = vi.hoisted(() => ({
  mockedCookies: vi.fn(),
  mockedNotFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/headers', () => ({
  cookies: mockedCookies,
}));

vi.mock('next/navigation', () => ({
  notFound: mockedNotFound,
}));

vi.mock('@/constants/api', () => ({
  API_URL: 'https://api.example.test',
  LIVE_URL: 'https://monkeys.example.test',
}));

vi.mock('@/app/groups/[slug]/GroupDetailClient', () => ({
  default: () => null,
}));

describe('group metadata', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    mockedCookies.mockReturnValue({
      get: vi.fn().mockReturnValue({ value: 'token' }),
    });
    mockedNotFound.mockClear();
  });

  it('uses the authenticated request to load private group metadata', async () => {
    vi.mocked(fetch).mockImplementation(async (_url, init) => {
      const authorized =
        (init?.headers as Record<string, string> | undefined)?.Authorization ===
        'Bearer token';

      return {
        ok: authorized,
        json: vi.fn().mockResolvedValue({
          group: {
            id: 1,
            name: 'Private builders',
            slug: 'private-builders',
            visibility: 'private',
            status: 'published',
          },
        }),
      } as unknown as Response;
    });

    const metadata = await generateMetadata({
      params: { slug: 'private-builders' },
    });

    expect(metadata.title).toBe('Private builders');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.test/groups/private-builders',
      {
        cache: 'no-store',
        headers: { Authorization: 'Bearer token' },
      }
    );
  });

  it('distinguishes temporary upstream failure from a confirmed missing group', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);
    await expect(
      loadGroupForMetadata('unstable-group')
    ).resolves.toBeUndefined();

    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);
    await expect(loadGroupForMetadata('missing-group')).resolves.toBeNull();
  });

  it('returns a real not-found response for a confirmed missing group', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);

    await expect(
      GroupDetailPage({ params: { slug: 'missing-group' } })
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockedNotFound).toHaveBeenCalledOnce();
  });
});
