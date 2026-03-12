import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS, STATUS_META } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { BarChart3, Shield, Users, HeartPulse, Brain, FileText, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };
const DEPT_COLORS = { cardiology: 'from-rose-500 to-rose-600', neurology: 'from-violet-500 to-violet-600' };

export default function HospitalDashboard() {
  const { user } = useAuth();
  const { submissions, getHospital, loading } = useAppStore();
  const hospital = getHospital(user?.hospitalId);
  const [expandedDept, setExpandedDept] = useState(null);

  const mySubmissions = (submissions || []).filter((s) => s.hospitalId === user?.hospitalId)
    .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
  const latestSub = mySubmissions[0];
  const needsRevision = latestSub?.status === 'revision';
  const depts = hospital?.departments || [];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Selamat Datang, {hospital?.name || 'RS'}</h1>
        <p className="text-sm text-ice-400 mt-1">
          {latestSub ? `Status terakhir: ${STATUS_META[latestSub.status]?.label || latestSub.status}` : 'Mulai dengan mengisi data untuk penilaian.'}
        </p>
      </div>

      {needsRevision && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 border-rose-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-rose-400">Revisi Diperlukan</p>
              <p className="text-xs text-ice-400 mt-1">{latestSub.reviewNote || 'Tim evaluator meminta perbaikan data.'}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <span className="text-xs text-ice-400">Submission</span>
          <p className="text-2xl font-bold text-white mt-1">{mySubmissions.length}</p>
          <p className="text-[11px] text-ice-400">total pengiriman</p>
        </div>
        <div className="glass-card p-4">
          <span className="text-xs text-ice-400">Skor Terakhir</span>
          <p className="text-2xl font-bold text-white mt-1">
            {latestSub?.scores ? (latestSub.scores.rsbk * 0.15 + latestSub.scores.audit * 0.60 + latestSub.scores.prm * 0.25).toFixed(1) + '%' : '—'}
          </p>
          <p className="text-[11px] text-ice-400">total skor</p>
        </div>
        <div className="glass-card p-4">
          <span className="text-xs text-ice-400">Spesialisasi</span>
          <div className="flex gap-2 mt-2">
            {depts.map((d) => {
              const Icon = DEPT_ICONS[d]; const dept = DEPARTMENTS.find((dp) => dp.id === d);
              return <span key={d} className="flex items-center gap-1 text-xs text-ice-300">{Icon && <Icon className="w-4 h-4" />}{dept?.name}</span>;
            })}
          </div>
        </div>
      </div>

      {/* Per-department data */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Data Per Departemen</h3>
        {depts.map((deptId) => {
          const dept = DEPARTMENTS.find((d) => d.id === deptId);
          const Icon = DEPT_ICONS[deptId];
          const color = DEPT_COLORS[deptId] || 'from-cobalt-500 to-cobalt-600';
          const isExpanded = expandedDept === deptId;

          // Get scores from latest submission
          const scores = latestSub?.scores;

          return (
            <motion.div key={deptId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
              {/* Department header */}
              <button onClick={() => setExpandedDept(isExpanded ? null : deptId)}
                className="w-full px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    {Icon && <Icon className="w-5 h-5 text-white" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{dept?.name}</p>
                    <p className="text-[11px] text-ice-400">
                      {scores ? `Skor RSBK: ${scores.rsbk?.toFixed(1)}% • Audit: ${scores.audit?.toFixed(1)}% • PRM: ${scores.prm?.toFixed(1)}%` : 'Belum ada data'}
                    </p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-ice-400" /> : <ChevronDown className="w-4 h-4 text-ice-400" />}
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/5 px-5 py-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { title: 'RSBK', desc: 'SDM, Sarana, Alat', icon: BarChart3, color: 'from-cobalt-500 to-cobalt-600', weight: '15%', score: scores?.rsbk },
                      { title: 'Audit Klinis', desc: 'Kepatuhan protokol', icon: Shield, color: 'from-teal-500 to-teal-600', weight: '60%', score: scores?.audit },
                      { title: 'PRM', desc: 'Laporan pasien', icon: Users, color: 'from-gold-500 to-gold-600', weight: '25%', score: scores?.prm },
                    ].map((m) => (
                      <div key={m.title} className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                            <m.icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{m.title}</p>
                            <p className="text-[9px] text-ice-400">{m.desc} • {m.weight}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-white">{m.score != null ? m.score.toFixed(1) + '%' : '—'}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/portal/data-entry"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white font-semibold text-xs hover:opacity-90">
                    <FileText className="w-3.5 h-3.5" /> {needsRevision ? 'Revisi Data' : 'Update Data'}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* No data state */}
      {mySubmissions.length === 0 && (
        <div className="glass-card p-8 text-center">
          <FileText className="w-10 h-10 text-ice-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">Mulai Pengisian Data</h3>
          <p className="text-sm text-ice-400 mt-1 mb-4">Isi data RSBK, Audit Klinis, dan PRM untuk penilaian rumah sakit Anda.</p>
          <Link to="/portal/data-entry" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white font-semibold hover:opacity-90">
            <FileText className="w-4 h-4" /> Isi Data Sekarang
          </Link>
        </div>
      )}

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
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium ${meta?.bg} ${meta?.color} border ${meta?.border}`}>{meta?.label || sub.status}</span>
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
