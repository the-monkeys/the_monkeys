import { API_URL } from '@/constants/api';
import { authFetcher } from '@/services/fetcher';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const createAxiosAuthInstance = (token: string) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

const useGetAuthUserProfile = (username: string | undefined) => {
  const { data: session } = useSession();
  const axiosAuthInstance = session?.user?.token
    ? createAxiosAuthInstance(session.user.token)
    : null;

  const fetcher = (url: string) =>
    axiosAuthInstance ? authFetcher(url, axiosAuthInstance) : null;

  const { data, error } = useSWR(
    username ? `/user/${username}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useGetAuthUserProfile;
