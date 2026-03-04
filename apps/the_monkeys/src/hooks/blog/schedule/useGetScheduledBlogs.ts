import { MetaBlog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const ALL_SCHEDULED_BLOGS_QUERY_KEY = 'all-scheduled-blogs';

export interface ScheduledBlog extends MetaBlog {
  schedule_time?: string;
  timezone?: string;
}

interface GetScheduledBlogsResponse {
  blogs: ScheduledBlog[];
  total_blogs?: number;
}

const useGetScheduledBlogs = ({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}) => {
  const { data, error, isLoading, isError } = useQuery<
    GetScheduledBlogsResponse,
    Error
  >({
    queryKey: [ALL_SCHEDULED_BLOGS_QUERY_KEY, limit, offset],
    queryFn: () =>
      authFetcherV2(`/blog/my-scheduled_blog?limit=${limit}&offset=${offset}`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetScheduledBlogs;
