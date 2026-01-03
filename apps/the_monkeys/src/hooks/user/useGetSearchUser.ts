import { authFetcher } from '@/services/fetcher';
import { GetUserSearchResponse } from '@/services/search/searchTypes';
import { useQuery } from '@tanstack/react-query';

export const USER_SEARCH_QUERY_KEY = 'user-search';

export const useGetSearchUser = (searchQuery?: string) => {
  const { data, error, isLoading, isError } = useQuery<
    GetUserSearchResponse,
    Error
  >({
    queryKey: [USER_SEARCH_QUERY_KEY, searchQuery],
    queryFn: () => authFetcher(`user/search?search_term=${searchQuery}`),
    enabled: !!searchQuery,
    staleTime: 60 * 1000,
  });

  return {
    searchUsers: data,
    searchUsersLoading: isLoading,
    searchUsersError: isError || !!error,
  };
};
