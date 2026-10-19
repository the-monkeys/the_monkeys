import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetAllDraftBlogs = ({
  limit = 10,
  offset = 0,
}: {
  username?: string;
  limit: number;
  offset: number;
}) => {
  const { data: session } = useAuth();
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery<GetMetaFeedBlogs, Error>(
    {
      queryKey: queryKeys.blog.drafts.page(accountId, limit, offset),
      queryFn: () =>
        authFetcherV2(`/blog/in-my-draft?limit=${limit}&offset=${offset}`),
      enabled: !!accountId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
    }
  );

  return {
    blogs: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetAllDraftBlogs;
