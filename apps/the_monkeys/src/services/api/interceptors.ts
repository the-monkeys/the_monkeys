import { AxiosInstance } from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

export const setupRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/refresh')
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // The refresh endpoint is always /api/v1/auth/refresh. Set baseURL
          // explicitly for this one call so it is NOT double-prefixed: the
          // instance baseURL is already '/api/v1', and passing a leading-slash
          // path here would resolve to '/api/v1/api/v1/auth/refresh' (404),
          // silently breaking transparent re-auth on every 401 and surfacing a
          // spurious failure to the caller (e.g. a create that actually needs
          // a token refresh would appear to fail even when it could succeed).
          await instance.post('/auth/refresh', null, { baseURL: '/api/v1' });
          isRefreshing = false;
          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          // Optional: Redirect to login or handled by the calling component
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
