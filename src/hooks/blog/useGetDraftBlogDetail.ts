import { Blog, GetDraftBlogResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetDraftBlogDetail = (blogId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<Blog>(
    blogId ? `/blog/my-drafts/${blogId}` : null,
    authFetcher
  );

  return {
    mutate,
    blog: data,
    isError: error,
    isLoading,
  };
};

export default useGetDraftBlogDetail;
