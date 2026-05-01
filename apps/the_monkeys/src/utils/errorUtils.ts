import axios from 'axios';

export const isAuthError = (err: unknown) =>
  axios.isAxiosError(err) &&
  (err.response?.status === 401 || err.response?.status === 403);
