import { API_URL } from '@/constants/api';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'image/jpeg',
  },
});

const fetcher = (url: string) =>
  axiosInstance
    .get(url, { responseType: 'blob' })
    .then((response) => response.data);

export default fetcher;
