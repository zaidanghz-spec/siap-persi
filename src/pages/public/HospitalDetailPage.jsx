import { useParams, Link } from 'react-router-dom';
import PublicNav from '../../components/PublicNav';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS } from '../../data/mockData';
import { ArrowLeft, MapPin, HeartPulse, Brain, BarChart3, Shield, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };

function RadarChart({ rsbk, audit, prm }) {
  const cx = 120, cy = 110, r = 80;
  const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI / 3), -Math.PI / 2 + (4 * Math.PI / 3)];
  const values = [rsbk / 100, audit / 100, prm / 100];
  const points = values.map((v, i) => `${cx + r * v * Math.cos(angles[i])},${cy + r * v * Math.sin(angles[i])}`).join(' ');
  const gridLevels = [0.25, 0.5, 0.75, 1];
  return (
    <svg viewBox="0 0 240 230" className="w-full max-w-[280px] mx-auto">
      {gridLevels.map((lv) => (
        <polygon key={lv} points={angles.map((a) => `${cx + r * lv * Math.cos(a)},${cy + r * lv * Math.sin(a)}`).join(' ')}
          fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {angles.map((a, i) => <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#e2e8f0" strokeWidth="1" />)}
      <motion.polygon initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        points={points} fill="rgba(13,148,136,0.15)" stroke="#0d9488" strokeWidth="2" />
      {values.map((v, i) => <circle key={i} cx={cx + r * v * Math.cos(angles[i])} cy={cy + r * v * Math.sin(angles[i])} r="4" fill="#0d9488" />)}
      <text x={cx} y={cy - r - 12} textAnchor="middle" className="text-xs fill-cobalt-700 font-semibold">RSBK</text>
      <text x={cx + r + 15} y={cy + r * 0.6 + 5} textAnchor="start" className="text-xs fill-cobalt-700 font-semibold">Audit</text>
      <text x={cx - r - 15} y={cy + r * 0.6 + 5} textAnchor="end" className="text-xs fill-cobalt-700 font-semibold">PRM</text>
    </svg>
  );
}

export default function HospitalDetailPage() {
  const { id } = useParams();
  const { publishedRankings } = useAppStore();
  const ranking = publishedRankings.find((r) => r.hospitalId === id);

  if (!ranking) {
    return (
      <div className="public-page">
        <PublicNav />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p className="text-ice-500">Data rumah sakit belum tersedia atau belum dipublikasikan.</p>
          <Link to="/ranking" className="text-teal-600 text-sm mt-2 inline-block">← Kembali ke Ranking</Link>
        </div>
      </div>
    );
  }

  const rank = publishedRankings.findIndex((r) => r.hospitalId === id) + 1;
  const { scores, totalScore } = ranking;

  const scoreCards = [
    { label: 'RSBK', weight: '15%', value: scores.rsbk, icon: BarChart3, color: 'from-cobalt-500 to-cobalt-600', desc: 'Sumber Daya Manusia & Alat Medis' },
    { label: 'Audit Klinis', weight: '60%', value: scores.audit, icon: Shield, color: 'from-teal-500 to-teal-600', desc: 'Kepatuhan Protokol Klinis' },
    { label: 'PRM', weight: '25%', value: scores.prm, icon: Users, color: 'from-gold-500 to-gold-600', desc: 'Patient-Reported Measures' },
  ];

  return (
    <div className="public-page">
      <PublicNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/ranking" className="inline-flex items-center gap-1.5 text-sm text-ice-500 hover:text-cobalt-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Ranking
        </Link>

        <div className="glass-card-white p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white ${rank <= 3 ? (rank === 1 ? 'rank-badge-gold' : rank === 2 ? 'rank-badge-silver' : 'rank-badge-bronze') : 'bg-ice-300'}`}>
              #{rank}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-cobalt-900">{ranking.hospitalName}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-sm text-ice-500"><MapPin className="w-4 h-4" />{ranking.province}</span>
                <div className="flex gap-1.5">
                  {ranking.departments.map((d) => {
                    const dept = DEPARTMENTS.find((dp) => dp.id === d);
                    const Icon = DEPT_ICONS[d];
                    return <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-cobalt-50 text-cobalt-700 border border-cobalt-100">
                      {Icon && <Icon className="w-3 h-3" />}{dept?.name}</span>;
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cobalt-900">{totalScore.toFixed(1)}<span className="text-base text-ice-400">%</span></p>
              <p className="text-xs text-ice-500 mt-0.5">Total Skor</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card-white p-6">
            <h3 className="text-sm font-semibold text-cobalt-900 mb-4 text-center">Distribusi Skor</h3>
            <RadarChart rsbk={scores.rsbk} audit={scores.audit} prm={scores.prm} />
          </div>
          <div className="lg:col-span-2 space-y-4">
            {scoreCards.map((card, idx) => (
              <motion.div key={card.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                className="glass-card-white p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div><h4 className="text-sm font-semibold text-cobalt-900">{card.label}</h4><p className="text-xs text-ice-500">{card.desc}</p></div>
                      <div className="text-right"><p className="text-2xl font-bold text-cobalt-900">{card.value.toFixed(1)}%</p><p className="text-[10px] text-ice-400">Bobot: {card.weight}</p></div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-ice-100 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${card.value}%` }} transition={{ duration: 1, delay: 0.3 + idx * 0.15 }}
                        className={`h-full rounded-full bg-gradient-to-r ${card.color}`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
