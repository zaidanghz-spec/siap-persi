import { useState, useCallback } from 'react';
import {
  RSBK_DATA,
  AUDIT_DATA,
  PRM_DATA,
  INITIAL_WEIGHTS,
  AUDIT_THRESHOLDS,
} from '../data/mockData';

/**
 * Config management hook — used by admin ConfigPage only.
 * Hospital/submission data is now in AppStore.
 */
export function useSupabase() {
  const [rsbkConfig, setRsbkConfig] = useState(RSBK_DATA);
  const [auditConfig, setAuditConfig] = useState(AUDIT_DATA);
  const [prmConfig, setPrmConfig] = useState(PRM_DATA);
  const [weights, setWeights] = useState(INITIAL_WEIGHTS);
  const [thresholds, setThresholds] = useState(AUDIT_THRESHOLDS);
  const [fillLogs] = useState([]);

  // --- RSBK Config CRUD ---
  const addRSBKItem = useCallback((dept, category, item) => {
    setRsbkConfig((prev) => ({
      ...prev,
      [dept]: { ...prev[dept], [category]: [...prev[dept][category], item] },
    }));
  }, []);

  const updateRSBKItem = useCallback((dept, category, itemId, updates) => {
    setRsbkConfig((prev) => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [category]: prev[dept][category].map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      },
    }));
  }, []);

  const deleteRSBKItem = useCallback((dept, category, itemId) => {
    setRsbkConfig((prev) => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [category]: prev[dept][category].filter((item) => item.id !== itemId),
      },
    }));
  }, []);

  // --- Audit Config CRUD ---
  const updateAuditIndicator = useCallback((dept, indicatorId, updates) => {
    setAuditConfig((prev) => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        indicators: prev[dept].indicators.map((ind) =>
          ind.id === indicatorId ? { ...ind, ...updates } : ind
        ),
      },
    }));
  }, []);

  const updateThreshold = useCallback((dept, key, value) => {
    setThresholds((prev) => ({
      ...prev,
      [dept]: { ...prev[dept], [key]: value },
    }));
  }, []);

  // --- PRM Config CRUD ---
  const addPREMQuestion = useCallback((question) => {
    setPrmConfig((prev) => ({
      ...prev,
      prem: { ...prev.prem, questions: [...prev.prem.questions, question] },
    }));
  }, []);

  const updatePREMQuestion = useCallback((qId, text) => {
    setPrmConfig((prev) => ({
      ...prev,
      prem: { ...prev.prem, questions: prev.prem.questions.map((q) => (q.id === qId ? { ...q, text } : q)) },
    }));
  }, []);

  const deletePREMQuestion = useCallback((qId) => {
    setPrmConfig((prev) => ({
      ...prev,
      prem: { ...prev.prem, questions: prev.prem.questions.filter((q) => q.id !== qId) },
    }));
  }, []);

  const addPROMQuestion = useCallback((dept, question) => {
    setPrmConfig((prev) => ({
      ...prev,
      prom: { ...prev.prom, questions: { ...prev.prom.questions, [dept]: [...(prev.prom.questions[dept] || []), question] } },
    }));
  }, []);

  const updatePROMQuestion = useCallback((dept, qId, text) => {
    setPrmConfig((prev) => ({
      ...prev,
      prom: { ...prev.prom, questions: { ...prev.prom.questions, [dept]: prev.prom.questions[dept].map((q) => (q.id === qId ? { ...q, text } : q)) } },
    }));
  }, []);

  const deletePROMQuestion = useCallback((dept, qId) => {
    setPrmConfig((prev) => ({
      ...prev,
      prom: { ...prev.prom, questions: { ...prev.prom.questions, [dept]: prev.prom.questions[dept].filter((q) => q.id !== qId) } },
    }));
  }, []);

  return {
    rsbkConfig, addRSBKItem, updateRSBKItem, deleteRSBKItem,
    auditConfig, updateAuditIndicator,
    thresholds, updateThreshold,
    prmConfig, addPREMQuestion, updatePREMQuestion, deletePREMQuestion,
    addPROMQuestion, updatePROMQuestion, deletePROMQuestion,
    weights,
    fillLogs,
  };
}
