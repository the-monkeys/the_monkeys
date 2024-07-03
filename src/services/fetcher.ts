import axiosInstance from './api/axiosInstance';
import axiosInstanceNoAuth from './api/axiosInstanceNoAuth';

// Fetcher function for authenticated API requests
export const authFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

// Fetcher function for public API requests
export const fetcher = async (url: string) => {
  try {
    const response = await axiosInstanceNoAuth.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
