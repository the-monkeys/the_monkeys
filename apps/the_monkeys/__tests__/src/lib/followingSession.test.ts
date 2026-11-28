import { loadFollowingSession } from '@/lib/followingSession';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({ API_URL: 'http://127.0.0.1:8081/api/v1' }));
afterEach(() => vi.unstubAllGlobals());

describe('following feed session', () => {
  it('rejects a missing session without a request', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(await loadFollowingSession('')).toEqual({ state: 'anonymous' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('validates the supplied session without caching it', async () => {
    const fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ username: 'dave', account_id: 'account-dave' }),
    });
    vi.stubGlobal('fetch', fetch);
    expect(await loadFollowingSession('mat=local-test')).toEqual({
      state: 'authenticated',
      viewer: { username: 'dave', accountId: 'account-dave' },
    });
    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8081/api/v1/auth/validate-session',
      { cache: 'no-store', headers: { Cookie: 'mat=local-test' } }
    );
  });

  it('rejects an expired session', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 401 }));
    expect(await loadFollowingSession('mat=expired')).toEqual({
      state: 'anonymous',
    });
  });

  it.each([503, 200])(
    'keeps unavailable or malformed session responses closed (%s)',
    async (status) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ status, json: async () => ({}) })
      );
      expect(await loadFollowingSession('mat=local-test')).toEqual({
        state: 'unavailable',
      });
    }
  );

  it('handles a network outage without admitting the viewer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await loadFollowingSession('mat=local-test')).toEqual({
      state: 'unavailable',
    });
  });
});
