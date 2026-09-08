import { generateMetadata } from '@/app/groups/[slug]/page';
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
});
