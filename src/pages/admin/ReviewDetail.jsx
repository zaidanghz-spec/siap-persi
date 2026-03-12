import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS, STATUS, STATUS_META } from '../../data/mockData';
import { ArrowLeft, MapPin, CheckCircle2, XCircle, AlertTriangle, Send, HeartPulse, Brain, BarChart3, Shield, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };

function ScoreCard({ label, value, icon: Icon, color }) {
  const benchmark = 80;
  const diff = value - benchmark;
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-ice-400">{label}</p>
          <p className="text-xl font-bold text-white">{value.toFixed(1)}%</p>
        </div>
        <div className={`text-right text-xs font-medium ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
          <p className="text-[10px] text-ice-400/60">vs benchmark</p>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-ice-800 overflow-hidden">
        <div className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
        <div className="absolute top-0 h-full w-0.5 bg-gold-400" style={{ left: `${benchmark}%` }} />
      </div>
      <p className="text-[9px] text-ice-400/50 mt-1 text-right">Standar PERSI: {benchmark}%</p>
    </div>
  );
}

export default function ReviewDetail() {
  const { id } = useParams();
  const { submissions, updateSubmissionStatus, publishSubmission } = useAppStore();
  const submission = submissions.find((s) => s.id === id);

  const [reviewNote, setReviewNote] = useState(submission?.reviewNote || '');
  const [actionTaken, setActionTaken] = useState(
    submission?.status === STATUS.APPROVED ? 'approved' :
    submission?.status === STATUS.REVISION ? 'revision' :
    submission?.status === STATUS.PUBLISHED ? 'published' : null
  );
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [publishStep, setPublishStep] = useState(submission?.status === STATUS.PUBLISHED ? 3 : 0);

  if (!submission) {
    return (
      <div className="text-center py-20">
        <p className="text-ice-400">Submission tidak ditemukan.</p>
        <Link to="/admin/dashboard" className="text-cobalt-400 text-sm mt-2 inline-block">← Kembali</Link>
      </div>
    );
  }

  const totalScore = submission.scores ? (submission.scores.rsbk * 0.15 + submission.scores.audit * 0.60 + submission.scores.prm * 0.25) : 0;
  const meta = STATUS_META[submission.status];

  const handleAction = (action) => {
    const statusMap = { approved: STATUS.APPROVED, revision: STATUS.REVISION, rejected: STATUS.REVISION };
    updateSubmissionStatus(submission.id, statusMap[action], reviewNote);
    setActionTaken(action);
  };

  const handlePublish = () => {
    setPublishStep(2);
    publishSubmission(submission.id);
    setTimeout(() => setPublishStep(3), 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm text-ice-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Inbox
      </Link>

      {/* Header */}
      <div className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">{submission.hospitalName}</h1>
            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${meta?.bg} ${meta?.color} border ${meta?.border}`}>{meta?.label}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-ice-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{submission.province}</span>
            {submission.departments.map((d) => {
              const dept = DEPARTMENTS.find((dp) => dp.id === d); const I = DEPT_ICONS[d];
              return <span key={d} className="flex items-center gap-1">{I && <I className="w-3 h-3" />}{dept?.name}</span>;
            })}
            {submission.submittedAt && <span>Dikirim: {submission.submittedAt}</span>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{totalScore.toFixed(1)}<span className="text-sm text-ice-400">%</span></p>
          <p className="text-[10px] text-ice-400">Total Skor</p>
        </div>
      </div>

      {/* Scores */}
      {submission.scores && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Perbandingan Skor vs Standar PERSI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ScoreCard label="RSBK (15%)" value={submission.scores.rsbk} icon={BarChart3} color="from-cobalt-500 to-cobalt-600" />
            <ScoreCard label="Audit Klinis (60%)" value={submission.scores.audit} icon={Shield} color="from-teal-500 to-teal-600" />
            <ScoreCard label="PRM (25%)" value={submission.scores.prm} icon={Users} color="from-gold-500 to-gold-600" />
          </div>
        </div>
      )}

      {/* Review actions */}
      {!actionTaken && submission.status === STATUS.SUBMITTED && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Evaluasi</h3>
          <div>
            <label className="block text-xs text-ice-400 mb-1.5">Catatan Reviewer</label>
            <textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={3}
              placeholder="Tulis catatan untuk tim RS (opsional)…"
              className="w-full px-4 py-3 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50 resize-none" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleAction('approved')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 cursor-pointer">
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
            <button onClick={() => handleAction('revision')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-semibold hover:bg-gold-500/25 cursor-pointer">
              <AlertTriangle className="w-4 h-4" /> Minta Revisi
            </button>
            <button onClick={() => handleAction('rejected')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/25 cursor-pointer">
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>
      )}

      {/* Action result */}
      <AnimatePresence>
        {actionTaken && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${actionTaken === 'approved' || actionTaken === 'published' ? 'border-emerald-500/30' : actionTaken === 'revision' ? 'border-gold-500/30' : 'border-rose-500/30'}`}>
            <div className="flex items-center gap-3">
              {(actionTaken === 'approved' || actionTaken === 'published') && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              {actionTaken === 'revision' && <AlertTriangle className="w-6 h-6 text-gold-400" />}
              {actionTaken === 'rejected' && <XCircle className="w-6 h-6 text-rose-400" />}
              <div>
                <p className="text-sm font-semibold text-white">
                  {actionTaken === 'approved' ? 'Data Disetujui' : actionTaken === 'revision' ? 'Revisi Dikirim ke RS' : actionTaken === 'published' ? 'Telah Dipublikasi' : 'Data Ditolak'}
                </p>
                <p className="text-xs text-ice-400 mt-0.5">
                  {actionTaken === 'approved' ? 'RS siap dipublikasikan ke ranking publik.' : actionTaken === 'revision' ? 'RS perlu memperbaiki data dan mengirim ulang.' : actionTaken === 'published' ? 'Data sudah tampil di halaman ranking publik.' : 'RS perlu melakukan pengumpulan data ulang.'}
                </p>
              </div>
            </div>

            {actionTaken === 'approved' && publishStep < 3 && (
              <div className="mt-4">
                {publishStep === 0 && (
                  <button onClick={() => setShowPublishConfirm(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cobalt-600 to-teal-600 text-white font-semibold hover:opacity-90 cursor-pointer glow-blue">
                    <Send className="w-4 h-4" /> Update Ranking Publik
                  </button>
                )}
                <AnimatePresence>
                  {showPublishConfirm && publishStep === 0 && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-3 p-4 rounded-xl bg-cobalt-500/10 border border-cobalt-500/20">
                      <p className="text-sm text-cobalt-300 mb-3">⚠️ Data akan terlihat oleh publik. Lanjutkan?</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setPublishStep(1); handlePublish(); }}
                          className="px-4 py-2 rounded-lg bg-cobalt-600 text-white text-sm font-semibold cursor-pointer">Ya, Publikasikan</button>
                        <button onClick={() => setShowPublishConfirm(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 text-ice-300 text-sm cursor-pointer">Batal</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {publishStep >= 1 && publishStep < 3 && (
                  <div className="mt-3 flex items-center gap-2 text-cobalt-400">
                    <div className="w-4 h-4 border-2 border-cobalt-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Memproses publikasi...</span>
                  </div>
                )}
              </div>
            )}
            {publishStep === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-gold-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">🎉 Ranking Publik Berhasil Diperbarui!</p>
                  <p className="text-xs text-ice-400 mt-0.5">{submission.hospitalName} kini tampil di halaman ranking publik.</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
