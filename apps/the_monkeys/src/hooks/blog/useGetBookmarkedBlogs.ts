import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const BOOKMARKED_BLOGS_QUERY_KEY = 'bookmarked-blogs';

const useGetBookmarkedBlogs = ({
  limit = 10,
  offset = 0,
}: {
  limit: number;
  offset: number;
}) => {
  const { data: session } = useAuth();
  const viewer = session?.username;
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: queryKeys.blog.bookmarks.list(viewer ?? null, limit, offset),
      queryFn: async ({ signal }) => {
        try {
          const response = await axiosInstanceV2.get(
            'blog/in-my-bookmark?limit=' + limit + '&offset=' + offset,
            { signal }
          );
          return response.data;
        } catch (error) {
          // This endpoint represents an empty bookmark page with 404.
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            return { blogs: [], total_blogs: 0 };
          }
          throw error;
        }
      },
      enabled: !!viewer,
      staleTime: 60 * 1000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return {
    blogs: viewer ? data : undefined,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetBookmarkedBlogs;
