import {
  IsBookmarkedResponse,
  bookmarksCountResponse,
} from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BOOKMARK_STATUS_QUERY_KEY = 'is-bookmarked';
export const BOOKMARKS_COUNT_QUERY_KEY = 'bookmarks-count';

export const useIsPostBookmarked = (blogId: string | undefined) => {
  const { data, isLoading, error, isError } = useQuery<
    IsBookmarkedResponse,
    Error
  >({
    queryKey: [BOOKMARK_STATUS_QUERY_KEY, blogId],
    queryFn: () => authFetcher(`/user/is-bookmarked/${blogId}`),
    staleTime: 60 * 1000,
    enabled: !!blogId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
    staleTime: 60 * 1000,
    enabled: !!blogId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    bookmarks: data,
    bookmarkCountLoading: isLoading,
    bookmarkCountError: isError || !!error,
  };
};
