import { queryKeys } from '@/lib/queryKeys';
import {
  IsBookmarkedResponse,
  bookmarksCountResponse,
} from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const STALE_TIME = 60 * 1000;

export const useIsPostBookmarked = (
  blogId: string | undefined,
  initialIsBookmarked?: boolean
) => {
  const { data, isLoading, error, isError } = useQuery<
    IsBookmarkedResponse,
    Error
  >({
    queryKey: queryKeys.blog.bookmarks.status(blogId),
    queryFn: () => authFetcher(`/user/is-bookmarked/${blogId}`),
    initialData:
      initialIsBookmarked === undefined
        ? undefined
        : { status: 'success', bookMarked: initialIsBookmarked },
    staleTime: STALE_TIME,
    enabled: !!blogId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    bookmarkStatus: data,
    isLoading,
    isError,
    error,
  };
};

export const useGetBookmarksCount = (blogId: string | undefined) => {
  const { data, isLoading, error, isError } = useQuery<
    bookmarksCountResponse,
    Error
  >({
    queryKey: queryKeys.blog.bookmarks.count(blogId),
    queryFn: () => authFetcher(`/user/count-bookmarks/${blogId}`),
    staleTime: STALE_TIME,
    enabled: !!blogId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    bookmarks: data?.count ?? 0,
    bookmarkCountLoading: isLoading,
    bookmarkCountError: isError,
    error,
  };
};
