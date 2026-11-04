/**
 * REST API client for StudentHub Express & MongoDB Backend
 * Gracefully detects backend availability and handles JWT token authentication.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const getAuthToken = () => {
  try {
    return (
      sessionStorage.getItem('studenthub_jwt_token') ||
      localStorage.getItem('studenthub_jwt_token') ||
      null
    );
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem('studenthub_jwt_token', token);
    } else {
      sessionStorage.removeItem('studenthub_jwt_token');
      localStorage.removeItem('studenthub_jwt_token');
    }
  } catch {}
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `API error (${response.status})`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  // Check if Express & MongoDB backend is currently running
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  },
};
