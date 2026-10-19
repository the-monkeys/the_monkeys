import { queryKeys } from '@/lib/queryKeys';
import { fetcher } from '@/services/fetcher';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { useQuery } from '@tanstack/react-query';

const useUser = (username: string | undefined) => {
  const { data, error, isLoading, refetch } = useQuery<
    GetPublicUserProfileApiResponse,
    Error
  >({
    queryKey: queryKeys.user.currentProfile(username),
    queryFn: () => fetcher(`/user/public/${username}`),
    enabled: !!username,
    staleTime: 60 * 1000,
  });

  return {
    user: data,
    isLoading,
    isError: error,
    mutate: refetch,
  };
};

export default useUser;
