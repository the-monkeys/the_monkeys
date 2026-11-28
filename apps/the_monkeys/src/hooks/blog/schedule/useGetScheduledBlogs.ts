import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
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
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<
    GetScheduledBlogsResponse,
    Error
  >({
    queryKey: queryKeys.blog.scheduled.list(viewer, limit, offset),
    enabled: !!viewer,
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
