import clientInfo from '@/utils/clientInfo';
import axios, { AxiosResponse } from 'axios';

const axiosFileInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

axiosFileInstance.interceptors.request.use(
  async (config) => {
    const info = clientInfo.getInfo();

    if (config.headers) {
      config.headers['Ip'] = info.ip;
      config.headers['Client'] = info.browser;
      config.headers['OS'] = info.os;
      config.headers['Device'] = info.device;
    }

    config.withCredentials = true;

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

axiosFileInstance.interceptors.response.use(
  (response: AxiosResponse) => response
);

export default axiosFileInstance;
