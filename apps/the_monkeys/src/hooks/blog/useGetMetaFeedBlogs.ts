import { queryKeys } from '@/lib/queryKeys';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetMetaFeedBlogs = ({ limit = 50 }: { limit?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: queryKeys.blog.metaFeed(limit),
      queryFn: () => fetcherV2(`/blog/meta-feed?limit=${limit}`),
    }
  );

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetMetaFeedBlogs;
