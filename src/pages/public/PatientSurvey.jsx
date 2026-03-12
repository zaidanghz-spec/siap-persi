import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../store/AppStore';
import { PRM_DATA, DEPARTMENTS } from '../../data/mockData';
import { Activity, Star, Check, AlertCircle, ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientSurvey() {
  const { token } = useParams();
  const { getSurvey, submitSurveyResponse, hospitals } = useAppStore();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0); // 0=intro, 1=prem, 2=prom, 3=done
  const [premAnswers, setPremAnswers] = useState({});
  const [promAnswers, setPromAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const sv = await getSurvey(token);
        if (!sv) setError('Link survey tidak valid atau sudah kadaluarsa.');
        else if (sv.status === 'completed') setError('Survey ini sudah diisi. Terima kasih!');
        else setSurvey(sv);
      } catch {
        setError('Link survey tidak valid atau sudah kadaluarsa.');
      }
      setLoading(false);
    }
    load();
  }, [token, getSurvey]);

  const hospital = useMemo(() => {
    if (!survey) return null;
    return hospitals.find((h) => h.id === survey.hospitalId);
  }, [survey, hospitals]);

  const deptName = survey ? (DEPARTMENTS.find((d) => d.id === survey.department)?.name || survey.department) : '';
  const premQuestions = PRM_DATA.prem.questions;
  const promQuestions = PRM_DATA.prom.questions[survey?.department] || [];
  const scale = PRM_DATA.scale;

  const premComplete = premQuestions.every((q) => premAnswers[q.id] !== undefined);
  const promComplete = promQuestions.every((q) => promAnswers[q.id] !== undefined);

  const calculateScores = () => {
    // PREM score: average of all answers / 5 * 100
    const premVals = Object.values(premAnswers);
    const premAvg = premVals.reduce((s, v) => s + v, 0) / premVals.length;
    const premScore = (premAvg / 5) * 100;

    // PROM score: average of all answers / 5 * 100 (handle inverted)
    const promVals = promQuestions.map((q) => {
      const val = promAnswers[q.id];
      return q.scaleInverted ? (6 - val) : val; // invert: 1→5, 2→4, etc.
    });
    const promAvg = promVals.reduce((s, v) => s + v, 0) / promVals.length;
    const promScore = (promAvg / 5) * 100;

    // Total PRM = PREM * 0.60 + PROM * 0.40
    const totalPrmScore = premScore * PRM_DATA.prem.weight + promScore * PRM_DATA.prom.weight;

    return { premScore, promScore, totalPrmScore };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const { premScore, promScore, totalPrmScore } = calculateScores();
    await submitSurveyResponse(token, premAnswers, promAnswers, premScore, promScore, totalPrmScore);
    setStep(3);
    setSubmitting(false);
  };

  // Loading
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Error
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl p-8 shadow-xl text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-lg font-bold text-slate-800 mb-2">{error}</h1>
        <p className="text-sm text-slate-500">Hubungi petugas rumah sakit untuk mendapatkan link survey baru.</p>
      </div>
    </div>
  );

  // Intro
  if (step === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full bg-white rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cobalt-600 flex items-center justify-center mx-auto mb-5">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-1">SIAP PERSI</h1>
        <p className="text-sm text-slate-500 mb-6">Survey Pengalaman & Hasil Pasien</p>

        <div className="text-left space-y-3 mb-6 p-4 bg-teal-50 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Pasien</span>
            <span className="text-sm font-semibold text-slate-700">{survey.patientName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">No. RM</span>
            <span className="text-sm font-semibold text-slate-700">{survey.rmNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Departemen</span>
            <span className="text-sm font-semibold text-teal-600">{deptName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">RS</span>
            <span className="text-sm font-semibold text-slate-700">{hospital?.name}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6">Survey ini terdiri dari 2 bagian: PREM (Pengalaman) dan PROM (Hasil). Estimasi pengisian: 3-5 menit.</p>

        <button onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cobalt-600 text-white font-semibold text-sm hover:opacity-90 cursor-pointer">
          Mulai Survey <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );

  // Done
  if (step === 3) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm w-full bg-white rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Terima Kasih!</h1>
        <p className="text-sm text-slate-500 mb-4">Jawaban Anda telah tersimpan dan akan digunakan untuk meningkatkan kualitas layanan rumah sakit.</p>
        <div className="inline-flex items-center gap-1 text-sm text-teal-600">
          <Heart className="w-4 h-4" /> Semoga lekas sehat
        </div>
      </motion.div>
    </div>
  );

  // Questions
  const isPromStep = step === 2;
  const questions = isPromStep ? promQuestions : premQuestions;
  const answers = isPromStep ? promAnswers : premAnswers;
  const setAnswer = (qId, val) => {
    if (isPromStep) setPromAnswers((p) => ({ ...p, [qId]: val }));
    else setPremAnswers((p) => ({ ...p, [qId]: val }));
  };
  const allAnswered = isPromStep ? promComplete : premComplete;
  const progress = Object.keys(answers).length / questions.length * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">{isPromStep ? 'PROM — Hasil Perawatan' : 'PREM — Pengalaman Pasien'}</h2>
          <p className="text-xs text-slate-400 mt-1">Bagian {step} dari 2 • {deptName}</p>
          <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-teal-500 to-cobalt-600 rounded-full" />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3">
                <span className="text-teal-500 font-bold mr-1.5">{idx + 1}.</span>
                {q.text}
              </p>
              <div className="flex gap-2">
                {scale.map((s) => (
                  <button key={s.value} onClick={() => setAnswer(q.id, s.value)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-medium border-2 transition-all cursor-pointer ${
                      answers[q.id] === s.value
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'border-slate-200 text-slate-500 hover:border-teal-300'
                    }`}>
                    <Star className={`w-3.5 h-3.5 mx-auto mb-0.5 ${answers[q.id] === s.value ? 'fill-white' : ''}`} />
                    {s.value}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-400">Sangat Kurang</span>
                <span className="text-[10px] text-slate-400">Sangat Puas</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action */}
        <div className="mt-6 flex gap-3">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm cursor-pointer">
              ← Kembali
            </button>
          )}
          {step === 1 && (
            <button onClick={() => setStep(2)} disabled={!allAnswered}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cobalt-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              Lanjut ke PROM →
            </button>
          )}
          {step === 2 && (
            <button onClick={handleSubmit} disabled={!allAnswered || submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Kirim Survey</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
