import { fetcher } from '@/services/fetcher';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import useSWR from 'swr';

const useUser = (username: string | undefined) => {
  const { data, error, isLoading, mutate } =
    useSWR<GetPublicUserProfileApiResponse>(
      username ? `/user/public/${username}` : null,
      fetcher,
      {
        revalidateOnFocus: false,
      }
    );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useUser;
