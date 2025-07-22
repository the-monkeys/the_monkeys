import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetMetaFeedBlogs = ({ limit = 50 }: { limit?: number } = {}) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    `/blog/meta-feed?limit=${limit}`,
    fetcherV2,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 300000,
    }
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetMetaFeedBlogs;
