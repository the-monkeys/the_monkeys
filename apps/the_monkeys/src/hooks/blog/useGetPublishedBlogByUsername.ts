import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BLOGS_BY_USERNAME_QUERY_KEY = 'blogs-by-username';

const useGetPublishedBlogByUsername = ({
  username,
  limit = 10,
  offset = 0,
}: {
  username?: string;
  limit: number;
  offset: number;
}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: [BLOGS_BY_USERNAME_QUERY_KEY, username, limit, offset],
      queryFn: () =>
        fetcherV2(`blog/user/${username}?limit=${limit}&offset=${offset}`),
      enabled: !!username,
      staleTime: 60 * 1000,
    }
  );

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetPublishedBlogByUsername;
