import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

export const useGetSearchBlog = ({
  searchQuery,
  limit = 10,
  offset = 0,
}: {
  searchQuery?: string;
  limit: number;
  offset: number;
}) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    searchQuery
      ? `blog/search?limit=${limit}&offset=${offset}&search_term=${searchQuery}`
      : null,
    authFetcherV2,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return {
    searchBlogs: data,
    searchBlogsLoading: isLoading,
    searchBlogsError: error,
  };
};
