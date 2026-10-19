import { queryKeys } from '@/lib/queryKeys';
import { authFetcher } from '@/services/fetcher';
import { GetProfileInfoByIdResponse } from '@/services/profile/userApiTypes';
import { useQuery } from '@tanstack/react-query';

const useGetProfileInfoById = (userId: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    GetProfileInfoByIdResponse,
    Error
  >({
    queryKey: queryKeys.user.publicProfileById(userId),
    queryFn: () => authFetcher(`/user/public/account/${userId}`),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: data,
    isLoading,
    isError: isError || !!error,
  };
};

export default useGetProfileInfoById;
