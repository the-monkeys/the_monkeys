import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { fetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetAllCategories = () => {
  const { data, error, isLoading } = useSWR<GetAllCategoriesAPIResponse>(
    '/user/category',
    fetcher
  );

  return {
    categories: data,
    isError: error,
    isLoading,
  };
};

export default useGetAllCategories;
