import { fetcher } from '@/services/fetcher';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import useSWR from 'swr';

const useUser = (username: string | undefined) => {
  const { data, error, isLoading, mutate } =
    useSWR<GetPublicUserProfileApiResponse>(
      `/user/public/${username}`,
      fetcher
    );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useUser;
