import { API_URL } from '@/constants/api';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = () =>
  axios.get(`${API_URL}/blog/news3`).then((res) => res.data);

const useGetTopHeadlines = () => {
  const { data, error } = useSWR('/news/top-headlines', fetcher);

  return {
    topHeadlines: data,
    isLoading: !error && !data,
    error,
  };
};

export default useGetTopHeadlines;
