import { GetDraftBlogResponse } from '@/services/blog/blogTypes';
import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetPublishedBlogByAccountId = (accountId: string | undefined) => {
  const { data, error, isLoading } = useSWR<GetDraftBlogResponse>(
    `blog/all/publishes/${accountId}`,
    authFetcher
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetPublishedBlogByAccountId;
