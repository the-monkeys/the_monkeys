import { queryKeys } from '@/lib/queryKeys';
import { GetAllActivityAPIResponse } from '@/services/activity/activityApiTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetActivities = (username: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    GetAllActivityAPIResponse,
    Error
  >({
    queryKey: queryKeys.user.activities(username),
    queryFn: () => authFetcher(`/user/activities/${username}`),
    enabled: !!username,
    staleTime: 60 * 1000,
  });

  return {
    activities: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetActivities;
