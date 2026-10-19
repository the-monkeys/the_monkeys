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

export const useGetConnectionCount = (username: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    ConnectionCountResponse,
    Error
  >({
    queryKey: queryKeys.user.connectionCount(username),
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
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery<
    FollowDataResponse,
    Error
  >({
    queryKey: queryKeys.user.followers(accountId),
    queryFn: () => authFetcher(`/user/followers`),
    enabled: !!accountId,
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
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery<
    FollowDataResponse,
    Error
  >({
    queryKey: queryKeys.user.following(accountId),
    queryFn: () => authFetcher(`/user/following`),
    enabled: !!accountId,
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
  const { data, error, isLoading, isError } = useQuery<
    IsFollowedResponse,
    Error
  >({
    queryKey: queryKeys.user.followStatus(session?.account_id, username),
    queryFn: () => getFollowStatusApi(username),
    enabled: !!session?.account_id && !!username,
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
  const { data: session } = useAuth();

  const invalidateConnectionQueries = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.followStatus(session?.account_id, username),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.connectionCountRoot,
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
