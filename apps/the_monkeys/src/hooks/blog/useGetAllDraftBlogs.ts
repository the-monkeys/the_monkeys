import { GetDraftBlogResponse } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetAllDraftBlogs = () => {
  const { data, error, isLoading } = useSWR<GetDraftBlogResponse>(
    `/blog/my-drafts`,
    authFetcherV2,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    blogs: data,
    isError: error,
    isLoading,
  };
};

export default useGetAllDraftBlogs;
