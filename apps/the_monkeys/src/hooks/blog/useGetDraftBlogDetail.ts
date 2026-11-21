import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { Blog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const DRAFT_BLOG_DETAIL_QUERY_KEY = 'draft-blog-detail';

const useGetDraftBlogDetail = (
  blogId: string | null,
  options: { enabled?: boolean } = {}
) => {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<Blog, Error>({
    queryKey: queryKeys.blog.drafts.detail(blogId, viewer),
    queryFn: () => authFetcherV2(`/blog/my-draft/${blogId}`),
    enabled: !!viewer && !!blogId && options.enabled !== false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    blog: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetDraftBlogDetail;
