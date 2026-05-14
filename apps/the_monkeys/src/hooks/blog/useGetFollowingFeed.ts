import { FollowingFeed } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const FOLLOWING_FEED_QUERY_KEY = 'following-feed-blogs';

type FollowingFeedType = {
  blogs: FollowingFeed[];
  total_blogs?: number;
};

const useGetFollowingFeed = ({
  limit = 50,
  offset = 0,
}: { limit?: number; offset?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<
    FollowingFeedType,
    Error
  >({
    queryKey: [FOLLOWING_FEED_QUERY_KEY, limit, offset],
    queryFn: () =>
      authFetcherV2(`/blog/following-feed?limit=${limit}&offset=${offset}`),
  });

  return {
    blogs: data?.blogs,
    totalBlogs: data?.total_blogs,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetFollowingFeed;
