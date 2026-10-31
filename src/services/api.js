import axios from 'axios';

// Vite environment variable with safe fallback to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000, // 35s timeout for AI generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for structured error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected error occurred.';
    let isNetworkError = false;

    if (!error.response) {
      // Network error or timeout (backend not running or connection refused)
      isNetworkError = true;
      if (error.code === 'ECONNABORTED') {
        friendlyMessage = 'The request timed out while generating the summary. The AI model took longer than 35 seconds to respond.';
      } else {
        friendlyMessage = `Cannot connect to the backend server at ${API_BASE_URL.replace('/api', '')}. Please verify your Node.js/Express server is running.`;
      }
    } else {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400) {
        friendlyMessage = data?.message || 'Invalid request. Please provide valid text input to summarize.';
      } else if (status === 401 || status === 403) {
        friendlyMessage = data?.message || 'Authentication failed. Please verify the Gemini API key in your backend .env file.';
      } else if (status === 429) {
        friendlyMessage = data?.message || 'Gemini API quota or rate limit exceeded. Please wait a moment and try again.';
      } else if (status >= 500) {
        friendlyMessage = data?.message || 'Internal server error occurred while processing summary with Gemini.';
      } else {
        friendlyMessage = data?.message || `Request failed with status ${status}.`;
      }
    }

    const enhancedError = new Error(friendlyMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.isNetworkError = isNetworkError;
    enhancedError.baseUrl = API_BASE_URL;

    return Promise.reject(enhancedError);
  }
);

/**
 * Check backend connection status
 * @returns {Promise<{ online: boolean, message?: string }>}
 */
export async function checkBackendHealth() {
  try {
    // Primary health endpoint: /api/health
    const res = await axios.get(`${API_BASE_URL}/health`, { timeout: 3500 });
    return { online: true, status: res.status, data: res.data };
  } catch {
    try {
      // Fallback: /health on root
      const rootUrl = API_BASE_URL.replace(/\/api\/?$/, '');
      const res = await axios.get(`${rootUrl}/health`, { timeout: 3500 });
      return { online: true, status: res.status, data: res.data };
    } catch {
      return { online: false, message: 'Backend unreachable at ' + API_BASE_URL };
    }
  }
}

export { API_BASE_URL };
export default apiClient;
