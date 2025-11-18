import axios from 'axios';

const LOG_LEVEL = (process.env.REACT_APP_LOG_LEVEL || 'info').toLowerCase();
const canLog = (level) => {
  const weights = { error: 0, warn: 1, info: 2, debug: 3 };
  return (weights[level] ?? 2) <= (weights[LOG_LEVEL] ?? 2);
};

// Determine API base URL via environment variables
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
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('sb_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (canLog('debug')) {
      console.debug('[api][request]', config.method?.toUpperCase(), config.url, { params: config.params, data: config.data });
    }
    return config;
  });

  // Response interceptor for basic error normalization
  instance.interceptors.response.use(
    (response) => {
      if (canLog('debug')) {
        console.debug('[api][response]', response.status, response.config?.url);
      }
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      if (canLog('warn')) {
        console.warn('[api][error]', status, error?.response?.data || error?.message);
      }
      if (status === 401) {
        // handled by callers (e.g., ProtectedRoute) to re-auth when needed
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

const http = createApiClient();

/**
 * PUBLIC_INTERFACE
 * api — typed wrapper around backend endpoints.
 * All methods throw errors; UI layers should catch and show user-friendly messages.
 */
export const api = {
  // AUTH
  // PUBLIC_INTERFACE
  async register(email, password) {
    /** Register a new user. Returns { token, user }. */
    const res = await http.post('/auth/register', { email, password });
    return res.data;
  },
  // PUBLIC_INTERFACE
  async login(email, password) {
    /** Login with credentials. Returns { token, user }. */
    const res = await http.post('/auth/login', { email, password });
    return res.data;
  },
  // PUBLIC_INTERFACE
  async me() {
    /** Get current user profile using token. */
    const res = await http.get('/users/me');
    return res.data;
  },

  // MODULES/LESSONS/QUIZZES
  // PUBLIC_INTERFACE
  async listModules() {
    /** Get all modules. */
    const res = await http.get('/modules');
    return res.data;
  },
  // PUBLIC_INTERFACE
  async getModule(id) {
    /** Get a module by id. */
    const res = await http.get(`/modules/${encodeURIComponent(id)}`);
    return res.data;
  },
  // PUBLIC_INTERFACE
  async getLesson(id) {
    /** Get a lesson by id. */
    const res = await http.get(`/lessons/${encodeURIComponent(id)}`);
    return res.data;
  },
  // PUBLIC_INTERFACE
  async completeLesson(id) {
    /** Mark a lesson complete. */
    const res = await http.post(`/lessons/${encodeURIComponent(id)}/complete`);
    return res.data;
  },
  // PUBLIC_INTERFACE
  async startQuiz(moduleId) {
    /** Start a quiz attempt for a module (path param is module_id). */
    const res = await http.post(`/quizzes/${encodeURIComponent(moduleId)}/start`);
    return res.data;
  },
  // PUBLIC_INTERFACE
  async submitQuiz(id, answers) {
    /** Submit a quiz attempt with answers payload. */
    const res = await http.post(`/quizzes/${encodeURIComponent(id)}/submit`, { answers });
    return res.data;
  },

  // PROGRESS
  // PUBLIC_INTERFACE
  async getProgress() {
    /** Get overall progress for current user. */
    const res = await http.get('/progress');
    return res.data;
  },

  // MENTORSHIP
  // PUBLIC_INTERFACE
  async listMentors() {
    /** List available mentors. */
    const res = await http.get('/mentorship/mentors');
    return res.data;
  },
  // PUBLIC_INTERFACE
  async requestMentorship(payload) {
    /** Create a mentorship request. */
    const res = await http.post('/mentorship/requests', payload);
    return res.data;
  },

  // PORTFOLIO
  // PUBLIC_INTERFACE
  async getPortfolio() {
    /** Fetch current user's portfolio (array of items). */
    const res = await http.get('/portfolio');
    return res.data;
  },
  // PUBLIC_INTERFACE
  async createPortfolio(payload) {
    /** Create a portfolio entry. */
    const res = await http.post('/portfolio', payload);
    return res.data;
  },
  // PUBLIC_INTERFACE
  async updatePortfolio(id, payload) {
    /** Update portfolio entry by id. */
    const res = await http.put(`/portfolio/${encodeURIComponent(id)}`, payload);
    return res.data;
  },
  // PUBLIC_INTERFACE
  async deletePortfolio(id) {
    /** Delete portfolio entry by id. */
    const res = await http.delete(`/portfolio/${encodeURIComponent(id)}`);
    return res.data;
  },

  // NOTIFICATIONS (REST)
  // PUBLIC_INTERFACE
  async listNotifications() {
    /** Get notifications via REST. */
    const res = await http.get('/notifications');
    return res.data;
  },

  // JOB TOOLS
  // PUBLIC_INTERFACE
  async resumePreview(payload) {
    /** Generate resume preview. */
    const res = await http.post('/jobtools/resume/preview', payload);
    return res.data;
  },
  // PUBLIC_INTERFACE
  async interviewSimulate(payload) {
    /** Simulate an interview with given parameters. */
    const res = await http.post('/jobtools/interview/simulate', payload);
    return res.data;
  },
};

export default http;
