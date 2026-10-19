import { queryKeys } from '@/lib/queryKeys';
import { GetAllTopicsAPIResponse } from '@/services/category/categoryTypes';
import { fetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetAllTopics = () => {
  const { data, error, isLoading, isError } = useQuery<
    GetAllTopicsAPIResponse,
    Error
  >({
    queryKey: queryKeys.topics.all,
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
