import { queryKeys } from '@/lib/queryKeys';
import { fetcher } from '@/services/fetcher';
import { GetProfileInfoByIdResponse } from '@/services/profile/userApiTypes';
import { useQuery } from '@tanstack/react-query';

export const USER_PROFILE_QUERY_KEY = 'user-profile-info';

const useGetProfileInfoById = (userId: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    GetProfileInfoByIdResponse,
    Error
  >({
    queryKey: queryKeys.profile.byAccount(userId),
    queryFn: () =>
      fetcher(`/user/public/account/${encodeURIComponent(userId!)}`),
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
