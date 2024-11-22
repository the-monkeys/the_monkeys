import { Blog, GetDraftBlogResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogDetailByBlogId = (blogId: string | undefined) => {
  const { data, error, isLoading } = useSWR<Blog>(
    `/blog/${blogId}`,
    authFetcher
  );

  return {
    blog: data,
    isError: error,
    isLoading,
  };
};

export default useGetPublishedBlogDetailByBlogId;
