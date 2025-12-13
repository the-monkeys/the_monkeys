import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetBookmarkedBlogs = ({
  limit = 10,
  offset = 0,
}: {
  limit: number;
  offset: number;
}) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    `blog/in-my-bookmark?limit=${limit}&offset=${offset}`,
    authFetcherV2,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetBookmarkedBlogs;
