import { API_URL } from '@/constants/api';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = () =>
  axios.get(`${API_URL}/blog/news2`).then((res) => res.data);

const useGetAllNews = () => {
  const { data, error } = useSWR('/news/all', fetcher);

  return {
    news: data,
    isLoading: !error && !data,
    error,
  };
};

export default useGetAllNews;
