import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import fetcher from '@/services/fileFetcher';
import { fetchProfileImage } from '@/hooks/profile/useProfileImage';

vi.mock('@/services/fileFetcher', () => ({
  default: vi.fn(),
}));

const mockedFetcher = vi.mocked(fetcher);

describe('fetchProfileImage', () => {
  afterEach(() => vi.resetAllMocks());

  it('requests the stable profile URL without cache-busting parameters', async () => {
    const blob = new Blob(['avatar']);
    mockedFetcher.mockResolvedValue(blob);

    await expect(fetchProfileImage('monkey')).resolves.toBe(blob);
    expect(mockedFetcher).toHaveBeenCalledWith(
      '/storage/profiles/monkey/profile'
    );
  });

  it('caches a missing avatar as an empty result', async () => {
    mockedFetcher.mockRejectedValue(
      Object.assign(new Error('Not found'), {
        isAxiosError: true,
        response: { status: 404 },
      })
    );

    await expect(fetchProfileImage('monkey')).resolves.toBeNull();
  });

  it('propagates errors other than a missing avatar', async () => {
    const error = new axios.AxiosError('Service unavailable');
    Object.defineProperty(error, 'response', { value: { status: 503 } });
    mockedFetcher.mockRejectedValue(error);

    await expect(fetchProfileImage('monkey')).rejects.toBe(error);
  });
});
