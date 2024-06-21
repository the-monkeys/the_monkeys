import fetcher from '@/services/fetcher';
import { GetPublicUserApiResponse } from '@/services/profile/userApiTypes';
import useSWR from 'swr';

function useUser(username: string | undefined) {
  const { data, error, isLoading } = useSWR<GetPublicUserApiResponse>(
    `/user/public/${username}`,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}

export default useUser;
