import { GetLatest100BlogsResponse } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetLatest100Blogs = () => {
  const { data, error, isLoading } = useSWR<GetLatest100BlogsResponse>(
    `/blog/feed`,
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
