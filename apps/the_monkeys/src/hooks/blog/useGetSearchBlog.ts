import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

export const useGetSearchBlog = (searchQuery?: string) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    searchQuery ? `blog/search?search_term=${searchQuery}` : null,
    authFetcherV2
  );

  return {
    searchBlogs: data,
    searchBlogsLoading: isLoading,
    searchBlogsError: error,
  };
};
