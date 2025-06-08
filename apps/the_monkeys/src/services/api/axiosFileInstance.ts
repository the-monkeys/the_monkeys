import axios from 'axios';
import Bowser from 'bowser';
import { publicIpv4 } from 'public-ip';

const axiosFileInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

axiosFileInstance.interceptors.request.use(
  async (config) => {
    // Get public IP address
    const ip = await publicIpv4();
    config.headers['Ip'] = ip;

    // Detect client browser and OS
    const browser = Bowser.getParser(window.navigator.userAgent);
    const client = browser.getBrowserName();
    const os = browser.getOSName();
    config.headers['Client'] = client;
    config.headers['OS'] = os;
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosFileInstance.interceptors.response.use((response) => response);

export default axiosFileInstance;
