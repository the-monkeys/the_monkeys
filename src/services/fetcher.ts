import { API_URL } from '@/constants/api';
import axios, { Axios, AxiosInstance } from 'axios';

// Create axios instance for public API requests
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetcher function for authenticated API requests
export const authFetcher = async (
  url: string,
  axiosAuthInstance: AxiosInstance
) => {
  try {
    const response = await axiosAuthInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching authenticated data:', error);
    throw error;
  }
};

// Fetcher function for public API requests
export const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
