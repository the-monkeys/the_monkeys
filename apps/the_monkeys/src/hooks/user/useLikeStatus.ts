import { useRef } from 'react';

import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import { IsLikedResponse, likesCountResponse } from '@/services/blog/blogTypes';
import { useQuery } from '@tanstack/react-query';

const STALE_TIME = 60 * 1000;

export const useIsPostLiked = (
  blogId: string | undefined,
  isAuthenticated: boolean,
  initialIsLiked?: boolean
) => {
  const { data: session } = useAuth();
  const viewer = session?.username;
  const initialViewer = useRef(viewer).current;
  const enabled = !!blogId && isAuthenticated && !!viewer;
  const { data, isLoading, error, isError } = useQuery<IsLikedResponse, Error>({
    queryKey: queryKeys.blog.likes.status(blogId, viewer),
    queryFn: ({ signal }) =>
      axiosInstance
        .get('/user/is-liked/' + blogId, { signal })
        .then((response) => response.data),
    enabled,
    initialData:
      enabled && viewer === initialViewer && initialIsLiked !== undefined
        ? { status: 'success', isLiked: initialIsLiked }
        : undefined,
    staleTime: STALE_TIME,
  });

  return {
    likeStatus: enabled ? data?.isLiked ?? false : false,
    isLoading,
    isError,
    error,
  };
};

export const useGetLikesCount = (
  blogId: string | undefined,
  initialCount?: number
) => {
  const { data: session } = useAuth();
  const { data, isLoading, error, isError } = useQuery<
    likesCountResponse,
    Error
  >({
    queryKey: queryKeys.blog.likes.count(blogId),
    queryFn: ({ signal }) =>
      axiosInstance
        .get('/user/count-likes/' + blogId, { signal })
        .then((response) => response.data),
    enabled: !!blogId && !!session?.username,
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
