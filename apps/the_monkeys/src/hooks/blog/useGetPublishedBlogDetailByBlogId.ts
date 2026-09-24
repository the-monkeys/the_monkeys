import { Blog } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BLOG_DETAIL_QUERY_KEY = 'blog-detail';

const useGetPublishedBlogDetailByBlogId = (blogId: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery<Blog, Error>({
    queryKey: [BLOG_DETAIL_QUERY_KEY, blogId],
    queryFn: () => fetcherV2(`/blog/${blogId}`),
    enabled: !!blogId,
    staleTime: 60 * 1000,
    retry: false,
  });

  return {
    blog: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetPublishedBlogDetailByBlogId;
