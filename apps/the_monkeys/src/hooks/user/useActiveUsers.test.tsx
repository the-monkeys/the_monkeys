import type { PropsWithChildren } from 'react';

import { queryKeys } from '@/lib/queryKeys';
import { shouldRetryQuery } from '@/lib/queryPolicy';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import useActiveUsers from './useActiveUsers';

vi.mock('@/services/api/axiosInstanceV2', () => ({
  default: { get: vi.fn() },
}));
const clients: QueryClient[] = [];
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
  vi.resetAllMocks();
});
const setup = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: shouldRetryQuery, retryDelay: 0 } },
  });
  clients.push(client);
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
};
it.each([401, 403, 404])(
  'uses the default policy to avoid retries for HTTP %s',
  async (status) => {
    const { wrapper } = setup();
    vi.mocked(axiosInstanceV2.get).mockRejectedValue({
      isAxiosError: true,
      response: { status },
    });
    const { result } = renderHook(() => useActiveUsers(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(axiosInstanceV2.get).toHaveBeenCalledTimes(1);
  }
);
it('uses the bounded transient retries and retains the existing return shape', async () => {
  const { wrapper } = setup();
  vi.mocked(axiosInstanceV2.get)
    .mockRejectedValueOnce({ isAxiosError: true, response: { status: 503 } })
    .mockRejectedValueOnce({ isAxiosError: true, response: { status: 503 } })
    .mockResolvedValueOnce({
      data: {
        active_users: 1,
        user_details: [{ account_id: 'a', username: 'alice' }],
      },
    });
  const { result } = renderHook(() => useActiveUsers(), { wrapper });
  await waitFor(() => expect(result.current.users).toEqual([{ userID: 'a' }]));
  expect(axiosInstanceV2.get).toHaveBeenCalledTimes(3);
  expect(result.current.activeCount).toBe(1);
});
it('reuses the public SSR key without an immediate duplicate request', () => {
  const { client, wrapper } = setup();
  client.setQueryData(queryKeys.profile.activeUsers('24h'), {
    active_users: 1,
    user_details: [{ accountId: 'a' }],
  });
  const { result } = renderHook(() => useActiveUsers(), { wrapper });
  expect(result.current.users).toEqual([{ userID: 'a' }]);
  expect(axiosInstanceV2.get).not.toHaveBeenCalled();
});
