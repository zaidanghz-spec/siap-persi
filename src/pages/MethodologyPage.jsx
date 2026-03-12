import PublicNav from '../components/PublicNav';
import { BookOpen, Calculator, ClipboardList, BarChart3, Users, Info, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

export default function PublicMethodologyPage() {
  return (
    <div className="public-page">
      <PublicNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-cobalt-900">Metodologi Penilaian</h1>
            <p className="text-sm text-ice-500 mt-1">Bagaimana skor rumah sakit dihitung dalam sistem ranking nasional SIAP PERSI.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cobalt-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-cobalt-600" />
          </div>
        </div>

        {/* Total Formula */}
        <motion.div {...fadeIn} className="glass-card-white p-6 mb-6 glow-blue">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cobalt-500 to-teal-500 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-cobalt-900">Formula Total Skor</h2>
          </div>
          <div className="p-4 rounded-xl bg-cobalt-50 border border-cobalt-100 text-center">
            <p className="text-lg font-mono text-cobalt-900">
              <span className="font-bold text-teal-700">Total</span> = (
              <span className="text-cobalt-600">RSBK</span> × 0.15) + (
              <span className="text-teal-600">Audit</span> × 0.60) + (
              <span className="text-gold-600">PRM</span> × 0.25)
            </p>
          </div>
        </motion.div>

        {/* RSBK */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="glass-card-white overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-cobalt-100 bg-cobalt-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cobalt-500 to-cobalt-600 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-cobalt-900">Modul RSBK — Bobot 15%</h3>
                <p className="text-[11px] text-ice-500">Sumber Daya, Sarana, dan Alat Medis</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-1.5 text-sm text-ice-700">
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-cobalt-500 mt-0.5 shrink-0" />Setiap unit/orang bernilai <strong>1 Poin</strong></li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-cobalt-500 mt-0.5 shrink-0" />Skor = <code className="text-xs bg-cobalt-50 px-1.5 py-0.5 rounded">(Total / Target) × 100</code></li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-cobalt-500 mt-0.5 shrink-0" />Poin per item dibatasi maksimal sesuai target</li>
            </ul>
            <div className="grid grid-cols-3 gap-3">
              {[{ t: 'SDM', d: 'Jumlah dokter spesialis' }, { t: 'Sarana', d: 'Jumlah ruangan' }, { t: 'Alat', d: 'Jumlah alat medis' }].map((i) => (
                <div key={i.t} className="p-3 rounded-lg bg-cobalt-50 border border-cobalt-100">
                  <p className="text-xs font-semibold text-cobalt-600">{i.t}</p>
                  <p className="text-[10px] text-ice-500 mt-0.5">{i.d}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Audit */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="glass-card-white overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-teal-100 bg-teal-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-cobalt-900">Audit Klinis — Bobot 60%</h3>
                <p className="text-[11px] text-ice-500">Kepatuhan Indikator Klinis per Penyakit</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-1.5 text-sm text-ice-700">
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />Input: persentase kepatuhan (0–100%) per indikator</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />Data diambil dari rekam medis pasien</li>
            </ul>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-ice-200">
                <th className="text-left py-2 pr-4 text-ice-500 font-medium">Fase</th>
                <th className="text-center py-2 px-4 text-ice-500 font-medium">Bobot</th>
                <th className="text-left py-2 pl-4 text-ice-500 font-medium">Contoh</th>
              </tr></thead>
              <tbody className="text-ice-700">
                <tr className="border-b border-ice-100"><td className="py-2"><span className="text-cobalt-600 font-medium">Diagnosa</span></td><td className="text-center">25%</td><td>EKG ≤ 10 min, CT ≤ 30 min</td></tr>
                <tr className="border-b border-ice-100"><td className="py-2"><span className="text-teal-600 font-medium">Tatalaksana</span></td><td className="text-center">25%</td><td>Door-to-Balloon ≤ 90 min</td></tr>
                <tr><td className="py-2"><span className="text-gold-600 font-medium">Outcome</span></td><td className="text-center">50%</td><td>% Pasien hidup, LOS</td></tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* PRM */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="glass-card-white overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gold-100 bg-gold-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-cobalt-900">PRM — Bobot 25%</h3>
                <p className="text-[11px] text-ice-500">Patient-Reported Measures (PREM + PROM)</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ul className="space-y-1.5 text-sm text-ice-700">
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />Skor = (PREM × 60%) + (PROM × 40%)</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />Nilai = rata-rata Likert (1–5) / 5 × 100</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />Minimal 30 pasien per penyakit</li>
            </ul>
            <div className="rounded-lg bg-gold-50 p-4 border border-gold-100">
              <p className="text-xs font-semibold text-cobalt-900 mb-2">Skala Likert</p>
              {[{ v: 5, l: 'Sangat Puas', c: 'text-emerald-600' }, { v: 4, l: 'Puas', c: 'text-cobalt-600' }, { v: 3, l: 'Cukup', c: 'text-gold-600' }, { v: 2, l: 'Kurang', c: 'text-orange-600' }, { v: 1, l: 'Sangat Kurang', c: 'text-rose-600' }].map((s) => (
                <div key={s.v} className="flex items-center gap-3 py-0.5"><span className={`text-sm font-bold w-5 text-center ${s.c}`}>{s.v}</span><span className="text-xs text-ice-600">{s.l}</span></div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Guidelines */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="glass-card-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gold-50 flex items-center justify-center"><Info className="w-5 h-5 text-gold-600" /></div>
            <h3 className="text-base font-semibold text-cobalt-900">Panduan Pengisian</h3>
          </div>
          {[{ t: 'Akses Paralel', d: 'Admin Kardiologi dan Neurologi mengisi data secara bersamaan.' },
            { t: 'Validasi Data', d: 'RSBK: angka riil sesuai SIP dokter dan inventaris.' },
            { t: 'Audit Klinis', d: 'Data dari rekam medis periode penilaian.' },
            { t: 'PRM', d: 'Minimal 30 pasien per penyakit.' }].map((i) => (
            <div key={i.t} className="flex items-start gap-3 p-3 rounded-lg bg-ice-50 mb-2 last:mb-0">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 shrink-0" />
              <div><p className="text-sm font-medium text-cobalt-900">{i.t}</p><p className="text-xs text-ice-500 mt-0.5">{i.d}</p></div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
