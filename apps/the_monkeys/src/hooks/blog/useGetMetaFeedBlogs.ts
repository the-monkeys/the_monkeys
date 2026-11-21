import { queryKeys } from '@/lib/queryKeys';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const META_FEED_QUERY_KEY = 'meta-feed-blogs';

/** No longer used by the homepage (use useGetHomepageBlogs). Still used by RightRail; keep for existing catalog consumers. */
const useGetMetaFeedBlogs = ({ limit = 50 }: { limit?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: queryKeys.blog.meta(limit),
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
