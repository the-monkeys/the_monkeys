import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { FollowingFeed } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

type FollowingFeedType = {
  blogs: FollowingFeed[];
  total_blogs?: number;
};

const useGetFollowingFeed = ({
  limit = 50,
  offset = 0,
}: { limit?: number; offset?: number } = {}) => {
  const { data: session } = useAuth();
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery<
    FollowingFeedType,
    Error
  >({
    queryKey: queryKeys.blog.followingFeed(accountId, limit, offset),
    queryFn: () =>
      authFetcherV2(`/blog/following-feed?limit=${limit}&offset=${offset}`),
    enabled: !!accountId,
  });

  return {
    blogs: data?.blogs,
    totalBlogs: data?.total_blogs,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetFollowingFeed;
