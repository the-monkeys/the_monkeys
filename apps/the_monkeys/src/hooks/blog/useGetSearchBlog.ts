import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BLOG_SEARCH_QUERY_KEY = 'blog-search';

export const useGetSearchBlog = ({
  searchQuery,
  limit = 10,
  offset = 0,
}: {
  searchQuery?: string;
  limit: number;
  offset: number;
}) => {
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: [BLOG_SEARCH_QUERY_KEY, searchQuery, limit, offset],
      queryFn: () =>
        authFetcherV2(
          `blog/search?limit=${limit}&offset=${offset}&search_term=${searchQuery}`
        ),
      enabled: !!searchQuery,
      staleTime: 60 * 1000,
    }
  );

  return {
    searchBlogs: data,
    searchBlogsLoading: isLoading,
    searchBlogsError: isError || !!error,
  };
};
