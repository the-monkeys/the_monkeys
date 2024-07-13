import axios from 'axios';
import useSWR from 'swr';

const fetcher = () =>
  axios
    .get('https://hindustantimes-1-t3366110.deta.app/top-world-news')
    .then((res) => res.data);

const useGetTopHeadlines = () => {
  const { data, error } = useSWR('/top-global-headlines', fetcher);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
};

export default useGetTopHeadlines;
