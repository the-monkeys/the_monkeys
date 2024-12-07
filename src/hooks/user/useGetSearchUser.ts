import { authFetcher } from '@/services/fetcher';
import useSWR from 'swr';

export const useGetSearchUser = (searchQuery?: string) => {
  const { data, error, isLoading } = useSWR<GetUserSearchResponse>(
    `user/search?search_term=${searchQuery}`,
    authFetcher
  );

  return {
    searchUsers: data,
    searchUsersLoading: isLoading,
    searchUsersError: error,
  };
};
