import { Blog } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetDraftBlogDetail = (blogId: string | null) => {
  const { data, error, isLoading } = useSWR<Blog>(
    blogId ? `/blog/my-draft/${blogId}` : null,
    authFetcherV2
  );

  return {
    blog: data,
    isError: error,
    isLoading,
  };
};

export default useGetDraftBlogDetail;
