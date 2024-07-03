import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetAuthUserProfile = (username: string | undefined) => {
  const { data, error } = useSWR(
    username ? `/user/${username}` : null,
    authFetcher
  );

  return {
    user: data,

    isLoading: !error && !data,
    isError: error,
  };
};

export default useGetAuthUserProfile;
