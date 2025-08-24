import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetMetaFeedBlogs = ({ limit = 50 }: { limit?: number } = {}) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    `/blog/meta-feed?limit=${limit}`,
    fetcherV2,
    {
      errorRetryInterval: 10000,
      errorRetryCount: 4,
      revalidateOnFocus: true,
      revalidateIfStale: true,
      refreshInterval: 60000,
    }
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetMetaFeedBlogs;
