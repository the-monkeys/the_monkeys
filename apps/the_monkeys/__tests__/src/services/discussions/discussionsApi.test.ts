import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import {
  createDiscussion,
  listDiscussions,
} from '@/services/discussions/discussionsApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api/axiosInstance', () => ({
  default: { post: vi.fn() },
}));

vi.mock('@/services/api/axiosInstanceNoAuth', () => ({
  default: { get: vi.fn() },
}));

describe('listDiscussions', () => {
  beforeEach(() => {
    vi.mocked(axiosInstanceNoAuth.get).mockReset();
  });

  it('loads the site feed with a cursor and never a group slug', async () => {
    vi.mocked(axiosInstanceNoAuth.get).mockResolvedValue({
      data: { discussions: [] },
    });
    await listDiscussions({ kind: 'site' }, 'abc');
    expect(axiosInstanceNoAuth.get).toHaveBeenCalledWith(
      '/discussions?before_id=abc'
    );
  });

  it('loads a group feed on the group path', async () => {
    vi.mocked(axiosInstanceNoAuth.get).mockResolvedValue({
      data: { discussions: [] },
    });
    await listDiscussions({ kind: 'group', slug: 'tea club' });
    expect(axiosInstanceNoAuth.get).toHaveBeenCalledWith(
      '/groups/tea%20club/discussions'
    );
  });
});

describe('createDiscussion', () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.post).mockReset();
  });

  it('posts the body and does not send files', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { public_id: 'p1' } });
    await createDiscussion({ kind: 'site' }, 'hello');
    expect(axiosInstance.post).toHaveBeenCalledWith('/discussions', { body: 'hello' });
  });
});
