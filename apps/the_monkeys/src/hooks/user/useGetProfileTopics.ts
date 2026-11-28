import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const PROFILE_TOPICS_QUERY_KEY = 'profile-topics';

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const useGetProfileTopics = () => {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery({
    queryKey: queryKeys.profile.topics(viewer),
    enabled: !!viewer,
    queryFn: () => fetcher('/user/topics'),
    staleTime: 5 * 60 * 1000,
  });

  return {
    avaliableTopics: data,
    isTopicsLoading: isLoading,
    error: isError ? error : null,
  };
};
