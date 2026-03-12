import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../../components/PublicNav';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS, PROVINCES } from '../../data/mockData';
import { Search, Filter, MapPin, HeartPulse, Brain, ChevronDown, X, ArrowUpDown, Inbox, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };
const DEPT_COLORS = {
  cardiology: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  neurology: { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
};

function RankBadge({ rank }) {
  const cls = rank === 1 ? 'rank-badge-gold' : rank === 2 ? 'rank-badge-silver' : rank === 3 ? 'rank-badge-bronze' : 'bg-ice-300';
  return <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${cls}`}>{rank}</div>;
}

function ScoreBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-ice-500">{label}</span>
        <span className="font-semibold text-cobalt-900">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-ice-200 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

export default function RankingPage() {
  const { publishedRankings } = useAppStore();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState([]);
  const [provinceFilter, setProvinceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);

  const toggleDept = (id) => setDeptFilter((p) => p.includes(id) ? p.filter((d) => d !== id) : [...p, id]);

  const filtered = useMemo(() => {
    let list = publishedRankings.filter((h) => {
      if (search && !h.hospitalName.toLowerCase().includes(search.toLowerCase())) return false;
      if (deptFilter.length > 0 && !deptFilter.some((d) => h.departments.includes(d))) return false;
      if (provinceFilter && h.province !== provinceFilter) return false;
      return true;
    });
    return list.sort((a, b) => sortAsc ? a.totalScore - b.totalScore : b.totalScore - a.totalScore);
  }, [publishedRankings, search, deptFilter, provinceFilter, sortAsc]);

  const hasFilters = deptFilter.length > 0 || provinceFilter;

  return (
    <div className="public-page">
      <PublicNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-cobalt-900">Ranking Nasional</h1>
          <p className="text-sm text-ice-500 mt-1">Rumah sakit terverifikasi berdasarkan skor total (RSBK + Audit + PRM)</p>
        </div>

        {/* Search & filters */}
        <div className="glass-card-white p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari rumah sakit…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-ice-200 text-sm text-cobalt-900 placeholder-ice-400 focus:border-cobalt-300" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${hasFilters ? 'bg-cobalt-50 border-cobalt-200 text-cobalt-700' : 'bg-white border-ice-200 text-ice-600 hover:text-cobalt-700'}`}>
              <Filter className="w-4 h-4" /> Filter
              {hasFilters && <span className="w-5 h-5 rounded-full bg-cobalt-600 text-white text-[10px] flex items-center justify-center">{deptFilter.length + (provinceFilter ? 1 : 0)}</span>}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-ice-200 text-sm font-medium text-ice-600 hover:text-cobalt-700 cursor-pointer">
              <ArrowUpDown className="w-4 h-4" /> {sortAsc ? 'Terendah' : 'Tertinggi'}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-3 border-t border-ice-100 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-ice-500 mb-2">Spesialisasi</p>
                    <div className="flex flex-wrap gap-2">
                      {DEPARTMENTS.map((dept) => {
                        const active = deptFilter.includes(dept.id);
                        const Icon = DEPT_ICONS[dept.id];
                        return (
                          <button key={dept.id} onClick={() => toggleDept(dept.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${active ? `${DEPT_COLORS[dept.id].bg} ${DEPT_COLORS[dept.id].text} ${DEPT_COLORS[dept.id].border}` : 'bg-white border-ice-200 text-ice-600 hover:text-cobalt-700'}`}>
                            {Icon && <Icon className="w-3.5 h-3.5" />}{dept.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ice-500 mb-2">Provinsi</p>
                    <select value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-ice-200 text-sm text-cobalt-900 w-full sm:w-64">
                      <option value="">Semua Provinsi</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  {hasFilters && (
                    <button onClick={() => { setDeptFilter([]); setProvinceFilter(''); }} className="flex items-center gap-1 text-xs text-rose-500 cursor-pointer">
                      <X className="w-3.5 h-3.5" /> Hapus filter
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        {publishedRankings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-white p-16 text-center">
            <Inbox className="w-14 h-14 text-ice-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-cobalt-900">Ranking Belum Tersedia</h3>
            <p className="text-sm text-ice-500 mt-2 max-w-md mx-auto">
              Saat ini belum ada data ranking yang dipublikasikan. Ranking akan muncul setelah rumah sakit mengirimkan data dan diverifikasi oleh tim evaluator.
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-xs text-ice-500 mb-3">Menampilkan <span className="font-semibold text-cobalt-900">{filtered.length}</span> rumah sakit</p>
            <div className="space-y-3">
              {filtered.map((h, idx) => (
                <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                  <Link to={`/ranking/${h.hospitalId}`} className="glass-card-white p-5 block hover:shadow-lg transition-shadow group">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <RankBadge rank={idx + 1} />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-cobalt-900 group-hover:text-teal-700 transition-colors truncate">{h.hospitalName}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-ice-400" /><span className="text-xs text-ice-500">{h.province}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {h.departments.map((d) => {
                              const Icon = DEPT_ICONS[d]; const dept = DEPARTMENTS.find((dp) => dp.id === d);
                              return <span key={d} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${DEPT_COLORS[d]?.bg} ${DEPT_COLORS[d]?.text} border ${DEPT_COLORS[d]?.border}`}>
                                {Icon && <Icon className="w-3 h-3" />}{dept?.name}</span>;
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-72 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-ice-500">Total Skor</span>
                          <span className="text-lg font-bold text-cobalt-900">{h.totalScore.toFixed(1)}%</span>
                        </div>
                        <ScoreBar label="RSBK (15%)" value={h.scores.rsbk} color="bg-cobalt-500" />
                        <ScoreBar label="Audit (60%)" value={h.scores.audit} color="bg-teal-500" />
                        <ScoreBar label="PRM (25%)" value={h.scores.prm} color="bg-gold-500" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {filtered.length === 0 && publishedRankings.length > 0 && (
                <div className="glass-card-white p-12 text-center">
                  <Search className="w-10 h-10 text-ice-300 mx-auto mb-3" />
                  <p className="text-sm text-ice-500">Tidak ada rumah sakit yang sesuai filter.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
