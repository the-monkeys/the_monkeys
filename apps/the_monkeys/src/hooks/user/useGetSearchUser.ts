import { authFetcher } from '@/services/fetcher';
import { GetUserSearchResponse } from '@/services/search/searchTypes';
import useSWR from 'swr';

export const useGetSearchUser = (searchQuery?: string) => {
  const { data, error, isLoading } = useSWR<GetUserSearchResponse>(
    searchQuery ? `user/search?search_term=${searchQuery}` : null,
    authFetcher
  );

  return {
    searchUsers: data,
    searchUsersLoading: isLoading,
    searchUsersError: error,
  };
};
