import { fetcher } from '@/services/fetcher';
import useSWR from 'swr';

const useGetTopHeadlines = () => {
  const { data, error } = useSWR('/blog/news3', fetcher);

  return {
    topHeadlines: data,
    isLoading: !error && !data,
    error,
  };
};

export default useGetTopHeadlines;
