import type { PropsWithChildren } from 'react';

import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { updateGroup } from '@/services/groups/groupsApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { useUpdateGroup } from './useGroupQueries';

vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'author' } }),
}));
vi.mock('@/services/groups/groupsApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/groups/groupsApi')>()),
  updateGroup: vi.fn(),
}));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
it.each([true, false])(
  'refreshes homepage articles when enclosing group visibility changes successfully (success=%s)',
  async (success) => {
    const qc = new QueryClient();
    const key = homepageBlogQuery().queryKey;
    qc.setQueryData(key, { blogs: [] });
    qc.setQueryData(['meta-feed-blogs', 12], { blogs: ['ordinary'] });
    if (success) vi.mocked(updateGroup).mockResolvedValue({} as any);
    else vi.mocked(updateGroup).mockRejectedValue(new Error('Write failed'));
    const Wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useUpdateGroup('writers'), {
      wrapper: Wrapper,
    });
    act(() => result.current.mutate({ visibility: 'private' } as any));
    await waitFor(() =>
      expect(result.current.isSuccess || result.current.isError).toBe(true)
    );
    expect(qc.getQueryState(key)?.isInvalidated).toBe(success);
    expect(qc.getQueryState(['meta-feed-blogs', 12])?.isInvalidated).toBe(
      false
    );
  }
);
