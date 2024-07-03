// src/api/axiosInstanceNoAuth.ts
import { API_URL } from '@/constants/api';
import axios from 'axios';

const axiosInstanceNoAuth = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default axiosInstanceNoAuth;
