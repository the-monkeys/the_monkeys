import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const useGetProfileTopics = () => {
  const { data: session } = useAuth();
  const accountId = session?.account_id;
  const { data, error, isLoading, isError } = useQuery({
    queryKey: queryKeys.user.profileTopics(accountId),
    queryFn: () => fetcher('/user/topics'),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    avaliableTopics: data,
    isTopicsLoading: isLoading,
    error: isError ? error : null,
  };
};
