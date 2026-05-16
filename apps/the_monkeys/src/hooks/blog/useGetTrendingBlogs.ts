import { MetaBlog } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const TRENDING_BLOGS_QUERY_KEY = 'trending-blogs';

type TrendingBlogsResponse = {
  blogs: MetaBlog[];
  total_blogs: number;
};

const useGetTrendingBlogs = () => {
  const { data, isLoading, isError } = useQuery<TrendingBlogsResponse, Error>({
    queryKey: [TRENDING_BLOGS_QUERY_KEY],
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
