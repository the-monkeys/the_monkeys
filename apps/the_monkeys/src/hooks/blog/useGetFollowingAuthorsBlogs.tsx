import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { GetFollwingAuthorsBlogsResponse } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const FOLLOWING_AUTHORS_BLOGS_QUERY_KEY = 'following-authors-blogs';

const useGetFollowingAuthorsBlogs = () => {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<
    GetFollwingAuthorsBlogsResponse,
    Error
  >({
    queryKey: queryKeys.blog.followingAuthors(viewer),
    enabled: !!viewer,
    queryFn: () => authFetcherV2(`/blog/following`),
    staleTime: 5 * 60 * 1000, // 5 minutes (matching SWR's refreshInterval: 300000)
  });

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetFollowingAuthorsBlogs;
