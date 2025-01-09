import { IsLikedResponse, likesCountResponse } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

export const useIsPostLiked = (blogId: string | undefined) => {
  const { data, isLoading, error } = useSWR<IsLikedResponse>(
    `/user/is-liked/${blogId}`,
    authFetcher,
    {
      refreshInterval: 2000,
    }
  );

  return {
    likeStatus: data,
    isLoading,
    isError: error,
  };
};

export const useGetLikesCount = (blogId: string | undefined) => {
  const { data, isLoading, error } = useSWR<likesCountResponse>(
    `/user/count-likes/${blogId}`,
    authFetcher,
    {
      refreshInterval: 2000,
    }
  );

  return {
    likes: data,
    likeCountLoading: isLoading,
    likeCountError: error,
  };
};
