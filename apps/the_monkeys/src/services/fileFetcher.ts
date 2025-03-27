import axiosInstance from './api/axiosInstance';

const fetcher = (url: string) =>
  axiosInstance
    .get(url, { responseType: 'blob' })
    .then((response) => response.data);

export default fetcher;
