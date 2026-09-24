import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import { listGroupBlogs } from '@/services/groups/groupsApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api/axiosInstanceNoAuth', () => ({
  default: { get: vi.fn() },
}));

describe('listGroupBlogs', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the optional-auth group endpoint with encoded slug and pagination', async () => {
    vi.mocked(axiosInstanceNoAuth.get).mockResolvedValue({
      data: { blogs: [] },
    });

    await expect(
      listGroupBlogs('tea club', { limit: 20, offset: 40 })
    ).resolves.toEqual({ blogs: [] });
    expect(axiosInstanceNoAuth.get).toHaveBeenCalledWith(
      '/groups/tea%20club/blogs',
      { params: { limit: 20, offset: 40 } }
    );
  });
});
