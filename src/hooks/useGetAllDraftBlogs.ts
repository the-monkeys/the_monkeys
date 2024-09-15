import { GetDraftBlogResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetAllDraftBlogs = (accountId: string | undefined) => {
  const { data, error, isLoading } = useSWR<GetDraftBlogResponse>(
    `/blog/all/drafts/${accountId}`,
    authFetcher
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetAllDraftBlogs;
