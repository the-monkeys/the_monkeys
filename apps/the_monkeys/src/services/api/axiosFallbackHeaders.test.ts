import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/requestHeaders', () => ({
  getAllRequestHeaders: vi.fn().mockRejectedValue(new Error('metadata failed')),
}));

describe('Axios metadata fallback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('continues without a browser-supplied IP when metadata fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { default: api } = await import('./axiosInstanceNoAuth');

    const response = await api.get('/health', {
      adapter: async (config) => ({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }),
    });

    expect(response.status).toBe(200);
    expect(response.config.headers.get('X-IP')).toBeUndefined();
    expect(response.config.headers.get('X-Real-IP')).toBeUndefined();
  });
});
