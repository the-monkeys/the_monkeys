import { IsLikedResponse, likesCountResponse } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const LIKE_STATUS_QUERY_KEY = 'like-status';
export const LIKES_COUNT_QUERY_KEY = 'likes-count';

export const useIsPostLiked = (blogId: string | undefined) => {
  const { data, isLoading, error, isError } = useQuery<IsLikedResponse, Error>({
    queryKey: [LIKE_STATUS_QUERY_KEY, blogId],
    queryFn: () => authFetcher(`/user/is-liked/${blogId}`),
    enabled: !!blogId,
    staleTime: 60 * 1000,
  });

  return {
    likeStatus: data,
    isLoading,
    isError: isError || !!error,
  };
};

export const useGetLikesCount = (blogId: string | undefined) => {
  const { data, isLoading, error, isError } = useQuery<
    likesCountResponse,
    Error
  >({
    queryKey: [LIKES_COUNT_QUERY_KEY, blogId],
    queryFn: () => authFetcher(`/user/count-likes/${blogId}`),
    enabled: !!blogId,
    staleTime: 60 * 1000,
  });

  return {
    likes: data,
    likeCountLoading: isLoading,
    likeCountError: isError || !!error,
  };
};
