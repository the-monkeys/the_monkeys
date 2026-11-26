import { useRef } from 'react';

import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import {
  IsBookmarkedResponse,
  bookmarksCountResponse,
} from '@/services/blog/blogTypes';
import { useQuery } from '@tanstack/react-query';

const STALE_TIME = 60 * 1000;

export const useIsPostBookmarked = (
  blogId: string | undefined,
  isAuthenticated: boolean,
  initialIsBookmarked?: boolean
) => {
  const { data: session } = useAuth();
  const viewer = session?.username;
  const initialViewer = useRef(viewer).current;
  const enabled = !!blogId && isAuthenticated && !!viewer;
  const { data, isLoading, error, isError } = useQuery<
    IsBookmarkedResponse,
    Error
  >({
    queryKey: queryKeys.blog.bookmarks.status(blogId, viewer),
    queryFn: ({ signal }) =>
      axiosInstance
        .get('/user/is-bookmarked/' + blogId, { signal })
        .then((response) => response.data),
    enabled,
    initialData:
      enabled && viewer === initialViewer && initialIsBookmarked !== undefined
        ? { status: 'success', bookMarked: initialIsBookmarked }
        : undefined,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    bookmarkStatus: enabled ? data : undefined,
    isLoading,
    isError,
    error,
  };
};

export const useGetBookmarksCount = (
  blogId: string | undefined,
  initialCount?: number
) => {
  const { data: session } = useAuth();
  const { data, isLoading, error, isError } = useQuery<
    bookmarksCountResponse,
    Error
  >({
    queryKey: queryKeys.blog.bookmarks.count(blogId),
    queryFn: ({ signal }) =>
      axiosInstance
        .get('/user/count-bookmarks/' + blogId, { signal })
        .then((response) => response.data),
    initialData:
      initialCount === undefined ? undefined : { count: initialCount },
    staleTime: STALE_TIME,
    enabled: !!blogId && !!session?.username,
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
