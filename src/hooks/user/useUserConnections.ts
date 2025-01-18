import { authFetcher } from '@/services/fetcher';
import {
  ConnectionCountResponse,
  FollowDataResponse,
  IsFollowedResponse,
} from '@/services/profile/userApiTypes';
import useSWR from 'swr';

export const useGetConnectionCount = (username: string | undefined) => {
  const { data, error, isLoading } = useSWR<ConnectionCountResponse>(
    `/user/connection-count/${username}`,
    authFetcher,
    {
      refreshInterval: 0,
    }
  );

  return {
    connections: data,
    connectionsError: error,
    connectionsLoading: isLoading,
  };
};

export const useGetFollowers = () => {
  const { data, error, isLoading } = useSWR<FollowDataResponse>(
    `/user/followers`,
    authFetcher
  );

  return {
    followers: data,
    followerError: error,
    followerLoading: isLoading,
  };
};

export const useGetFollowing = () => {
  const { data, error, isLoading } = useSWR<FollowDataResponse>(
    `/user/following`,
    authFetcher
  );

  return {
    following: data,
    followingError: error,
    followingLoading: isLoading,
  };
};

export const useIsFollowingUser = (username: string | undefined) => {
  const { data, error, isLoading } = useSWR<IsFollowedResponse>(
    `/user/is-followed/${username}`,
    authFetcher
  );

  return {
    followStatus: data,
    isError: error,
    isLoading,
  };
};
