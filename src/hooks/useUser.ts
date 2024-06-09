import fetcher from '@/services/fetcher';
import useSWR from 'swr';

function useUser(username: string) {
  const { data, error, isLoading } = useSWR(
    `/api/user/public/${username}`,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
