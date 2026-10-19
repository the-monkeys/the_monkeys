import { queryKeys } from '@/lib/queryKeys';
import { MetaBlog } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

type TrendingBlogsResponse = {
  blogs: MetaBlog[];
  total_blogs: number;
};

const useGetTrendingBlogs = () => {
  const { data, isLoading, isError } = useQuery<TrendingBlogsResponse, Error>({
    queryKey: queryKeys.blog.trending,
    queryFn: () => fetcherV2('/blog/trending'),
    staleTime: 5 * 60 * 1000,
  });

  return {
    blogs: data?.blogs ?? [],
    isError,
    isLoading,
  };
};

export default useGetTrendingBlogs;
