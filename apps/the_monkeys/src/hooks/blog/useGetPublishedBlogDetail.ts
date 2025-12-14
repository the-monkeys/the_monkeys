import { Blog } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const PUBLISHED_BLOG_DETAIL_QUERY_KEY = 'published-blog-detail';

const useGetPublishedBlogDetail = (
  accountId: string | undefined,
  blogId: string | undefined
) => {
  const { data, error, isLoading, isError } = useQuery<Blog, Error>({
    queryKey: [PUBLISHED_BLOG_DETAIL_QUERY_KEY, accountId, blogId],
    queryFn: () => authFetcher(`/blog/published/${accountId}/${blogId}`),
    enabled: !!accountId && !!blogId,
    staleTime: 60 * 1000,
  });

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetPublishedBlogDetail;
