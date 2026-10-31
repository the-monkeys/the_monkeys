import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const BOOKMARKED_BLOGS_QUERY_KEY = 'bookmarked-blogs';

export async function fetchBookmarkedBlogs(
  limit: number,
  offset: number
): Promise<GetMetaFeedBlogs> {
  try {
    return await authFetcherV2(
      `blog/in-my-bookmark?limit=${limit}&offset=${offset}`
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { blogs: [], total_blogs: 0 };
    }

    throw error;
  }
}

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
      queryFn: () => fetchBookmarkedBlogs(limit, offset),
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
