import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const META_FEED_QUERY_KEY = 'meta-feed-blogs';

const useGetMetaFeedBlogs = ({ limit = 50 }: { limit?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: [META_FEED_QUERY_KEY, limit],
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
