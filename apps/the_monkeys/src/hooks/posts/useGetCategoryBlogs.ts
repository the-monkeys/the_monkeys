import { queryKeys } from '@/lib/queryKeys';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetCategoryBlogs = ({
  category,
  limit = 15,
}: { category?: string; limit?: number } = {}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: queryKeys.blog.category(category, limit),
      queryFn: () => fetcherV2(`/posts/${category}?limit=${limit}`),
      enabled: !!category,
      staleTime: 3 * 60 * 1000, // 3 minutes
    }
  );

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetCategoryBlogs;
