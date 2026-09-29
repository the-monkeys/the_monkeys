import axiosInstanceV2 from './api/axiosInstanceV2';

const fetcher = (url: string) =>
  axiosInstanceV2
    .get(url, {
      responseType: 'blob',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })
    .then((response) => response.data);

export default fetcher;
