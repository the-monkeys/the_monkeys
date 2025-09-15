import clientInfo from '@/utils/clientInfo';
import axios from 'axios';

const axiosInstanceV2 = axios.create({
  baseURL: '/api/v2',
  timeout: 30000,
});

axiosInstanceV2.interceptors.request.use(
  async (config) => {
    try {
      const info = await clientInfo.getInfoSafe();

      if (config.headers) {
        config.headers['Ip'] = info.ip;
      }

      config.withCredentials = true;
    } catch (error) {
      console.warn('Failed to add client info to request:', error);

      if (config.headers) {
        config.headers['Ip'] = 'unknown';
      }
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

axiosInstanceV2.interceptors.response.use(
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

export default axiosInstanceV2;
