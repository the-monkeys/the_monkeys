import { loadPublicProfile } from '@/app/[username]/profileData';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'https://api.example.test',
}));

describe('public profile SEO loader', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('distinguishes a missing profile from an unavailable profile service', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(loadPublicProfile('ada')).resolves.toBeUndefined();

    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(loadPublicProfile('missing')).resolves.toBeNull();
  });
});
