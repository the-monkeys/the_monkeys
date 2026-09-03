import { authFetcher } from '@/services/fetcher';
import {
  ConnectionCountResponse,
  FollowDataResponse,
  IsFollowedResponse,
} from '@/services/profile/userApiTypes';
import {
  followUserApi,
  getFollowStatusApi,
  unfollowUserApi,
} from '@/services/user/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import axios from 'axios';

export const CONNECTION_COUNT_QUERY_KEY = 'connection-count';
export const FOLLOWERS_QUERY_KEY = 'followers';
export const FOLLOWING_QUERY_KEY = 'following';
export const IS_FOLLOWING_USER_QUERY_KEY = 'is-following-user';

export const useGetConnectionCount = (username: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    ConnectionCountResponse,
    Error
  >({
    queryKey: [CONNECTION_COUNT_QUERY_KEY, username],
    queryFn: () => authFetcher(`/user/connection-count/${username}`),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });

  return {
    connections: data,
    connectionsError: isError || !!error,
    connectionsLoading: isLoading,
  };
};

export const useGetFollowers = () => {
  const { data, error, isLoading, isError } = useQuery<
    FollowDataResponse,
    Error
  >({
    queryKey: [FOLLOWERS_QUERY_KEY],
    queryFn: () => authFetcher(`/user/followers`),
    staleTime: 60 * 1000,
  });

  return {
    followers: data,
    followerError: isError || !!error,
    followerLoading: isLoading,
  };
};

export const useGetFollowing = () => {
  const { data, error, isLoading, isError } = useQuery<
    FollowDataResponse,
    Error
  >({
    queryKey: [FOLLOWING_QUERY_KEY],
    queryFn: () => authFetcher(`/user/following`),
    staleTime: 60 * 1000,
  });

  return {
    following: data,
    followingError: isError || !!error,
    followingLoading: isLoading,
  };
};

export const useIsFollowingUser = (username: string) => {
  const { data, error, isLoading, isError } = useQuery<
    IsFollowedResponse,
    Error
  >({
    queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
    queryFn: () => getFollowStatusApi(username),
    staleTime: 60 * 1000,
  });

  return {
    followStatus: data,
    isError: isError || !!error,
    isLoading,
  };
};

const handleFollowError = (err: unknown) => {
  const message = axios.isAxiosError(err)
    ? err.message
    : 'An unknown error occurred.';

  toast({
    variant: 'error',
    title: 'Error',
    description: message,
  });
};

type UseFollowUserOptions = {
  onFollowSuccess?: () => void;
  onUnfollowSuccess?: () => void;
  onError?: (err: unknown) => void;
};

export const useFollowUser = (
  username: string,
  options: UseFollowUserOptions = {}
) => {
  const queryClient = useQueryClient();

  const invalidateConnectionQueries = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
      }),
      queryClient.invalidateQueries({
        queryKey: [CONNECTION_COUNT_QUERY_KEY],
      }),
    ]);

  const followMutation = useMutation({
    mutationFn: () => followUserApi(username),
    onSuccess: async () => {
      await invalidateConnectionQueries();
      options.onFollowSuccess?.();
    },
    onError: (err) => {
      handleFollowError(err);
      options.onError?.(err);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUserApi(username),
    onSuccess: async () => {
      await invalidateConnectionQueries();
      options.onUnfollowSuccess?.();
    },
    onError: (err) => {
      handleFollowError(err);
      options.onError?.(err);
    },
  });

  return { followMutation, unfollowMutation };
};
