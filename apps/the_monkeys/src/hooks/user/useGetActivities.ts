import { GetAllActivityAPIResponse } from '@/services/activity/activityApiTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const USER_ACTIVITIES_QUERY_KEY = 'user-activities';

const useGetActivities = (username: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<
    GetAllActivityAPIResponse,
    Error
  >({
    queryKey: [USER_ACTIVITIES_QUERY_KEY, username],
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
