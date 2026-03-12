import { useState } from 'react';
import { AUDIT_DATA, DEPARTMENTS } from '../../data/mockData';
import { HeartPulse, Brain, Stethoscope, ClipboardCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };
const PHASE_META = {
  diagnosa: { label: 'Diagnosa', icon: Stethoscope, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  tatalaksana: { label: 'Tatalaksana', icon: ClipboardCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  outcome: { label: 'Outcome', icon: Activity, color: 'text-accent-400', bg: 'bg-accent-500/10' },
};

export default function StepClinicalAudit({ departments, auditValues, onAuditChange }) {
  const [activeDept, setActiveDept] = useState(departments[0] || 'cardiology');

  const deptAudit = AUDIT_DATA[activeDept];
  if (!deptAudit) return null;

  // Group indicators by phase
  const phases = {};
  deptAudit.indicators.forEach((ind) => {
    if (!phases[ind.phase]) phases[ind.phase] = [];
    phases[ind.phase].push(ind);
  });

  // Calculate department score preview
  const calcDeptScore = () => {
    const phaseMap = {};
    deptAudit.indicators.forEach((ind) => {
      if (!phaseMap[ind.phase]) phaseMap[ind.phase] = { weight: ind.phaseWeight, indicators: [] };
      phaseMap[ind.phase].indicators.push(ind);
    });
    let score = 0;
    Object.values(phaseMap).forEach(({ weight, indicators }) => {
      const avg = indicators.reduce((s, ind) => s + (auditValues[ind.id] || 0), 0) / indicators.length;
      score += avg * weight;
    });
    return score.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Audit Klinis</h2>
        <p className="text-sm text-surface-300 mt-1">
          Masukkan persentase kepatuhan untuk setiap indikator klinis.
          Bobot: <span className="text-emerald-400 font-semibold">60%</span> dari total skor.
        </p>
      </div>

      {/* Department tabs */}
      {departments.length > 1 && (
        <div className="flex gap-2">
          {departments.map((deptId) => {
            const dept = DEPARTMENTS.find((d) => d.id === deptId);
            const Icon = DEPT_ICONS[deptId];
            const isActive = activeDept === deptId;
            return (
              <button
                key={deptId}
                onClick={() => setActiveDept(deptId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-500/15 border-primary-500/30 text-primary-400'
                    : 'bg-surface-800/40 border-white/5 text-surface-300 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {dept?.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Disease header */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-surface-300">Penyakit</p>
          <p className="text-lg font-bold text-white">{deptAudit.disease}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-surface-300">Skor Preview</p>
          <p className="text-lg font-bold gradient-text">{calcDeptScore()}%</p>
        </div>
      </div>

      {/* Phase groups */}
      {Object.entries(phases).map(([phaseKey, indicators]) => {
        const meta = PHASE_META[phaseKey];
        const PhaseIcon = meta.icon;

        return (
          <motion.div
            key={`${activeDept}_${phaseKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className={`flex items-center gap-3 px-5 py-4 border-b border-white/5 ${meta.bg}`}>
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <PhaseIcon className={`w-5 h-5 ${meta.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{meta.label}</h3>
                <p className="text-[11px] text-surface-300">
                  Bobot: {(indicators[0].phaseWeight * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {indicators.map((ind, idx) => {
                const val = auditValues[ind.id] || 0;
                return (
                  <div
                    key={ind.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 pr-4 min-w-0">
                      <span className="text-[10px] font-mono text-surface-300/50 mt-1 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm text-surface-200">{ind.label}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                          onAuditChange(ind.id, v);
                        }}
                        className="w-20 h-8 rounded-lg bg-surface-800/60 border border-white/10 text-center text-sm text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-xs text-surface-300">%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
