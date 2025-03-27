import { GetBookmarkedBlogsResponse } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetBookmarkedBlogs = () => {
  const { data, error, isLoading } = useSWR<GetBookmarkedBlogsResponse>(
    `blog/my-bookmarks`,
    authFetcherV2
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetBookmarkedBlogs;
