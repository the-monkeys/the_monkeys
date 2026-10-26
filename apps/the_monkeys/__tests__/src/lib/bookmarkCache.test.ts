import { BOOKMARKED_BLOGS_QUERY_KEY } from '@/hooks/blog/useGetBookmarkedBlogs';
import { optimisticallySetBookmark } from '@/lib/bookmarkCache';
import { queryKeys } from '@/lib/queryKeys';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

const blogPage = (ids: string[]): GetMetaFeedBlogs => ({
  blogs: ids.map((blog_id) => ({
    blog_id,
    title: blog_id,
    first_image: '',
    first_paragraph: '',
    owner_account_id: 'author',
    published_time: '',
    tags: [],
  })),
  total_blogs: ids.length,
});

describe('optimisticallySetBookmark', () => {
  it('optimistically updates bookmark status/count and removes the blog from cached pages', async () => {
    const queryClient = new QueryClient();
    const statusKey = queryKeys.blog.bookmarks.status('blog-1');
    const countKey = queryKeys.blog.bookmarks.count('blog-1');
    const listKey = [BOOKMARKED_BLOGS_QUERY_KEY, 10, 0] as const;
    queryClient.setQueryData(statusKey, {
      status: 'success',
      bookMarked: true,
    });
    queryClient.setQueryData(countKey, { count: 4 });
    queryClient.setQueryData(listKey, blogPage(['blog-1', 'blog-2']));

    const cacheUpdate = await optimisticallySetBookmark(
      queryClient,
      'blog-1',
      false
    );

    expect(queryClient.getQueryData(statusKey)).toEqual({
      status: 'success',
      bookMarked: false,
    });
    expect(queryClient.getQueryData(countKey)).toEqual({ count: 3 });
    expect(queryClient.getQueryData(listKey)).toEqual(blogPage(['blog-2']));

    cacheUpdate.rollback();

    expect(queryClient.getQueryData(statusKey)).toEqual({
      status: 'success',
      bookMarked: true,
    });
    expect(queryClient.getQueryData(countKey)).toEqual({ count: 4 });
    expect(queryClient.getQueryData(listKey)).toEqual(
      blogPage(['blog-1', 'blog-2'])
    );
    queryClient.clear();
  });

  it('updates add status/count optimistically but leaves list insertion to refetch', async () => {
    const queryClient = new QueryClient();
    const statusKey = queryKeys.blog.bookmarks.status('blog-1');
    const countKey = queryKeys.blog.bookmarks.count('blog-1');
    const listKey = [BOOKMARKED_BLOGS_QUERY_KEY, 10, 0] as const;
    queryClient.setQueryData(statusKey, {
      status: 'success',
      bookMarked: false,
    });
    queryClient.setQueryData(countKey, { count: 2 });
    queryClient.setQueryData(listKey, blogPage(['blog-2']));

    await optimisticallySetBookmark(queryClient, 'blog-1', true);

    expect(queryClient.getQueryData(statusKey)).toEqual({
      status: 'success',
      bookMarked: true,
    });
    expect(queryClient.getQueryData(countKey)).toEqual({ count: 3 });
    expect(queryClient.getQueryData(listKey)).toEqual(blogPage(['blog-2']));
    queryClient.clear();
  });
});
