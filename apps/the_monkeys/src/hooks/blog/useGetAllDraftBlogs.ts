import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetAllDraftBlogs = () => {
  const { data, error, isLoading } = useSWR<GetMetaFeedBlogs>(
    `/blog/in-my-draft`,
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
