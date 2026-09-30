import { notFound } from 'next/navigation';

import { loadBlogForViewer } from '@/app/blog/[slug]/blogData';
import BlogPage from '@/app/blog/[slug]/page';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { blogClientMock } = vi.hoisted(() => ({
  blogClientMock: vi.fn(() => null),
}));

vi.mock('@/app/blog/[slug]/blogData', () => ({
  loadBlogForViewer: vi.fn(),
  loadPublicBlogForSeo: vi.fn(),
  loadPublicAuthorForSeo: vi.fn(),
}));
vi.mock('@/app/blog/[slug]/BlogPageClient', () => ({
  default: blogClientMock,
}));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
vi.mock('@/utils/get-query-client', () => ({
  getQueryClient: () => ({
    setQueryData: vi.fn(),
  }),
}));

describe('BlogPage viewer privacy', () => {
  beforeEach(() => vi.clearAllMocks());

  it('invokes notFound before rendering the client for a denied article', async () => {
    vi.mocked(loadBlogForViewer).mockResolvedValue(null);

    await expect(
      BlogPage({ params: { slug: 'hidden-post-123' } })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFound).toHaveBeenCalledOnce();
    expect(blogClientMock).not.toHaveBeenCalled();
  });
});
