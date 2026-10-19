import { queryKeys } from '@/lib/queryKeys';
import { GetLatest100BlogsResponse } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetLatest100Blogs = ({ limit = 100 }: { limit?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<
    GetLatest100BlogsResponse,
    Error
  >({
    queryKey: queryKeys.blog.latest(limit),
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
