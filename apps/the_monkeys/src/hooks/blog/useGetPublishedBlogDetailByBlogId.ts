import { Blog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogDetailByBlogId = (blogId: string | undefined) => {
  const { data, error, isLoading } = useSWR<Blog>(
    `/blog/${blogId}`,
    authFetcherV2,
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
