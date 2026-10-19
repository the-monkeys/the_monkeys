import { queryKeys } from '@/lib/queryKeys';
import { Blog } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetPublishedBlogDetail = (
  accountId: string | undefined,
  blogId: string | undefined
) => {
  const { data, error, isLoading, isError } = useQuery<Blog, Error>({
    queryKey: queryKeys.blog.publishedDetail(accountId, blogId),
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
