import axios from 'axios';
import { toast } from 'sonner';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Attach access token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle refresh token if access token expires
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.data.message) toast.error(error.response?.data.message)
    else toast.error(error?.message)

    if (error.response?.status === 401 && error.response?.data.message === 'jwt expired') {
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { token: localStorage.getItem('refreshToken') }, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return API.request(error.config);
      } catch (error) {
        console.error('Refresh token expired ', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace('/auth/login');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
