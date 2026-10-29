import type { ReactNode } from 'react';

import { useGroupBlogs } from '@/hooks/groups/useGroupQueries';
import { queryKeys } from '@/lib/queryKeys';
import type { GroupItem } from '@/services/groups/groupsTypes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  session: { account_id: 'ada-id', username: 'ada' } as {
    account_id: string;
    username: string;
  } | null,
  pending: false,
  list: vi.fn(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: state.session, isPending: state.pending }),
}));
vi.mock('@/services/groups/groupsApi', () => ({
  listGroupBlogs: (...args: any[]) => state.list(...args),
}));
const group = {
  visibility: 'public',
  status: 'published',
  viewer_member_status: 'active',
} as const;
type AccessScope = Pick<
  GroupItem,
  'visibility' | 'status' | 'viewer_member_status'
>;
const privatePage = {
  blogs: [
    { blog_id: 'secret', title: 'Secret preview', audience: 'group_only' },
  ],
};
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

describe('useGroupBlogs viewer isolation', () => {
  beforeEach(() => {
    state.session = { account_id: 'ada-id', username: 'ada' };
    state.pending = false;
    state.list
      .mockReset()
      .mockResolvedValueOnce(privatePage)
      .mockRejectedValue(new Error('offline'));
  });
  afterEach(cleanup);

  it.each([
    'logout',
    'different viewer',
    'membership loss',
    'visibility change',
  ])(
    'does not reuse restricted cached pages after %s when the new read fails',
    async (change) => {
      const { wrapper } = setup();
      const view = renderHook(
        ({ scope }) => useGroupBlogs('writers', 20, true, scope),
        { wrapper, initialProps: { scope: { ...group } as AccessScope } }
      );
      await waitFor(() =>
        expect(view.result.current.data?.pages[0]).toEqual(privatePage)
      );
      const scope: AccessScope = { ...group };
      if (change === 'logout') state.session = null;
      if (change === 'different viewer')
        state.session = { account_id: 'bob-id', username: 'bob' };
      if (change === 'membership loss') scope.viewer_member_status = 'left';
      if (change === 'visibility change') scope.visibility = 'private';
      view.rerender({ scope });
      expect(view.result.current.data).toBeUndefined();
      await waitFor(() => expect(view.result.current.isError).toBe(true));
      expect(view.result.current.data).toBeUndefined();
      expect(state.list).toHaveBeenCalledTimes(2);
    }
  );

  it('waits for viewer authentication to resolve before reading the group feed', async () => {
    state.pending = true;
    const { wrapper } = setup();
    const view = renderHook(() => useGroupBlogs('writers', 20, true, group), {
      wrapper,
    });
    expect(state.list).not.toHaveBeenCalled();
    state.pending = false;
    view.rerender();
    await waitFor(() => expect(view.result.current.isSuccess).toBe(true));
  });

  it('retains existing group-blog prefix invalidation for scoped caches', async () => {
    const { client, wrapper } = setup();
    const view = renderHook(() => useGroupBlogs('writers', 20, true, group), {
      wrapper,
    });
    await waitFor(() =>
      expect(view.result.current.data?.pages[0]).toEqual(privatePage)
    );
    state.list.mockResolvedValue({ blogs: [] });
    await act(async () => {
      await client.invalidateQueries({
        queryKey: queryKeys.groups.blogs('writers'),
      });
    });
    await waitFor(() =>
      expect(view.result.current.data?.pages[0].blogs).toEqual([])
    );
    expect(state.list).toHaveBeenCalledTimes(2);
  });
});
