import { queryKeys } from '@/lib/queryKeys';
import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { fetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

const useGetAllCategories = () => {
  const { data, error, isLoading, isError } = useQuery<
    GetAllCategoriesAPIResponse,
    Error
  >({
    queryKey: queryKeys.categories.all,
    queryFn: () => fetcher('/user/category'),
    staleTime: 5 * 60 * 1000,
  });

  return {
    categories: data,
    isError: isError || !!error,
    isLoading,
  };
};

export default useGetAllCategories;
