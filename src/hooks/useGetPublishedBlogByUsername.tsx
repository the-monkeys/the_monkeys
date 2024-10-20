import { GetDraftBlogResponse } from '@/services/Blogs/BlogTyptes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogByAccountId = (username: string | undefined) => {
  const { data, error, isLoading } = useSWR<GetDraftBlogResponse>(
    `/blog/all/publishes/${username}`,
    authFetcher
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetPublishedBlogByAccountId;
