import { BOOKMARKED_BLOGS_QUERY_KEY } from '@/hooks/blog/useGetBookmarkedBlogs';
import { queryKeys } from '@/lib/queryKeys';
import {
  GetMetaFeedBlogs,
  IsBookmarkedResponse,
  bookmarksCountResponse,
} from '@/services/blog/blogTypes';
import { QueryClient } from '@tanstack/react-query';

type BookmarkCacheSnapshot = {
  status: IsBookmarkedResponse | undefined;
  count: bookmarksCountResponse | undefined;
  lists: Array<[readonly unknown[], GetMetaFeedBlogs | undefined]>;
};

export async function optimisticallySetBookmark(
  queryClient: QueryClient,
  blogId: string,
  isBookmarked: boolean
) {
  const statusKey = queryKeys.blog.bookmarks.status(blogId);
  const countKey = queryKeys.blog.bookmarks.count(blogId);
  const listKey = [BOOKMARKED_BLOGS_QUERY_KEY] as const;

  await Promise.all([
    queryClient.cancelQueries({ queryKey: statusKey, exact: true }),
    queryClient.cancelQueries({ queryKey: countKey, exact: true }),
    queryClient.cancelQueries({ queryKey: listKey }),
  ]);

  const snapshot: BookmarkCacheSnapshot = {
    status: queryClient.getQueryData(statusKey),
    count: queryClient.getQueryData(countKey),
    lists: queryClient.getQueriesData<GetMetaFeedBlogs>({
      queryKey: listKey,
    }),
  };

  queryClient.setQueryData<IsBookmarkedResponse>(statusKey, {
    status: 'success',
    bookMarked: isBookmarked,
  });

  if (snapshot.count) {
    queryClient.setQueryData<bookmarksCountResponse>(countKey, {
      count: Math.max(0, snapshot.count.count + (isBookmarked ? 1 : -1)),
    });
  }

  if (!isBookmarked) {
    for (const [queryKey, page] of snapshot.lists) {
      if (!page) continue;
      const blogs = page.blogs.filter((blog) => blog.blog_id !== blogId);
      if (blogs.length === page.blogs.length) continue;

      queryClient.setQueryData<GetMetaFeedBlogs>(queryKey, {
        ...page,
        blogs,
        total_blogs:
          page.total_blogs === undefined
            ? undefined
            : Math.max(0, page.total_blogs - 1),
      });
    }
  }

  return {
    rollback() {
      if (snapshot.status === undefined) {
        queryClient.removeQueries({ queryKey: statusKey, exact: true });
      } else {
        queryClient.setQueryData(statusKey, snapshot.status);
      }

      if (snapshot.count === undefined) {
        queryClient.removeQueries({ queryKey: countKey, exact: true });
      } else {
        queryClient.setQueryData(countKey, snapshot.count);
      }

      for (const [queryKey, page] of snapshot.lists) {
        if (page === undefined) {
          queryClient.removeQueries({ queryKey, exact: true });
        } else {
          queryClient.setQueryData(queryKey, page);
        }
      }
    },
  };
}
