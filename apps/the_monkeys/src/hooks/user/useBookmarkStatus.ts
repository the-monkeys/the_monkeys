import {
  IsBookmarkedResponse,
  bookmarksCountResponse,
} from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const useIsPostBookmarked = (blogId: string | undefined) => {
  const { data, isLoading, error } = useQuery<IsBookmarkedResponse>({
    queryKey: ['is-bookmarked', blogId],
    queryFn: () => authFetcher(`/user/is-bookmarked/${blogId}`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    bookmarkStatus: data,
    isLoading,
    isError: error,
  };
};

export const useGetBookmarksCount = (blogId: string | undefined) => {
  const { data, isLoading, error } = useQuery<bookmarksCountResponse>({
    queryKey: ['count-bookmarks', blogId],
    queryFn: () => authFetcher(`/user/count-bookmarks/${blogId}`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    bookmarks: data,
    bookmarkCountLoading: isLoading,
    bookmarkCountError: error,
  };
};
