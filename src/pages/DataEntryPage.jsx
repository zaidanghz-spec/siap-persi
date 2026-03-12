import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/AppStore';
import { RSBK_DATA, AUDIT_DATA, PRM_DATA, DEPARTMENTS, INITIAL_WEIGHTS } from '../data/mockData';
import { computeAllScores } from '../utils/scoring';
import FormStepper from '../components/form/FormStepper';
import StepRSBK from '../components/form/StepRSBK';
import StepClinicalAudit from '../components/form/StepClinicalAudit';
import StepPRM from '../components/form/StepPRM';
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Building2, HeartPulse, Brain, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const REQUIRED_PROFILE_FIELDS = ['namaRS', 'alamat', 'kota', 'provinsi', 'telepon', 'email', 'tipeRS', 'akreditasi', 'namaDirektur', 'emailDirektur'];

function isProfileComplete(hospital) {
  if (!hospital?.profile) return false;
  return REQUIRED_PROFILE_FIELDS.every((f) => hospital.profile[f] && String(hospital.profile[f]).trim() !== '');
}

export default function DataEntryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSubmission, getHospital } = useAppStore();

  const hospital = getHospital(user?.hospitalId);
  const selectedDepts = hospital?.departments || [];
  const profileDone = isProfileComplete(hospital);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: RSBK
  const [rsbkQuantities, setRsbkQuantities] = useState({});
  const handleQuantityChange = useCallback((itemId, value) => {
    setRsbkQuantities((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  // Step 2: Audit
  const [auditValues, setAuditValues] = useState({});
  const handleAuditChange = useCallback((indicatorId, value) => {
    setAuditValues((prev) => ({ ...prev, [indicatorId]: value }));
  }, []);

  // Step 3: PRM
  const [premAnswers, setPremAnswers] = useState({});
  const [promAnswers, setPromAnswers] = useState({});
  const handlePremAnswer = useCallback((qId, val) => {
    setPremAnswers((prev) => ({ ...prev, [qId]: val }));
  }, []);
  const handlePromAnswer = useCallback((qId, val) => {
    setPromAnswers((prev) => ({ ...prev, [qId]: val }));
  }, []);

  const handleSubmit = () => {
    const scores = computeAllScores(
      rsbkQuantities, RSBK_DATA,
      auditValues, AUDIT_DATA,
      premAnswers, promAnswers, PRM_DATA,
      selectedDepts,
      INITIAL_WEIGHTS
    );
    createSubmission({
      hospitalId: user.hospitalId,
      rsbkData: rsbkQuantities,
      auditData: auditValues,
      prmData: { prem: premAnswers, prom: promAnswers },
      scores: { rsbk: scores.rsbk, audit: scores.audit, prm: scores.prm },
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Berhasil Dikirim!</h2>
        <p className="text-sm text-ice-400 mb-8">
          Data <span className="text-white font-medium">{hospital?.name}</span> telah dikirim untuk review tim evaluator PERSI.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate('/portal/dashboard')}
            className="px-6 py-2.5 rounded-xl bg-teal-500/15 text-teal-400 text-sm font-medium hover:bg-teal-500/25 transition-colors cursor-pointer">
            Kembali ke Dashboard
          </button>
          <button onClick={() => { setSubmitted(false); setStep(1); setRsbkQuantities({}); setAuditValues({}); setPremAnswers({}); setPromAnswers({}); }}
            className="px-6 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-ice-400 text-sm font-medium hover:text-white transition-colors cursor-pointer">
            Kirim Data Baru
          </button>
        </div>
      </motion.div>
    );
  }

  if (!profileDone) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-gold-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Lengkapi Profil RS Terlebih Dahulu</h2>
        <p className="text-sm text-ice-400 mb-8">
          Sebelum mengisi assessment ranking, Anda harus melengkapi data profil rumah sakit.
        </p>
        <button onClick={() => navigate('/portal/profile')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer">
          <Building2 className="w-4 h-4 inline mr-2" /> Isi Profil RS Sekarang
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pengisian Data</h1>
        <p className="text-sm text-ice-400 mt-1">
          {hospital?.name} — Kumpulkan data RSBK, Audit Klinis, dan PRM
        </p>
      </div>

      <div className="glass-card p-5">
        <FormStepper currentStep={step} />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
          {step === 1 && (
            <StepRSBK departments={selectedDepts} quantities={rsbkQuantities} onQuantityChange={handleQuantityChange} />
          )}
          {step === 2 && (
            <StepClinicalAudit departments={selectedDepts} auditValues={auditValues} onAuditChange={handleAuditChange} />
          )}
          {step === 3 && (
            <StepPRM departments={selectedDepts} premAnswers={premAnswers} promAnswers={promAnswers}
              onPremAnswer={handlePremAnswer} onPromAnswer={handlePromAnswer} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => setStep((s) => s - 1)} disabled={step === 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-ice-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        {step < 3 ? (
          <button onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cobalt-600 to-teal-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            Selanjutnya <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            <Send className="w-4 h-4" /> Kirim untuk Review
          </button>
        )}
      </div>
    </div>
  );
}
