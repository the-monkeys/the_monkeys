import { GetAllTopicsAPIResponse } from '@/services/category/categoryTypes';
import { fetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetAllTopics = () => {
  const { data, error, isLoading } = useSWR<GetAllTopicsAPIResponse>(
    '/user/topics',
    fetcher
  );

  return {
    topics: data,
    isError: error,
    isLoading,
  };
};

export default useGetAllTopics;
