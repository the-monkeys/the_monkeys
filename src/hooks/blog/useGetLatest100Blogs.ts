import { GetLatest100BlogsResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetLatest100Blogs = () => {
  const { data, error, isLoading } = useSWR<GetLatest100BlogsResponse>(
    `/blog/latest`,
    authFetcher
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetLatest100Blogs;
