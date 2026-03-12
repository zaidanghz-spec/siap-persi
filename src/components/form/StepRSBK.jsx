import { useState } from 'react';
import { RSBK_DATA, DEPARTMENTS } from '../../data/mockData';
import { HeartPulse, Brain, Users, BedDouble, Wrench, ChevronDown, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };
const CATEGORY_META = {
  sdm: { label: 'SDM (Dokter Spesialis)', icon: Users, color: 'text-primary-400' },
  rooms: { label: 'Sarana Ruangan', icon: BedDouble, color: 'text-emerald-400' },
  equipment: { label: 'Alat Medis', icon: Wrench, color: 'text-amber-400' },
};
const CATEGORIES = ['sdm', 'rooms', 'equipment'];

function NumberInput({ value, onChange, max }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, (value || 0) - 1))}
        className="w-7 h-7 rounded-lg bg-surface-800 border border-white/10 flex items-center justify-center text-surface-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
      >
        <Minus className="w-3 h-3" />
      </button>
      <input
        type="number"
        min="0"
        value={value || 0}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-14 h-7 rounded-lg bg-surface-800/60 border border-white/10 text-center text-sm text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange((value || 0) + 1)}
        className="w-7 h-7 rounded-lg bg-surface-800 border border-white/10 flex items-center justify-center text-surface-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
      >
        <Plus className="w-3 h-3" />
      </button>
      <span className="text-[10px] text-surface-300/60 ml-1">/{max}</span>
    </div>
  );
}

export default function StepRSBK({ departments, quantities, onQuantityChange }) {
  const [activeDept, setActiveDept] = useState(departments[0] || 'cardiology');
  const [openCat, setOpenCat] = useState('sdm');

  const deptData = RSBK_DATA[activeDept];
  if (!deptData) return null;

  // Calculate scores per category
  const getCategoryScore = (cat) => {
    const items = deptData[cat] || [];
    let total = 0, target = 0;
    items.forEach((item) => {
      total += Math.min(quantities[item.id] || 0, item.target);
      target += item.target;
    });
    return target > 0 ? ((total / target) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Modul RSBK</h2>
        <p className="text-sm text-surface-300 mt-1">
          Masukkan jumlah ketersediaan SDM, Sarana Ruangan, dan Alat Medis.
          Bobot: <span className="text-primary-400 font-semibold">15%</span> dari total skor.
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

      {/* Categories */}
      <div className="space-y-3">
        {CATEGORIES.map((catKey) => {
          const meta = CATEGORY_META[catKey];
          const Icon = meta.icon;
          const items = deptData[catKey] || [];
          const isOpen = openCat === catKey;
          const score = getCategoryScore(catKey);

          return (
            <div key={`${activeDept}_${catKey}`} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenCat(isOpen ? '' : catKey)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-white">{meta.label}</h3>
                    <p className="text-[11px] text-surface-300">{items.length} item</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-white">{score}%</span>
                  <div className="w-16 h-1.5 rounded-full bg-surface-800 overflow-hidden hidden sm:block">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                      style={{ width: `${Math.min(parseFloat(score), 100)}%` }}
                    />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-surface-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/5 divide-y divide-white/5">
                      {items.map((item, idx) => {
                        const val = quantities[item.id] || 0;
                        const filled = val >= item.target;
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between px-5 py-3 ${
                              filled ? 'bg-emerald-500/[0.03]' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3 flex-1 pr-4 min-w-0">
                              <span className="text-[10px] font-mono text-surface-300/50 mt-1 shrink-0">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="text-sm text-surface-200 truncate">{item.label}</span>
                            </div>
                            <NumberInput
                              value={val}
                              onChange={(v) => onQuantityChange(item.id, v)}
                              max={item.target}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
