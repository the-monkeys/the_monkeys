import { Blog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const DRAFT_BLOG_DETAIL_QUERY_KEY = 'draft-blog-detail';

const useGetDraftBlogDetail = (blogId: string | null) => {
  const { data, error, isLoading, isError } = useQuery<Blog, Error>({
    queryKey: [DRAFT_BLOG_DETAIL_QUERY_KEY, blogId],
    queryFn: () => authFetcherV2(`/blog/my-draft/${blogId}`),
    enabled: !!blogId,
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
