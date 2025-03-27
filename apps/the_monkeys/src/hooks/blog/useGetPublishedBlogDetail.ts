import { Blog } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogDetail = (
  accountId: string | undefined,
  blogId: string | undefined
) => {
  const { data, error, isLoading } = useSWR<Blog>(
    `/blog/published/${accountId}/${blogId}`,
    authFetcher
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetPublishedBlogDetail;
