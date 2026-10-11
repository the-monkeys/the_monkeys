import { AxiosRequestConfig } from 'axios';

import axiosInstanceV2 from './api/axiosInstanceV2';

const fetcher = (url: string, config?: AxiosRequestConfig) =>
  axiosInstanceV2
    .get(url, {
      responseType: 'blob',
      headers: {
        'Cache-Control': 'no-cache',
        ...config?.headers,
      },
      ...config,
    })
    .then((response) => response.data);

export default fetcher;
