import axios from 'axios';

const BASE_URL = "http://localhost:8000/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post(`${BASE_URL}token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', res.data.access);
        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access;

        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access;
        return axiosInstance(originalRequest); // Retry original request
      } catch (err) {
        console.error("Refresh token expired or invalid. Logging out.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // force logout
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
