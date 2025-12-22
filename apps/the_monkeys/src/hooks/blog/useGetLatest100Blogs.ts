import { GetLatest100BlogsResponse } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const LATEST_100_BLOGS_QUERY_KEY = 'latest-100-blogs';

const useGetLatest100Blogs = ({ limit = 100 }: { limit?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<
    GetLatest100BlogsResponse,
    Error
  >({
    queryKey: [LATEST_100_BLOGS_QUERY_KEY, limit],
    queryFn: () => fetcherV2(`/blog/feed?limit=${limit}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetLatest100Blogs;
