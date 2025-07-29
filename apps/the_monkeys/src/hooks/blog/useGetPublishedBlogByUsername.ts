import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogByUsername = (username: string | undefined) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    `blog/user/${username}`,
    fetcherV2,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetPublishedBlogByUsername;
