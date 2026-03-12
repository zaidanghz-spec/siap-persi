import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS, STATUS, STATUS_META } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { BarChart3, Shield, Users, HeartPulse, Brain, ArrowRight, FileText, Clock, Inbox, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };

function ProgressRing({ progress, size = 48, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color = progress >= 80 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke="rgba(255,255,255,0.05)" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke={color} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
    </svg>
  );
}

export default function HospitalDashboard() {
  const { user } = useAuth();
  const { submissions, getHospital } = useAppStore();
  const hospital = getHospital(user?.hospitalId);

  // Get latest submission for this hospital
  const mySubmissions = submissions.filter((s) => s.hospitalId === user?.hospitalId)
    .sort((a, b) => b.submittedAt?.localeCompare(a.submittedAt));
  const latestSub = mySubmissions[0];

  const needsRevision = latestSub?.status === STATUS.REVISION;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Selamat Datang, {hospital?.name || 'RS'}</h1>
        <p className="text-sm text-ice-400 mt-1">
          {latestSub ? `Status terakhir: ${STATUS_META[latestSub.status]?.label || latestSub.status}` : 'Mulai dengan mengisi data untuk penilaian.'}
        </p>
      </div>

      {/* Revision notice */}
      {needsRevision && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-4 border-rose-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-rose-400">Revisi Diperlukan</p>
              <p className="text-xs text-ice-400 mt-1">{latestSub.reviewNote || 'Tim evaluator meminta perbaikan data. Silakan periksa dan kirim ulang.'}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ice-400">Submission</span>
            <span className="text-xs font-medium text-white">{mySubmissions.length}</span>
          </div>
          <p className="text-2xl font-bold text-white">{mySubmissions.length}</p>
          <p className="text-[11px] text-ice-400">total pengiriman</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ice-400">Skor Terakhir</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {latestSub?.scores ? (latestSub.scores.rsbk * 0.15 + latestSub.scores.audit * 0.60 + latestSub.scores.prm * 0.25).toFixed(1) + '%' : '—'}
          </p>
          <p className="text-[11px] text-ice-400">total skor</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ice-400">Spesialisasi</span>
          </div>
          <div className="flex gap-2">
            {(hospital?.departments || []).map((d) => {
              const Icon = DEPT_ICONS[d]; const dept = DEPARTMENTS.find((dp) => dp.id === d);
              return <span key={d} className="flex items-center gap-1 text-xs text-ice-300">{Icon && <Icon className="w-4 h-4" />}{dept?.name}</span>;
            })}
          </div>
        </div>
      </div>

      {/* Action card */}
      <div className="glass-card p-6">
        {mySubmissions.length === 0 ? (
          <div className="text-center py-4">
            <FileText className="w-10 h-10 text-ice-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">Mulai Pengisian Data</h3>
            <p className="text-sm text-ice-400 mt-1 mb-4">Isi data RSBK, Audit Klinis, dan PRM untuk penilaian rumah sakit Anda.</p>
            <Link to="/portal/data-entry" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white font-semibold hover:opacity-90">
              <FileText className="w-4 h-4" /> Isi Data Sekarang
            </Link>
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Modul Penilaian</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: BarChart3, title: 'RSBK', desc: 'SDM, Sarana, Alat Medis', color: 'from-cobalt-500 to-cobalt-600', weight: '15%', score: latestSub?.scores?.rsbk },
                { icon: Shield, title: 'Audit Klinis', desc: 'Kepatuhan protokol', color: 'from-teal-500 to-teal-600', weight: '60%', score: latestSub?.scores?.audit },
                { icon: Users, title: 'PRM', desc: 'Laporan pasien', color: 'from-gold-500 to-gold-600', weight: '25%', score: latestSub?.scores?.prm },
              ].map((m) => (
                <div key={m.title} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                      <m.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{m.title}</p>
                      <p className="text-[10px] text-ice-400">{m.desc} • {m.weight}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-white">{m.score != null ? m.score.toFixed(1) + '%' : '—'}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/portal/data-entry" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white font-semibold text-sm hover:opacity-90">
                <FileText className="w-4 h-4" /> {needsRevision ? 'Revisi & Kirim Ulang' : 'Update Data'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Submission history */}
      {mySubmissions.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-ice-400" /> Riwayat Submission</h3>
          </div>
          <div className="divide-y divide-white/5">
            {mySubmissions.map((sub) => {
              const meta = STATUS_META[sub.status];
              return (
                <div key={sub.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium ${meta?.bg} ${meta?.color} border ${meta?.border}`}>{meta?.label}</span>
                    <span className="text-xs text-ice-400 ml-2">{sub.submittedAt}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {sub.scores ? (sub.scores.rsbk * 0.15 + sub.scores.audit * 0.60 + sub.scores.prm * 0.25).toFixed(1) + '%' : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
