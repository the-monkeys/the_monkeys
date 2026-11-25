import { queryKeys } from '@/lib/queryKeys';
import { Blog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BLOG_DETAIL_QUERY_KEY = 'blog-detail';

const useGetPublishedBlogDetailByBlogId = (
  blogId: string | undefined
): {
  blog: Blog | undefined;
  isError: boolean;
  isLoading: boolean;
  /** A completed fresh source read; exports wait before mounting media. */
  isFresh?: boolean;
} => {
  const {
    data,
    error,
    isLoading,
    isError,
    isFetchedAfterMount,
    isFetching,
    isSuccess,
  } = useQuery<Blog, Error>({
    queryKey: queryKeys.blog.detail(blogId),
    queryFn: () => authFetcherV2(`/blog/${blogId}`),
    enabled: !!blogId,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  });

  return {
    blog: data,
    isFresh: isSuccess && isFetchedAfterMount && !isFetching,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetPublishedBlogDetailByBlogId;
