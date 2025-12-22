import { GetFollwingAuthorsBlogsResponse } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const FOLLOWING_AUTHORS_BLOGS_QUERY_KEY = 'following-authors-blogs';

const useGetFollowingAuthorsBlogs = () => {
  const { data, error, isLoading, isError } = useQuery<
    GetFollwingAuthorsBlogsResponse,
    Error
  >({
    queryKey: [FOLLOWING_AUTHORS_BLOGS_QUERY_KEY],
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
