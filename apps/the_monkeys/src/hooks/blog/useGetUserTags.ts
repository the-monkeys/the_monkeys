import { GetUserTagsResponse } from '@/services/blog/blogTypes';
import { fetcherV2 } from '@/services/fetcher';
import useSWR from 'swr';

const useGetUserTags = ({ username }: { username: string }) => {
  const { data, error, isLoading } = useSWR<GetUserTagsResponse>(
    `blog/user-tags/${username}`,
    fetcherV2,
    {
      revalidateOnFocus: true,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  return {
    tags: data,
    isError: error,
    isLoading,
  };
};

export default useGetUserTags;
