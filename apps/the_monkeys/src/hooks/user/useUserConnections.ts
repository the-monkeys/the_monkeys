import { authFetcher } from '@/services/fetcher';
import {
  ConnectionCountResponse,
  FollowDataResponse,
  IsFollowedResponse,
} from '@/services/profile/userApiTypes';
import { useQuery } from '@tanstack/react-query';

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
