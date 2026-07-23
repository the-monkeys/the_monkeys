import { authFetcher } from '@/services/fetcher';
import {
  ConnectionCountResponse,
  FollowDataResponse,
  IsFollowedResponse,
} from '@/services/profile/userApiTypes';
import { followUserApi, unfollowUserApi } from '@/services/user/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

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

export const useIsFollowingUser = (username: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    IsFollowedResponse,
    Error
  >({
    queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
    queryFn: () => authFetcher(`/user/is-followed/${username}`),
    enabled: !!username,
    staleTime: 60 * 1000,
  });

  return {
    followStatus: data,
    isError: isError || !!error,
    isLoading,
  };
};

const handleFollowError = (err: unknown, action: 'follow' | 'unfollow') => {
  const message =
    err instanceof Error ? err.message : 'An unknown error occurred.';

  toast({
    variant: 'error',
    title: 'Error',
    description: message || `Failed to ${action} user.`,
  });
};

export const useFollowUser = (username?: string) => {
  const queryClient = useQueryClient();

  const invalidateConnectionQueries = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
      }),
      queryClient.invalidateQueries({
        queryKey: [CONNECTION_COUNT_QUERY_KEY, username],
      }),
    ]);

  const followMutation = useMutation({
    mutationFn: () => {
      if (!username) return Promise.reject(new Error('Username is required'));
      return followUserApi(username);
    },
    onSuccess: invalidateConnectionQueries,
    onError: (err) => handleFollowError(err, 'follow'),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => {
      if (!username) return Promise.reject(new Error('Username is required'));
      return unfollowUserApi(username);
    },
    onSuccess: invalidateConnectionQueries,
    onError: (err) => handleFollowError(err, 'unfollow'),
  });

  return { followMutation, unfollowMutation };
};
