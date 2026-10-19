import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { Blog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetDraftBlogDetail = (
  blogId: string | null,
  options: { enabled?: boolean } = {}
) => {
  const { data: session } = useAuth();
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery<Blog, Error>({
    queryKey: queryKeys.blog.draftDetail(accountId, blogId ?? undefined),
    queryFn: () => authFetcherV2(`/blog/my-draft/${blogId}`),
    enabled: !!accountId && !!blogId && options.enabled !== false,
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
