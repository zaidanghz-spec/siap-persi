import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { getTotalFromScores } from '../utils/scoring';

const AppStoreContext = createContext(null);
const STATUS = { SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected', PUBLISHED: 'published' };

export function AppStoreProvider({ children }) {
  const [hospitals, setHospitals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [publishedRankings, setPublishedRankings] = useState([]);
  const [patientSurveys, setPatientSurveys] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Load all data on mount ───────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const [h, sub, rank, sv, n, e] = await Promise.all([
        api.getHospitals(),
        api.getSubmissions(),
        api.getRankings(),
        api.getSurveys(),
        api.getNews(),
        api.getEvents(),
      ]);
      setHospitals(h);
      setSubmissions(sub);
      setPublishedRankings(rank);
      setPatientSurveys(sv);
      setNews(n);
      setEvents(e);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ─── Hospital Account Management ──────────────────────────
  const createHospitalAccount = useCallback(async ({ hospitalName, province, departments, email, password }) => {
    const hospitalId = `h_${Date.now()}`;
    const userId = `u_${Date.now() + 1}`;
    await api.createHospital({
      id: hospitalId, name: hospitalName, province,
      departments: departments || [],
      created_at: new Date().toISOString().split('T')[0],
    });
    await api.createUser({
      id: userId, email, password,
      name: `Tim Admin ${hospitalName}`,
      role: 'hospital', hospitalId,
    });
    await refresh();
    return hospitalId;
  }, [refresh]);

  const deleteHospitalAccount = useCallback(async (hospitalId) => {
    await api.deleteHospital(hospitalId);
    await refresh();
  }, [refresh]);

  const getHospital = useCallback((hospitalId) => {
    return hospitals.find((h) => h.id === hospitalId) || null;
  }, [hospitals]);

  // ─── Hospital Profile ─────────────────────────────────────
  const updateHospitalProfile = useCallback(async (hospitalId, profileData) => {
    const current = hospitals.find((h) => h.id === hospitalId);
    const merged = { ...(current?.profile || {}), ...profileData };
    await api.updateProfile(hospitalId, merged);
    await refresh();
  }, [hospitals, refresh]);

  // ─── Patient Survey Management ────────────────────────────
  const createSurveyToken = useCallback(async ({ hospitalId, patientName, rmNumber, department }) => {
    const token = `srv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await api.createSurvey({ id: token, hospitalId, patientName, rmNumber, department });
    await refresh();
    return token;
  }, [refresh]);

  const submitSurveyResponse = useCallback(async (token, premAnswers, promAnswers, premScore, promScore, totalPrmScore) => {
    await api.submitSurvey(token, { premAnswers, promAnswers, premScore, promScore, totalPrmScore });
    await refresh();
  }, [refresh]);

  const getSurvey = useCallback(async (token) => {
    try {
      return await api.getSurveyByToken(token);
    } catch { return null; }
  }, []);

  const deleteSurvey = useCallback(async (token) => {
    await api.deleteSurvey(token);
    await refresh();
  }, [refresh]);

  // ─── Submission Management ────────────────────────────────
  const createSubmission = useCallback(async ({ hospitalId, rsbkData, auditData, prmData, scores }) => {
    const subId = `sub_${Date.now()}`;
    const hospital = hospitals.find((h) => h.id === hospitalId);
    await api.createSubmission({
      id: subId, hospitalId,
      hospitalName: hospital?.name || 'Unknown',
      province: hospital?.province || '',
      departments: hospital?.departments || [],
      rsbkData, auditData, prmData, scores,
      status: STATUS.SUBMITTED,
    });
    await refresh();
    return subId;
  }, [hospitals, refresh]);

  const updateSubmissionStatus = useCallback(async (subId, status, reviewNote = '') => {
    await api.updateSubmission(subId, { status, reviewNote });
    await refresh();
  }, [refresh]);

  // ─── Publish to Public Rankings ───────────────────────────
  const publishSubmission = useCallback(async (subId) => {
    const sub = submissions.find((s) => s.id === subId);
    if (!sub) return;
    const totalScore = getTotalFromScores(sub.scores);
    await api.publishRanking({
      id: `r_${Date.now()}`,
      hospitalId: sub.hospitalId, hospitalName: sub.hospitalName,
      province: sub.province, departments: sub.departments,
      scores: sub.scores, totalScore,
    });
    await api.updateSubmission(subId, { status: STATUS.PUBLISHED, reviewNote: '' });
    await refresh();
  }, [submissions, refresh]);

  const unpublishHospital = useCallback(async (hospitalId) => {
    await api.unpublishRanking(hospitalId);
    await refresh();
  }, [refresh]);

  // ─── News Management ──────────────────────────────────────
  const addNews = useCallback(async ({ title, summary, content, category, imageUrl }) => {
    await api.createNews({
      id: `news_${Date.now()}`, title, summary, content, category,
      imageUrl: imageUrl || '',
      date: new Date().toISOString().split('T')[0],
    });
    await refresh();
  }, [refresh]);

  const updateNews = useCallback(async (id, data) => {
    await api.updateNews(id, data);
    await refresh();
  }, [refresh]);

  const deleteNews = useCallback(async (id) => {
    await api.deleteNews(id);
    await refresh();
  }, [refresh]);

  // ─── Events Management ────────────────────────────────────
  const addEvent = useCallback(async ({ title, date, location, description, link }) => {
    await api.createEvent({
      id: `evt_${Date.now()}`, title, date, location, description,
      link: link || '',
    });
    await refresh();
  }, [refresh]);

  const updateEvent = useCallback(async (id, data) => {
    await api.updateEvent(id, data);
    await refresh();
  }, [refresh]);

  const deleteEvent = useCallback(async (id) => {
    await api.deleteEvent(id);
    await refresh();
  }, [refresh]);

  // ─── Value ────────────────────────────────────────────────
  const value = {
    hospitals, submissions, publishedRankings, patientSurveys, news, events, loading,
    refresh,
    createHospitalAccount, deleteHospitalAccount, getHospital,
    updateHospitalProfile,
    createSurveyToken, submitSurveyResponse, getSurvey, deleteSurvey,
    createSubmission, updateSubmissionStatus, publishSubmission, unpublishHospital,
    addNews, updateNews, deleteNews,
    addEvent, updateEvent, deleteEvent,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
