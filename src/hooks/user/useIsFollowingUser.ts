import { authFetcher } from '@/services/fetcher';
import { IsFollowedResponse } from '@/services/profile/userApiTypes';
import useSWR from 'swr';

const useIsFollowingUser = (username: string | undefined) => {
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

export default useIsFollowingUser;
