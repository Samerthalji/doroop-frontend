import axios from 'axios';
import { clearSession } from '../utils/session';
import { isDemoMode } from '../demo/demoMode';

/**
 * Every request uses a relative "/api" path so it is same-origin:
 *  - development: CRA's "proxy" field in package.json forwards it to the backend
 *  - production : the rewrite in vercel.json forwards it to the backend
 * Because the browser never talks to the backend domain directly, no CORS
 * configuration is needed on the server.
 *
 * Set REACT_APP_API_ROOT to an absolute URL (e.g. https://my-api.com/api)
 * if you host the backend somewhere that does allow CORS.
 */
export const API_ROOT = process.env.REACT_APP_API_ROOT || '/api';
export const API_V1 = `${API_ROOT}/v1`;

// Endpoints that must NOT carry a Bearer token and must NOT trigger a token refresh.
const AUTH_ENDPOINTS =
  /(^|\/)auth\/(login|regester|register|verify-email|forgot-password|verify-reset-code|reset-password-final|refresh-token)/i;
const isAuthEndpoint = (url = '') => AUTH_ENDPOINTS.test(url);

const apiClient = axios.create({
  baseURL: API_V1,
  headers: { 'Content-Type': 'application/json' },
});

// 1. Demo mode: answer from local sample data (loaded lazily, so it adds nothing to
//    the main bundle). Otherwise attach the access token to authenticated requests.
apiClient.interceptors.request.use((config) => {
  if (isDemoMode()) {
    config.adapter = (cfg) => import('../demo/demoAdapter').then((m) => m.demoAdapter(cfg));
    return config;
  }
  const token = localStorage.getItem('token');
  if (token && !isAuthEndpoint(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. On 401, refresh the access token once and replay the failed request.
//    A shared promise makes parallel 401s wait for a single refresh call.
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) return Promise.reject(new Error('No refresh token available'));

    refreshPromise = axios
      .post(`${API_V1}/Auth/refresh-token`, { refreshToken })
      .then((res) => {
        // The backend may answer in camelCase or PascalCase.
        const accessToken = res.data.accessToken || res.data.AccessToken;
        const newRefreshToken = res.data.refreshToken || res.data.RefreshToken;
        if (!accessToken) throw new Error('Unexpected refresh-token response');

        localStorage.setItem('token', accessToken);
        if (newRefreshToken) localStorage.setItem('refresh', newRefreshToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isUnauthorized = error.response?.status === 401;

    // Anonymous visitor (no session at all): just surface the error.
    const hasSession = localStorage.getItem('token') || localStorage.getItem('refresh');

    if (isUnauthorized && hasSession && original && !original._retry && !isAuthEndpoint(original.url)) {
      original._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${accessToken}`;
        // Not awaited on purpose: if the replayed request fails for a reason
        // other than auth, that error must not be treated as a failed refresh.
        return apiClient(original);
      } catch (refreshError) {
        clearSession();
        if (window.location.pathname !== '/login') window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
