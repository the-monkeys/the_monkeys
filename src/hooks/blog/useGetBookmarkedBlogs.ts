import { GetBookmarkedBlogsResponse } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetBookmarkedBlogs = () => {
  const { data, error, isLoading } = useSWR<GetBookmarkedBlogsResponse>(
    `blog/all/bookmarks`,
    authFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetBookmarkedBlogs;
