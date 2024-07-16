import { MEDIASTACK_ACCESS_KEY } from '@/constants/api';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = () =>
  axios
    .get(
      `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_ACCESS_KEY}&language=en, -ar, -de, -es, -fr, -he, -it, -no, -nl, -pt, -ru, -se, -zh&categories=general, business, entertainment ,science, health, sports, technology&limit=100`
    )
    .then((res) => res.data);

const useGetAllNews = () => {
  const { data, error } = useSWR('/all-news', fetcher);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
};

export default useGetAllNews;
