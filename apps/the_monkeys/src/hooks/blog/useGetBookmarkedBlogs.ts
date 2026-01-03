import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BOOKMARKED_BLOGS_QUERY_KEY = 'bookmarked-blogs';

const useGetBookmarkedBlogs = ({
  limit = 10,
  offset = 0,
}: {
  limit: number;
  offset: number;
}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: [BOOKMARKED_BLOGS_QUERY_KEY, limit, offset],
      queryFn: () =>
        authFetcherV2(`blog/in-my-bookmark?limit=${limit}&offset=${offset}`),
      staleTime: 60 * 1000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetBookmarkedBlogs;
