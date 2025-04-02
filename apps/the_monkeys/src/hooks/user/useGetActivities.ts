import { GetAllActivityAPIResponse } from '@/services/activity/activityApiTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetActivities = (username: string | undefined) => {
  const { data, error, isLoading } = useSWR<GetAllActivityAPIResponse>(
    `/user/activities/${username}`,
    authFetcher
  );

  return {
    activities: data,
    isError: error,
    isLoading,
  };
};

export default useGetActivities;
