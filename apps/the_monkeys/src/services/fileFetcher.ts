import axiosInstanceV2 from './api/axiosInstanceV2';

const fetcher = (url: string) =>
  axiosInstanceV2
    .get(url, { responseType: 'blob' })
    .then((response) => response.data);

export default fetcher;
