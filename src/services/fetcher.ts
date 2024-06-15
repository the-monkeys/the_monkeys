import { API_URL } from '@/constants/api';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetcher = (url: string) =>
  axiosInstance.get(url).then((response) => response.data);

export default fetcher;
