import axiosInstance from './api/axiosInstance';
import axiosInstanceNoAuth from './api/axiosInstanceNoAuth';
import axiosInstanceNoAuthV2 from './api/axiosInstanceNoAuthV2';
import axiosInstanceV2 from './api/axiosInstanceV2';

// Fetcher function for authenticated API requests
export const authFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

// Fetcher function for public API requests
export const fetcher = async (url: string) => {
  try {
    const response = await axiosInstanceNoAuth.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error, url);
    throw error;
  }
};

export const authFetcherV2 = (url: string) =>
  axiosInstanceV2.get(url).then((res) => res.data);

export const fetcherV2 = async (url: string) => {
  try {
    const response = await axiosInstanceNoAuthV2.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error, url);
    throw error;
  }
};
