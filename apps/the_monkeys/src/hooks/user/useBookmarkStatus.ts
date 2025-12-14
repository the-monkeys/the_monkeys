import {
  IsBookmarkedResponse,
  bookmarksCountResponse,
} from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BOOKMARK_STATUS_QUERY_KEY = 'bookmark-status';
export const BOOKMARKS_COUNT_QUERY_KEY = 'bookmarks-count';

export const useIsPostBookmarked = (blogId: string | undefined) => {
  const { data, isLoading, error, isError } = useQuery<
    IsBookmarkedResponse,
    Error
  >({
    queryKey: [BOOKMARK_STATUS_QUERY_KEY, blogId],
    queryFn: () => authFetcher(`/user/is-bookmarked/${blogId}`),
    enabled: !!blogId,
    staleTime: 60 * 1000,
  });

  return {
    bookmarkStatus: data,
    isLoading,
    isError: isError || !!error,
  };
};

export const useGetBookmarksCount = (blogId: string | undefined) => {
  const { data, isLoading, error, isError } = useQuery<
    bookmarksCountResponse,
    Error
  >({
    queryKey: [BOOKMARKS_COUNT_QUERY_KEY, blogId],
    queryFn: () => authFetcher(`/user/count-bookmarks/${blogId}`),
    enabled: !!blogId,
    staleTime: 60 * 1000,
  });

  return {
    bookmarks: data,
    bookmarkCountLoading: isLoading,
    bookmarkCountError: isError || !!error,
  };
};
