import { GetAllTopicsAPIResponse } from '@/services/category/categoryTypes';
import { fetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const ALL_TOPICS_QUERY_KEY = 'all-topics';

const useGetAllTopics = () => {
  const { data, error, isLoading, isError } = useQuery<
    GetAllTopicsAPIResponse,
    Error
  >({
    queryKey: [ALL_TOPICS_QUERY_KEY],
    queryFn: () => fetcher('/user/topics'),
    staleTime: 5 * 60 * 1000,
  });

  return {
    topics: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetAllTopics;
