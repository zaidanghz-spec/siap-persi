import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS, STATUS, STATUS_META } from '../../data/mockData';
import { Inbox, CheckCircle2, Clock, Eye, MapPin, HeartPulse, Brain, ArrowRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META[STATUS.NOT_STARTED];
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium ${meta.bg} ${meta.color} border ${meta.border}`}>{meta.label}</span>;
}

export default function AdminDashboard() {
  const { submissions, publishedRankings } = useAppStore();
  const [filter, setFilter] = useState('all');

  const sorted = useMemo(() =>
    [...submissions].sort((a, b) => {
      const priority = { [STATUS.SUBMITTED]: 0, [STATUS.IN_REVIEW]: 1, [STATUS.REVISION]: 2, [STATUS.APPROVED]: 3, [STATUS.PUBLISHED]: 4 };
      return (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
    }),
    [submissions]
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted;
    return sorted.filter((s) => s.status === filter);
  }, [sorted, filter]);

  const stats = useMemo(() => ({
    pending: submissions.filter((s) => s.status === STATUS.SUBMITTED).length,
    inReview: submissions.filter((s) => s.status === STATUS.IN_REVIEW).length,
    approved: submissions.filter((s) => s.status === STATUS.APPROVED).length,
    published: publishedRankings.length,
  }), [submissions, publishedRankings]);

  const FILTER_TABS = [
    { key: 'all', label: 'Semua', count: submissions.length },
    { key: STATUS.SUBMITTED, label: 'Menunggu', count: stats.pending },
    { key: STATUS.IN_REVIEW, label: 'Direview', count: stats.inReview },
    { key: STATUS.APPROVED, label: 'Disetujui', count: stats.approved },
    { key: STATUS.PUBLISHED, label: 'Dipublikasi', count: stats.published },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pusat Kendali Kualitas Nasional</h1>
        <p className="text-sm text-ice-400 mt-1">
          {stats.pending > 0 ? (
            <>Ada <span className="text-gold-400 font-semibold">{stats.pending}</span> submission baru yang perlu direview.</>
          ) : (
            <>Semua submission sudah diproses. <span className="text-emerald-400 font-semibold">{stats.published}</span> RS telah dipublikasikan.</>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Menunggu Review', value: stats.pending, color: 'bg-gold-500/15 text-gold-400' },
          { icon: Eye, label: 'Sedang Direview', value: stats.inReview, color: 'bg-teal-500/15 text-teal-400' },
          { icon: CheckCircle2, label: 'Disetujui', value: stats.approved, color: 'bg-emerald-500/15 text-emerald-400' },
          { icon: Award, label: 'Dipublikasi', value: stats.published, color: 'bg-cobalt-500/15 text-cobalt-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4">
            <div className={`w-9 h-9 rounded-xl ${s.color.split(' ')[0]} flex items-center justify-center mb-2`}>
              <s.icon className={`w-5 h-5 ${s.color.split(' ')[1]}`} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-ice-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filter === tab.key ? 'bg-cobalt-500/15 border-cobalt-500/30 text-cobalt-400' : 'bg-white/5 border-white/5 text-ice-400 hover:text-white'
            }`}>
            {tab.label}
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Inbox */}
      {submissions.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Inbox className="w-12 h-12 text-ice-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white">Belum Ada Submission</h3>
          <p className="text-sm text-ice-400 mt-2">Submission akan muncul di sini setelah rumah sakit mengirimkan datanya.</p>
          <Link to="/admin/accounts" className="inline-flex items-center gap-1.5 text-sm text-teal-400 mt-4 hover:text-teal-300">
            Daftarkan rumah sakit terlebih dahulu <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((sub, idx) => (
            <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
              <Link to={`/admin/review/${sub.id}`}
                className="glass-card p-4 flex items-center gap-4 hover:border-cobalt-500/20 transition-colors group block">
                <div className="w-10 h-10 rounded-xl bg-cobalt-500/10 flex items-center justify-center text-cobalt-400 font-bold text-sm shrink-0">
                  {sub.hospitalName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white group-hover:text-cobalt-400 transition-colors truncate">{sub.hospitalName}</h3>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ice-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{sub.province}</span>
                    <div className="flex gap-1">
                      {sub.departments.map((d) => {
                        const I = DEPT_ICONS[d]; const dept = DEPARTMENTS.find((dp) => dp.id === d);
                        return <span key={d} className="flex items-center gap-0.5">{I && <I className="w-3 h-3" />}{dept?.name}</span>;
                      })}
                    </div>
                    {sub.submittedAt && <span>Dikirim: {sub.submittedAt}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {sub.scores && (
                    <p className="text-lg font-bold text-white">
                      {(sub.scores.rsbk * 0.15 + sub.scores.audit * 0.60 + sub.scores.prm * 0.25).toFixed(1)}%
                    </p>
                  )}
                  <ArrowRight className="w-4 h-4 text-ice-400 group-hover:text-cobalt-400 transition-colors ml-auto mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-ice-400">Tidak ada submission dengan status ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
