import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
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
    queryKey: queryKeys.profile.connectionCount(username),
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
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<
    FollowDataResponse,
    Error
  >({
    queryKey: queryKeys.profile.followers(viewer),
    enabled: !!viewer,
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
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<
    FollowDataResponse,
    Error
  >({
    queryKey: queryKeys.profile.following(viewer),
    enabled: !!viewer,
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
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<
    IsFollowedResponse,
    Error
  >({
    queryKey: queryKeys.profile.followStatus(username, viewer),
    enabled: !!viewer,
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
      queryClient.resetQueries({ queryKey: queryKeys.discussions.following() }),
      queryClient.resetQueries({ queryKey: queryKeys.blog.followingFeed() }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.followStatus(username),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.connectionCount(),
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
