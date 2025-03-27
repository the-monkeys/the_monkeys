import axiosInstance from '@/services/api/axiosInstance';
import useSWR from 'swr';

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const useGetProfileTopics = () => {
  const { data, error, isLoading } = useSWR('/user/topics', fetcher);

  return {
    avaliableTopics: data,
    isTopicsLoading: isLoading,
    error,
  };
};
