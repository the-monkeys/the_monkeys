import { Blog } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogDetailByBlogId = (blogId: string | undefined) => {
  const { data, error, isLoading } = useSWR<Blog>(
    `/blog/${blogId}`,
    authFetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  return {
    blog: data,
    isError: error,
    isLoading,
  };
};

export default useGetPublishedBlogDetailByBlogId;
