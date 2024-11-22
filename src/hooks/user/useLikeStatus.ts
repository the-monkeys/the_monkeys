import { IsLikedResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

export const useIsPostLiked = (blogId: string | undefined) => {
  const { data, isLoading, error } = useSWR<IsLikedResponse>(
    `/user/is-liked/${blogId}`,
    authFetcher
  );

  return {
    likeStatus: data,
    isLoading,
    isError: error,
  };
};
