import { GetAllActivityAPIResponse } from '@/services/activity/activityApiTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetDraftBlog = (accountId: string | undefined) => {
  const { data, error, isLoading } = useSWR<GetAllActivityAPIResponse>(
    `/blog/all/drafts/${accountId}`,
    authFetcher
  );

  return {
    activities: data,
    isError: error,
    isLoading,
  };
};

export default useGetDraftBlog;
