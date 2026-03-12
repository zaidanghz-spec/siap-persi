// ═══════════ API Client — talks to Netlify Functions → Neon ═══════════
const BASE = '/api';

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

const api = {
  // Auth
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: { email, password } }),

  // Users
  getUsers: () => apiFetch('/users'),
  createUser: (data) => apiFetch('/users', { method: 'POST', body: data }),
  deleteUsersByHospital: (hospitalId) => apiFetch(`/users/${hospitalId}`, { method: 'DELETE' }),

  // Hospitals
  getHospitals: () => apiFetch('/hospitals'),
  createHospital: (data) => apiFetch('/hospitals', { method: 'POST', body: data }),
  updateProfile: (hospitalId, profile) => apiFetch(`/hospitals/${hospitalId}/profile`, { method: 'PUT', body: { profile } }),
  deleteHospital: (hospitalId) => apiFetch(`/hospitals/${hospitalId}`, { method: 'DELETE' }),

  // Submissions
  getSubmissions: () => apiFetch('/submissions'),
  createSubmission: (data) => apiFetch('/submissions', { method: 'POST', body: data }),
  updateSubmission: (subId, data) => apiFetch(`/submissions/${subId}`, { method: 'PUT', body: data }),

  // Rankings
  getRankings: () => apiFetch('/rankings'),
  publishRanking: (data) => apiFetch('/rankings', { method: 'POST', body: data }),
  unpublishRanking: (hospitalId) => apiFetch(`/rankings/${hospitalId}`, { method: 'DELETE' }),

  // Surveys
  getSurveys: () => apiFetch('/surveys'),
  getSurveyByToken: (token) => apiFetch(`/surveys/${token}/token`),
  createSurvey: (data) => apiFetch('/surveys', { method: 'POST', body: data }),
  submitSurvey: (token, data) => apiFetch(`/surveys/${token}`, { method: 'PUT', body: data }),
  deleteSurvey: (token) => apiFetch(`/surveys/${token}`, { method: 'DELETE' }),

  // News
  getNews: () => apiFetch('/news'),
  createNews: (data) => apiFetch('/news', { method: 'POST', body: data }),
  updateNews: (id, data) => apiFetch(`/news/${id}`, { method: 'PUT', body: data }),
  deleteNews: (id) => apiFetch(`/news/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: () => apiFetch('/events'),
  createEvent: (data) => apiFetch('/events', { method: 'POST', body: data }),
  updateEvent: (id, data) => apiFetch(`/events/${id}`, { method: 'PUT', body: data }),
  deleteEvent: (id) => apiFetch(`/events/${id}`, { method: 'DELETE' }),

  // Setup
  setupDb: () => apiFetch('/setup-db'),
};

export default api;
