import { fetcher } from '@/services/fetcher';
import useSWR from 'swr';

export const useGetAllNews1 = () => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_URL + '/blog/news1',
    fetcher
  );

  return {
    news: data,
    isLoading: !error && !data,
    error,
  };
};

export const useGetAllNews2 = () => {
  const { data, error } = useSWR('/blog/news2', fetcher);

  return {
    news: data,
    isLoading: !error && !data,
    error,
  };
};

export const useGetTopHeadlines = () => {
  const { data, error } = useSWR('/blog/news3', fetcher);

  return {
    topHeadlines: data,
    isLoading: !error && !data,
    error,
  };
};
