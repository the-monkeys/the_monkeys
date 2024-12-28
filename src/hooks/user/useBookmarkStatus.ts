import {
  IsBookmarkedResponse,
  bookmarksCountResponse,
} from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

export const useIsPostBookmarked = (blogId: string | undefined) => {
  const { data, isLoading, error } = useSWR<IsBookmarkedResponse>(
    `/user/is-bookmarked/${blogId}`,
    authFetcher,
    {
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  return {
    bookmarkStatus: data,
    isLoading,
    isError: error,
  };
};

export const useGetBookmarksCount = (blogId: string | undefined) => {
  const { data, isLoading, error } = useSWR<bookmarksCountResponse>(
    `/user/count-bookmarks/${blogId}`,
    authFetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  return {
    bookmarks: data,
    bookmarkCountLoading: isLoading,
    bookmarkCountError: error,
  };
};
