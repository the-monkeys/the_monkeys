import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const FOLLOWING_FEED_QUERY_KEY = 'following-feed-blogs';

const useGetFollowingFeed = ({ limit = 50 }: { limit?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: [FOLLOWING_FEED_QUERY_KEY, limit],
      queryFn: () => fetcherV2(`/blog/following-feed?limit=${limit}`),
    }
  );

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetFollowingFeed;
