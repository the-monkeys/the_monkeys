import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { MetaBlog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

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
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery<
    GetScheduledBlogsResponse,
    Error
  >({
    queryKey: queryKeys.blog.scheduled.page(accountId, limit, offset),
    queryFn: () =>
      authFetcherV2(`/blog/my-scheduled_blog?limit=${limit}&offset=${offset}`),
    enabled: !!accountId,
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
