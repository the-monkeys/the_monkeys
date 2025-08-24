import clientInfo from '@/utils/clientInfo';
import axios from 'axios';

const axiosInstanceNoAuth = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

axiosInstanceNoAuth.interceptors.request.use(
  async (config) => {
    const info = clientInfo.getInfo();

    if (config.headers) {
      config.headers['Ip'] = info.ip;
      config.headers['Client'] = info.browser;
      config.headers['OS'] = info.os;
      config.headers['Device'] = info.device;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstanceNoAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // For example, redirect to login if 401
      // if (error.response.status === 401) {
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceNoAuth;
