import clientInfo from '@/utils/clientInfo';
import { getAllRequestHeaders } from '@/utils/requestHeaders';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const analyticsHeaders = await getAllRequestHeaders();

      if (config.headers && typeof config.headers.set === 'function') {
        for (const [key, value] of Object.entries(analyticsHeaders)) {
          config.headers.set(key, value);
        }
      }

      config.withCredentials = true;
    } catch (error) {
      console.warn('Failed to add analytics headers:', error);

      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('X-IP', 'unknown');
        config.headers.set('X-Client', 'unknown');
        config.headers.set('X-OS', 'unknown');
        config.headers.set('X-Device', 'unknown');
      }
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
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

export default axiosInstance;
