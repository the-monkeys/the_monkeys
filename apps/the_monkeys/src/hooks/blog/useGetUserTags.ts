import { GetUserTagsResponse } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const USER_TAGS_QUERY_KEY = 'user-tags';

const useGetUserTags = ({ username }: { username: string }) => {
  const { data, error, isLoading, isError } = useQuery<
    GetUserTagsResponse,
    Error
  >({
    queryKey: [USER_TAGS_QUERY_KEY, username],
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
