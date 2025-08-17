import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogByUsername = ({
  username,
  limit = 10,
  offset = 0,
}: {
  username?: string;
  limit: number;
  offset: number;
}) => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    `blog/user/${username}?limit=${limit}&offset=${offset}`,
    fetcherV2,
    {
      revalidateOnFocus: true,
      revalidateIfStale: false,
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
