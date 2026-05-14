import { queryKeys } from '@/lib/queryKeys';
import { IsLikedResponse, likesCountResponse } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const STALE_TIME = 60 * 1000;

export const useIsPostLiked = (
  blogId: string | undefined,
  initialIsLiked?: boolean
) => {
  const { data, isLoading, error, isError } = useQuery<IsLikedResponse, Error>({
    queryKey: queryKeys.blog.likes.status(blogId),
    queryFn: () => authFetcher(`/user/is-liked/${blogId}`),
    enabled: !!blogId,
    initialData:
      initialIsLiked === undefined
        ? undefined
        : { status: 'success', isLiked: initialIsLiked },
    staleTime: STALE_TIME,
  });

  return {
    likeStatus: data?.isLiked ?? false,
    isLoading,
    isError,
    error,
  };
};

export const useGetLikesCount = (
  blogId: string | undefined,
  initialCount?: number
) => {
  const { data, isLoading, error, isError } = useQuery<
    likesCountResponse,
    Error
  >({
    queryKey: queryKeys.blog.likes.count(blogId),
    queryFn: () => authFetcher(`/user/count-likes/${blogId}`),
    enabled: !!blogId,
    initialData:
      initialCount === undefined ? undefined : { count: initialCount },
    staleTime: STALE_TIME,
  });

  return {
    likes: data?.count ?? 0,
    likeCountLoading: isLoading,
    likeCountError: isError,
    error,
  };
};
