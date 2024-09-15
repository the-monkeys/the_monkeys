import { Blog, GetDraftBlogResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetDraftBlogDetail = (
  accountId: string | undefined,
  blogId: string | null
) => {
  const { data, error, isLoading } = useSWR<Blog>(
    `/blog/drafts/${accountId}/${blogId}`,
    authFetcher
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetDraftBlogDetail;
