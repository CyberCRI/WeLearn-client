import axios from 'axios';
import keycloak from '@/utils/keycloak';
// only used inside the handlers, so the cycle (auth store → fetch → api) is safe at load time
import { useAuthStore } from '@/stores/auth';

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

// refreshes the keycloak token if needed: shared by the axios instance and fetchStream
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = { 'X-Session-Id': getSessionIdFromStorage() };

  if (!keycloak.authenticated) return headers;

  try {
    await keycloak.updateToken(30);
  } catch (error) {
    // the session is over: don't send the request without a token while the page redirects
    useAuthStore().logout({ isExpired: true });
    throw error;
  }
  if (keycloak.token) headers.Authorization = `Bearer ${keycloak.token}`;

  return headers;
};

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
    config.headers.set(await getAuthHeaders());
    return config;
  },
  (error) => Promise.reject(error)
);

// shared by the axios instance and fetchStream. a guest's 401 is just an error, and logging out
// must never throw, so the caller always gets the original error
export const handleUnauthorized = (status?: number): void => {
  if (status !== 401 || !keycloak.authenticated) return;
  try {
    useAuthStore().logout({ isExpired: true });
  } catch (logoutError) {
    console.error('Logout after a 401 failed:', logoutError);
  }
};

http.interceptors.response.use(
  (response) => response,
  (error) => {
    handleUnauthorized(error.response?.status);
    return Promise.reject(error);
  }
);

export default http;
