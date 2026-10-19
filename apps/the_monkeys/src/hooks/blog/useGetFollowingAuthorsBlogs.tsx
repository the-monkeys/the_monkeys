import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { GetFollwingAuthorsBlogsResponse } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetFollowingAuthorsBlogs = () => {
  const { data: session } = useAuth();
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery<
    GetFollwingAuthorsBlogsResponse,
    Error
  >({
    queryKey: queryKeys.blog.followingAuthors(accountId),
    queryFn: () => authFetcherV2(`/blog/following`),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000, // 5 minutes (matching SWR's refreshInterval: 300000)
  });

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetFollowingAuthorsBlogs;
