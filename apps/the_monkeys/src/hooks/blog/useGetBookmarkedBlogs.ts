import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetBookmarkedBlogs = ({
  limit = 10,
  offset = 0,
}: {
  limit: number;
  offset: number;
}) => {
  const { data, error, isLoading } = useQuery<GetMetaFeedBlogs>({
    queryKey: ['bookmarked-blogs', limit, offset],
    queryFn: () =>
      authFetcherV2(`blog/in-my-bookmark?limit=${limit}&offset=${offset}`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetBookmarkedBlogs;
