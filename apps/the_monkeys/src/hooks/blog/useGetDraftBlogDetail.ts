import { Blog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetDraftBlogDetail = (blogId: string | null) => {
  const { data, error, isLoading } = useQuery<Blog>({
    queryKey: ['draft-blog', blogId],
    queryFn: () => authFetcherV2(`/blog/my-draft/${blogId}`),
    enabled: !!blogId,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    blog: data,
    isError: error,
    isLoading,
  };
};

export default useGetDraftBlogDetail;
