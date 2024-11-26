import { authFetcher } from '@/services/fetcher';
import {
  FollowDataResponse,
  IsFollowedResponse,
} from '@/services/profile/userApiTypes';
import useSWR from 'swr';

export const useGetFollowers = () => {
  const { data, error, isLoading } = useSWR<FollowDataResponse>(
    `/user/followers`,
    authFetcher
  );

  return {
    followers: data,
    followerError: error,
    follwerLoading: isLoading,
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
    follwingLoading: isLoading,
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
