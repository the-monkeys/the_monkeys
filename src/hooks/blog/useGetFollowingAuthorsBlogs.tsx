import { GetFollwingAuthorsBlogsResponse } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetFollowingAuthorsBlogs = () => {
  const { data, error, isLoading } = useSWR<GetFollwingAuthorsBlogsResponse>(
    `/blog/following`,
    authFetcherV2,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 300000,
    }
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetFollowingAuthorsBlogs;
