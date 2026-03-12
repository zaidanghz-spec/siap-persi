import { useState, useMemo } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { DEPARTMENTS, PROVINCES } from '../data/mockData';
import {
  Search, Filter, TrendingUp, Award, Building2, MapPin, ChevronDown,
  Brain, HeartPulse, Stethoscope, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };
const DEPT_COLORS = {
  cardiology: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  neurology: { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};

function ScoreBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-surface-300">{label}</span>
        <span className="font-semibold text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function RankBadge({ rank }) {
  const cls = rank === 1 ? 'rank-badge-gold' : rank === 2 ? 'rank-badge-silver' : rank === 3 ? 'rank-badge-bronze' : 'bg-surface-700';
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${cls}`}>
      {rank}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-surface-300">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { hospitals } = useSupabase();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState([]);
  const [provinceFilter, setProvinceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const toggleDept = (id) =>
    setDeptFilter((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (deptFilter.length > 0 && !deptFilter.some((d) => h.departments.includes(d))) return false;
      if (provinceFilter && h.province !== provinceFilter) return false;
      return true;
    });
  }, [hospitals, search, deptFilter, provinceFilter]);

  const avgScore = useMemo(() => {
    if (filtered.length === 0) return 0;
    return filtered.reduce((s, h) => s + h.totalScore, 0) / filtered.length;
  }, [filtered]);

  const hasActiveFilters = deptFilter.length > 0 || provinceFilter;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-surface-300 mt-1">Ranking dan performa rumah sakit nasional</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total RS" value={hospitals.length} color="bg-primary-500/20" />
        <StatCard icon={Award} label="Skor Tertinggi" value={`${hospitals[0]?.totalScore.toFixed(1)}%`} color="bg-amber-500/20" />
        <StatCard icon={TrendingUp} label="Skor Rata-rata" value={`${avgScore.toFixed(1)}%`} color="bg-emerald-500/20" />
        <StatCard icon={Stethoscope} label="Spesialisasi" value="2" color="bg-accent-500/20" />
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
            <input
              id="search-hospitals"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari rumah sakit…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/60 border border-white/10 text-sm text-white placeholder-surface-300/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
              hasActiveFilters
                ? 'bg-primary-500/15 border-primary-500/30 text-primary-400'
                : 'bg-surface-800/60 border-white/10 text-surface-300 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center">
                {deptFilter.length + (provinceFilter ? 1 : 0)}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="pt-3 border-t border-white/5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-surface-300 mb-2">Spesialisasi</p>
                  <div className="flex flex-wrap gap-2">
                    {DEPARTMENTS.map((dept) => {
                      const active = deptFilter.includes(dept.id);
                      const Icon = DEPT_ICONS[dept.id];
                      return (
                        <button
                          key={dept.id}
                          onClick={() => toggleDept(dept.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            active
                              ? `${DEPT_COLORS[dept.id].bg} ${DEPT_COLORS[dept.id].text} ${DEPT_COLORS[dept.id].border}`
                              : 'bg-surface-800/40 border-white/5 text-surface-300 hover:text-white'
                          }`}
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {dept.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-300 mb-2">Provinsi</p>
                  <select
                    id="province-filter"
                    value={provinceFilter}
                    onChange={(e) => setProvinceFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-surface-800/60 border border-white/10 text-sm text-white w-full sm:w-64"
                  >
                    <option value="">Semua Provinsi</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setDeptFilter([]); setProvinceFilter(''); }}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Hapus semua filter
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-medium text-surface-300">
            Menampilkan <span className="text-white">{filtered.length}</span> rumah sakit
          </p>
        </div>

        <AnimatePresence>
          {filtered.map((hospital, idx) => {
            const rank = idx + 1;
            return (
              <motion.div
                key={hospital.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="glass-card p-5 hover:border-primary-500/20 transition-colors group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <RankBadge rank={rank} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                        {hospital.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-surface-300" />
                        <span className="text-xs text-surface-300">{hospital.province}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {hospital.departments.map((d) => {
                          const Icon = DEPT_ICONS[d];
                          const dept = DEPARTMENTS.find((dp) => dp.id === d);
                          return (
                            <span
                              key={d}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${DEPT_COLORS[d]?.bg} ${DEPT_COLORS[d]?.text} border ${DEPT_COLORS[d]?.border}`}
                            >
                              {Icon && <Icon className="w-3 h-3" />}
                              {dept?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-80 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-surface-300">Total Skor</span>
                      <span className="text-lg font-bold gradient-text">{hospital.totalScore.toFixed(1)}%</span>
                    </div>
                    <ScoreBar label="RSBK (15%)" value={hospital.scores.rsbk} color="bg-gradient-to-r from-primary-500 to-primary-400" />
                    <ScoreBar label="Audit Klinis (60%)" value={hospital.scores.audit} color="bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    <ScoreBar label="PRM (25%)" value={hospital.scores.prm} color="bg-gradient-to-r from-accent-500 to-accent-400" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Search className="w-10 h-10 text-surface-300/30 mx-auto mb-3" />
            <p className="text-sm text-surface-300">Tidak ada rumah sakit yang sesuai filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
