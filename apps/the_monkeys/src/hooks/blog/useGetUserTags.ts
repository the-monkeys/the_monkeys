import { queryKeys } from '@/lib/queryKeys';
import { GetUserTagsResponse } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetUserTags = ({ username }: { username: string }) => {
  const { data, error, isLoading, isError } = useQuery<
    GetUserTagsResponse,
    Error
  >({
    queryKey: queryKeys.blog.userTags(username),
    queryFn: () => fetcherV2(`blog/user-tags/${username}`),
    enabled: !!username,
    staleTime: 60 * 1000,
  });

  return {
    tags: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetUserTags;
