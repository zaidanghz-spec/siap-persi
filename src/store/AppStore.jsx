import { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_WEIGHTS, STATUS } from '../data/mockData';
import { getTotalFromScores } from '../utils/scoring';

const AppStoreContext = createContext(null);

// ─── localStorage helpers ────────────────────────────────────
const STORAGE_KEY = 'siap_persi_store';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Migration: ensure new fields exist in old stored data
      if (!data.news) data.news = [];
      if (!data.events) data.events = [];
      if (!data.patientSurveys) data.patientSurveys = [];
      return data;
    }
  } catch {}
  return null;
}

function saveStore(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ─── Default state (empty) ───────────────────────────────────
const DEFAULT_STATE = {
  users: [
    { id: 'u_admin', email: 'admin@persi.or.id', password: 'admin123', name: 'Dr. Evaluator PERSI', role: 'admin', hospitalId: null },
  ],
  hospitals: [],
  submissions: [],
  publishedRankings: [],
  patientSurveys: [],
  // Content management
  news: [],
  events: [],
};

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(() => {
    const stored = loadStore();
    if (stored) return stored;
    // First load — persist DEFAULT_STATE so auth can read it from localStorage
    saveStore(DEFAULT_STATE);
    return DEFAULT_STATE;
  });

  const update = useCallback((fn) => {
    setState((prev) => {
      const next = fn(prev);
      saveStore(next);
      return next;
    });
  }, []);

  // ─── User / Account Management ─────────────────────────────
  const createHospitalAccount = useCallback(({ hospitalName, province, departments, email, password }) => {
    const hospitalId = `h_${Date.now()}`;
    const userId = `u_${Date.now()}`;
    update((s) => ({
      ...s,
      hospitals: [...s.hospitals, {
        id: hospitalId, name: hospitalName, province, departments,
        createdAt: new Date().toISOString().split('T')[0],
      }],
      users: [...s.users, {
        id: userId, email, password, name: `Tim Admin ${hospitalName}`,
        role: 'hospital', hospitalId,
      }],
    }));
    return hospitalId;
  }, [update]);

  const deleteHospitalAccount = useCallback((hospitalId) => {
    update((s) => ({
      ...s,
      hospitals: s.hospitals.filter((h) => h.id !== hospitalId),
      users: s.users.filter((u) => u.hospitalId !== hospitalId),
      submissions: s.submissions.filter((sub) => sub.hospitalId !== hospitalId),
      publishedRankings: s.publishedRankings.filter((r) => r.hospitalId !== hospitalId),
    }));
  }, [update]);

  // Read fresh from localStorage to avoid stale closures
  const getUser = useCallback((email, password) => {
    const stored = loadStore();
    const users = stored?.users || state.users;
    return users.find((u) => u.email === email && u.password === password) || null;
  }, [state.users]);

  const getHospital = useCallback((hospitalId) => {
    const stored = loadStore();
    const hospitals = stored?.hospitals || state.hospitals;
    return hospitals.find((h) => h.id === hospitalId) || null;
  }, [state.hospitals]);

  // ─── Hospital Profile ─────────────────────────────────────
  const updateHospitalProfile = useCallback((hospitalId, profileData) => {
    update((s) => ({
      ...s,
      hospitals: s.hospitals.map((h) =>
        h.id === hospitalId ? { ...h, profile: { ...h.profile, ...profileData } } : h
      ),
    }));
  }, [update]);

  // ─── Patient Survey Management ─────────────────────────────
  const createSurveyToken = useCallback(({ hospitalId, patientName, rmNumber, department }) => {
    const token = `srv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    update((s) => ({
      ...s,
      patientSurveys: [...(s.patientSurveys || []), {
        id: token, hospitalId, patientName, rmNumber, department,
        status: 'pending', premAnswers: null, promAnswers: null,
        premScore: null, promScore: null, totalPrmScore: null,
        createdAt: new Date().toISOString().split('T')[0],
        completedAt: null,
      }],
    }));
    return token;
  }, [update]);

  const submitSurveyResponse = useCallback((token, premAnswers, promAnswers, premScore, promScore, totalPrmScore) => {
    update((s) => ({
      ...s,
      patientSurveys: (s.patientSurveys || []).map((sv) =>
        sv.id === token ? {
          ...sv, status: 'completed', premAnswers, promAnswers,
          premScore, promScore, totalPrmScore,
          completedAt: new Date().toISOString().split('T')[0],
        } : sv
      ),
    }));
  }, [update]);

  const getSurvey = useCallback((token) => {
    const stored = loadStore();
    const surveys = stored?.patientSurveys || state.patientSurveys || [];
    return surveys.find((sv) => sv.id === token) || null;
  }, [state.patientSurveys]);

  const deleteSurvey = useCallback((token) => {
    update((s) => ({ ...s, patientSurveys: (s.patientSurveys || []).filter((sv) => sv.id !== token) }));
  }, [update]);

  // ─── Submission Management ─────────────────────────────────
  const createSubmission = useCallback(({ hospitalId, rsbkData, auditData, prmData, scores }) => {
    const subId = `sub_${Date.now()}`;
    const hospital = state.hospitals.find((h) => h.id === hospitalId);
    update((s) => ({
      ...s,
      submissions: [...s.submissions, {
        id: subId, hospitalId,
        hospitalName: hospital?.name || 'Unknown',
        province: hospital?.province || '',
        departments: hospital?.departments || [],
        rsbkData, auditData, prmData, scores,
        status: STATUS.SUBMITTED,
        submittedAt: new Date().toISOString().split('T')[0],
        reviewNote: '',
        reviewedAt: null,
      }],
    }));
    return subId;
  }, [state.hospitals, update]);

  const updateSubmissionStatus = useCallback((subId, status, reviewNote = '') => {
    update((s) => ({
      ...s,
      submissions: s.submissions.map((sub) =>
        sub.id === subId ? { ...sub, status, reviewNote, reviewedAt: new Date().toISOString().split('T')[0] } : sub
      ),
    }));
  }, [update]);

  // ─── Publish to Public Rankings ────────────────────────────
  const publishSubmission = useCallback((subId) => {
    const sub = state.submissions.find((s) => s.id === subId);
    if (!sub) return;

    const totalScore = getTotalFromScores(sub.scores);

    update((s) => {
      // Remove old ranking for this hospital if exists
      const filtered = s.publishedRankings.filter((r) => r.hospitalId !== sub.hospitalId);
      return {
        ...s,
        submissions: s.submissions.map((x) =>
          x.id === subId ? { ...x, status: STATUS.PUBLISHED } : x
        ),
        publishedRankings: [...filtered, {
          id: `r_${Date.now()}`,
          hospitalId: sub.hospitalId,
          hospitalName: sub.hospitalName,
          province: sub.province,
          departments: sub.departments,
          scores: sub.scores,
          totalScore,
          publishedAt: new Date().toISOString().split('T')[0],
        }].sort((a, b) => b.totalScore - a.totalScore),
      };
    });
  }, [state.submissions, update]);

  const unpublishHospital = useCallback((hospitalId) => {
    update((s) => ({
      ...s,
      publishedRankings: s.publishedRankings.filter((r) => r.hospitalId !== hospitalId),
    }));
  }, [update]);

  // ─── News Management ───────────────────────────────────────
  const addNews = useCallback(({ title, summary, content, category, imageUrl }) => {
    update((s) => ({
      ...s,
      news: [{ id: `news_${Date.now()}`, title, summary, content, category, imageUrl: imageUrl || '', date: new Date().toISOString().split('T')[0] }, ...s.news],
    }));
  }, [update]);

  const updateNews = useCallback((id, data) => {
    update((s) => ({ ...s, news: s.news.map((n) => n.id === id ? { ...n, ...data } : n) }));
  }, [update]);

  const deleteNews = useCallback((id) => {
    update((s) => ({ ...s, news: s.news.filter((n) => n.id !== id) }));
  }, [update]);

  // ─── Events Management ─────────────────────────────────────
  const addEvent = useCallback(({ title, date, location, description, link }) => {
    update((s) => ({
      ...s,
      events: [...s.events, { id: `evt_${Date.now()}`, title, date, location, description, link: link || '', createdAt: new Date().toISOString().split('T')[0] }]
        .sort((a, b) => a.date.localeCompare(b.date)),
    }));
  }, [update]);

  const updateEvent = useCallback((id, data) => {
    update((s) => ({ ...s, events: s.events.map((e) => e.id === id ? { ...e, ...data } : e) }));
  }, [update]);

  const deleteEvent = useCallback((id) => {
    update((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
  }, [update]);

  // ─── Reset (dev helper) ────────────────────────────────────
  const resetStore = useCallback(() => {
    setState(DEFAULT_STATE);
    saveStore(DEFAULT_STATE);
  }, []);

  const value = {
    ...state,
    createHospitalAccount, deleteHospitalAccount, getUser, getHospital,
    updateHospitalProfile,
    createSurveyToken, submitSurveyResponse, getSurvey, deleteSurvey,
    createSubmission, updateSubmissionStatus, publishSubmission, unpublishHospital,
    addNews, updateNews, deleteNews,
    addEvent, updateEvent, deleteEvent,
    resetStore,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
