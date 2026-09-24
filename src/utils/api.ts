import axios from 'axios';
import keycloak from '@/utils/keycloak';

const getSessionIdFromStorage = () => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    return sessionId ? JSON.parse(sessionId) : '';
  } catch (error) {
    return '';
  }
};

const API_BASE = import.meta.env.VITE_API_BASE;
const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/v1';
const WL_API_KEY = import.meta.env.VITE_WL_API_KEY;

const http = axios.create({
  baseURL: `${API_BASE}${API_VERSION}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': WL_API_KEY
  }
});

http.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      try {
        await keycloak.updateToken(30);
        config.headers['X-Session-Id'] = getSessionIdFromStorage();
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      } catch {
        keycloak.logout();
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      keycloak.logout();
    }
    return Promise.reject(error);
  }
);

export default http;
