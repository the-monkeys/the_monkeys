import { authFetcher } from '@/services/fetcher';
import { GetProfileInfoByIdResponse } from '@/services/profile/userApiTypes';
import { useQuery } from '@tanstack/react-query';

export const USER_PROFILE_QUERY_KEY = 'user-profile-info';

const useGetProfileInfoById = (userId: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    GetProfileInfoByIdResponse,
    Error
  >({
    queryKey: [USER_PROFILE_QUERY_KEY, userId],
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
