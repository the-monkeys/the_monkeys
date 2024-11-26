import { IsBookmarkedResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

export const useIsPostBookmarked = (blogId: string | undefined) => {
  const { data, isLoading, error } = useSWR<IsBookmarkedResponse>(
    `/user/is-bookmarked/${blogId}`,
    authFetcher
  );

  return {
    bookmarkStatus: data,
    isLoading,
    isError: error,
  };
};
