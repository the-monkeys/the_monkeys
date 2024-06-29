import { API_URL } from '@/constants/api';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosFileInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const fetcher = (url: string) =>
  axiosInstance.get(url).then((response) => response.data);

export default fetcher;
