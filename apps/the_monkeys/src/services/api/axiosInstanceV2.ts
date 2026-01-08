import { getAllRequestHeaders } from '@/utils/requestHeaders';
import axios from 'axios';

import { setupRefreshInterceptor } from './interceptors';

const axiosInstanceV2 = axios.create({
  baseURL: '/api/v2',
  timeout: 30000,
});

axiosInstanceV2.interceptors.request.use(
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

setupRefreshInterceptor(axiosInstanceV2);

export default axiosInstanceV2;
