import axios from 'axios';

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  '';

/**
 * PUBLIC_INTERFACE
 * createApiClient
 * Create an Axios instance configured with base URL and auth token injection.
 * Attaches Authorization header if a token exists in localStorage under 'sb_token'.
 */
export function createApiClient() {
  const instance = axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('sb_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor for basic error normalization
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        // Optionally trigger global logout later
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

const apiClient = createApiClient();
export default apiClient;
