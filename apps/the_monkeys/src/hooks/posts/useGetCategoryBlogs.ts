import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetCategoryBlogs = ({
  category,
  limit = 15,
}: { category?: string; limit?: number } = {}) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    `/posts/${category}?limit=${limit}`,
    fetcherV2,
    {
      errorRetryInterval: 10000,
      errorRetryCount: 4,
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

export default useGetCategoryBlogs;
