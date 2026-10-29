import { FOLLOWING_FEED_QUERY_KEY } from '@/lib/followingFeedKeys';
import { FollowingFeed } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export { FOLLOWING_FEED_QUERY_KEY } from '@/lib/followingFeedKeys';

type FollowingFeedType = {
  blogs: FollowingFeed[];
  total_blogs?: number;
};

const useGetFollowingFeed = ({
  limit = 50,
  offset = 0,
  viewerUsername,
  viewerAccountId,
}: {
  limit?: number;
  offset?: number;
  viewerUsername?: string;
  viewerAccountId?: string;
} = {}) => {
  const { data, error, isLoading, isError } = useQuery<
    FollowingFeedType,
    Error
  >({
    queryKey: [
      FOLLOWING_FEED_QUERY_KEY,
      viewerAccountId ?? viewerUsername,
      limit,
      offset,
    ],
    enabled: Boolean(viewerUsername && viewerAccountId),
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
