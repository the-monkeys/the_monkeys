import { GetLatest100BlogsResponse } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetLatest100Blogs = ({ limit = 100 }: { limit?: number } = {}) => {
  const { data, error, isLoading } = useSWR<GetLatest100BlogsResponse>(
    `/blog/feed?limit=${limit}`,
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

export default useGetLatest100Blogs;
