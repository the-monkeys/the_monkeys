import { fetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetAllNews = () => {
  const { data, error } = useSWR('/blog/news2', fetcher);

  return {
    news: data,
    isLoading: !error && !data,
    error,
  };
};

export default useGetAllNews;
