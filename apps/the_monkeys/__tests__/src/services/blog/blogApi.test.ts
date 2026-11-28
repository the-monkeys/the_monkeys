import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import {
  getPublishedBlog,
  publishBlog,
  scheduleBlog,
} from '@/services/blog/blogApi';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api/axiosInstance', () => ({
  default: { post: vi.fn() },
}));
vi.mock('@/services/api/axiosInstanceV2', () => ({
  default: { post: vi.fn() },
}));
vi.mock('@/services/api/axiosInstanceNoAuthV2', () => ({
  default: { get: vi.fn() },
}));

const mockedV1Post = vi.mocked(axiosInstance.post);
const mockedV2Post = vi.mocked(axiosInstanceV2.post);
const mockedOptionalV2Get = vi.mocked(axiosInstanceNoAuthV2.get);

describe('blog publication API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('publishes with group scope on the existing v1 endpoint', async () => {
    mockedV1Post.mockResolvedValue({ data: { message: 'published' } });
    const body = {
      tags: ['tea'],
      slug: 'tea-notes',
      group_slug: 'tea-club',
      audience: 'group_only' as const,
    };

    await expect(publishBlog('post 1', body)).resolves.toEqual({
      message: 'published',
    });
    expect(mockedV1Post).toHaveBeenCalledWith('/blog/publish/post%201', body);
  });

  it('does not invent scope fields for a post without a group', async () => {
    mockedV1Post.mockResolvedValue({ data: { message: 'published' } });

    await publishBlog('post-1', { tags: ['tea'], slug: 'tea-notes' });

    expect(mockedV1Post).toHaveBeenCalledWith('/blog/publish/post-1', {
      tags: ['tea'],
      slug: 'tea-notes',
    });
  });

  it('schedules with the same scope on the existing v2 endpoint', async () => {
    mockedV2Post.mockResolvedValue({ data: { message: 'scheduled' } });
    const body = {
      tags: ['tea'],
      slug: 'tea-notes',
      schedule_time: '2026-09-20T10:00:00Z',
      timezone: 'Asia/Kolkata',
      group_slug: 'tea-club',
      audience: 'group_only' as const,
    };

    await expect(scheduleBlog('post-1', body)).resolves.toEqual({
      message: 'scheduled',
    });
    expect(mockedV2Post).toHaveBeenCalledWith(
      '/blog/post-1/schedule_blog',
      body
    );
  });

  it('reads the authoritative published post through optional auth', async () => {
    mockedOptionalV2Get.mockResolvedValue({
      data: { blog_id: 'post-1', audience: 'group_only' },
    });

    await expect(getPublishedBlog('post 1')).resolves.toMatchObject({
      blog_id: 'post-1',
      audience: 'group_only',
    });
    expect(mockedOptionalV2Get).toHaveBeenCalledWith('/blog/post%201');
  });
});
