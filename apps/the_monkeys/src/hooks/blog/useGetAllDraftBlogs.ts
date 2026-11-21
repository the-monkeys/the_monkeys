import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const ALL_DRAFT_BLOGS_QUERY_KEY = 'all-draft-blogs';

const useGetAllDraftBlogs = ({
  limit = 10,
  offset = 0,
}: {
  username?: string;
  limit: number;
  offset: number;
}) => {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: queryKeys.blog.drafts.list(viewer, limit, offset),
      enabled: !!viewer,
      queryFn: () =>
        authFetcherV2(`/blog/in-my-draft?limit=${limit}&offset=${offset}`),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
    }
  );

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetAllDraftBlogs;
