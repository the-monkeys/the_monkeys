import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { fetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const ALL_CATEGORIES_QUERY_KEY = 'all-categories';

const useGetAllCategories = () => {
  const { data, error, isLoading, isError } = useQuery<
    GetAllCategoriesAPIResponse,
    Error
  >({
    queryKey: [ALL_CATEGORIES_QUERY_KEY],
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
