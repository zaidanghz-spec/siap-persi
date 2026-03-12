import { useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { DEPARTMENTS } from '../../data/mockData';
import {
  Settings, Wrench, Stethoscope, MessageSquare, BarChart3,
  Pencil, Trash2, Plus, Check, X, AlertCircle,
  HeartPulse, Brain, Users, BedDouble, ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'rsbk', label: 'Konfigurasi RSBK', icon: Wrench },
  { id: 'audit', label: 'Master Audit Klinis', icon: Stethoscope },
  { id: 'prm', label: 'Bank Soal PRM', icon: MessageSquare },
  { id: 'log', label: 'Log Pengisian', icon: BarChart3 },
];

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };
const CAT_LABELS = { sdm: 'SDM (Dokter Spesialis)', rooms: 'Sarana Ruangan', equipment: 'Alat Medis' };
const CAT_ICONS = { sdm: Users, rooms: BedDouble, equipment: Wrench };

// ─── Tab: RSBK Config ────────────────────────────────────────
function RSBKConfigTab({ rsbkConfig, addRSBKItem, updateRSBKItem, deleteRSBKItem }) {
  const [activeDept, setActiveDept] = useState('cardiology');
  const [activeCat, setActiveCat] = useState('sdm');
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editTarget, setEditTarget] = useState(1);
  const [addingNew, setAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTarget, setNewTarget] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const items = rsbkConfig[activeDept]?.[activeCat] || [];

  const startEdit = (item) => { setEditingId(item.id); setEditLabel(item.label); setEditTarget(item.target); setAddingNew(false); };
  const saveEdit = () => { if (editLabel.trim()) updateRSBKItem(activeDept, activeCat, editingId, { label: editLabel.trim(), target: editTarget }); setEditingId(null); };
  const handleAdd = () => {
    if (newLabel.trim()) {
      addRSBKItem(activeDept, activeCat, { id: `${activeDept.slice(0,1)}_${activeCat.slice(0,2)}_${Date.now()}`, label: newLabel.trim(), target: newTarget });
      setNewLabel(''); setNewTarget(1); setAddingNew(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-surface-300">Edit daftar spesialis, sarana ruangan, dan alat medis per spesialisasi. Setiap item memiliki target poin.</p>
      <div className="flex gap-2">
        {DEPARTMENTS.map((d) => {
          const I = DEPT_ICONS[d.id];
          return (
            <button key={d.id} onClick={() => { setActiveDept(d.id); setEditingId(null); setAddingNew(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${activeDept === d.id ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-800/40 border-white/5 text-surface-300 hover:text-white'}`}>
              {I && <I className="w-3.5 h-3.5" />}{d.name}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        {Object.entries(CAT_LABELS).map(([key, label]) => {
          const I = CAT_ICONS[key];
          return (
            <button key={key} onClick={() => { setActiveCat(key); setEditingId(null); setAddingNew(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${activeCat === key ? 'bg-accent-500/15 border-accent-500/30 text-accent-400' : 'bg-surface-800/40 border-white/5 text-surface-300 hover:text-white'}`}>
              {I && <I className="w-3.5 h-3.5" />}{label}
            </button>
          );
        })}
      </div>

      <div className="glass-card-light overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-semibold text-white">{items.length} item</span>
          <span className="text-[10px] text-surface-300">Label • Target</span>
        </div>
        <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={item.id} className="px-4 py-3">
              {editingId === item.id ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg bg-surface-800/60 border border-primary-500/30 text-xs text-white" autoFocus />
                  <input type="number" min="1" value={editTarget} onChange={(e) => setEditTarget(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 px-2 py-1.5 rounded-lg bg-surface-800/60 border border-primary-500/30 text-xs text-white text-center" />
                  <button onClick={saveEdit} className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-surface-800/40 text-surface-300 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : deleteConfirm === item.id ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/5 border border-rose-500/10">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px] text-rose-300 flex-1">Hapus item ini?</span>
                  <button onClick={() => { deleteRSBKItem(activeDept, activeCat, item.id); setDeleteConfirm(null); }} className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-[11px] cursor-pointer">Hapus</button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-surface-800/40 text-surface-300 text-[11px] cursor-pointer">Batal</button>
                </div>
              ) : (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[10px] font-mono text-surface-300/50">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-xs text-surface-200">{item.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800 text-surface-300">target: {item.target}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(item)} className="p-1 rounded text-surface-300 hover:text-primary-400 cursor-pointer"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => setDeleteConfirm(item.id)} className="p-1 rounded text-surface-300 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {addingNew ? (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg bg-surface-800/60 border border-primary-500/30 text-xs text-white" placeholder="Label baru…" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
                <input type="number" min="1" value={newTarget} onChange={(e) => setNewTarget(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 px-2 py-1.5 rounded-lg bg-surface-800/60 border border-primary-500/30 text-xs text-white text-center" placeholder="Target" />
                <button onClick={handleAdd} className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => { setAddingNew(false); setNewLabel(''); }} className="p-1.5 rounded-lg bg-surface-800/40 text-surface-300 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2">
              <button onClick={() => setAddingNew(true)} className="flex items-center gap-1.5 text-[11px] font-medium text-primary-400 hover:text-primary-300 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Tambah Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Audit Config ───────────────────────────────────────
function AuditConfigTab({ auditConfig, updateAuditIndicator, thresholds, updateThreshold }) {
  const [activeDept, setActiveDept] = useState('cardiology');
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');

  const data = auditConfig[activeDept];

  return (
    <div className="space-y-4">
      <p className="text-xs text-surface-300">Edit indikator audit, ambang batas waktu, dan bobot per fase klinis.</p>
      <div className="flex gap-2">
        {DEPARTMENTS.map((d) => {
          const I = DEPT_ICONS[d.id];
          return (
            <button key={d.id} onClick={() => { setActiveDept(d.id); setEditingId(null); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${activeDept === d.id ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-800/40 border-white/5 text-surface-300 hover:text-white'}`}>
              {I && <I className="w-3.5 h-3.5" />}{d.name}
            </button>
          );
        })}
      </div>

      {/* Thresholds */}
      <div className="glass-card-light p-4 space-y-3">
        <h4 className="text-xs font-semibold text-white">Ambang Batas</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(thresholds[activeDept] || {}).map(([key, val]) => (
            <div key={key}>
              <label className="block text-[10px] text-surface-300 mb-1">{key.replace(/_/g, ' ')}</label>
              <input type="number" value={val}
                onChange={(e) => updateThreshold(activeDept, key, parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-lg bg-surface-800/60 border border-white/10 text-xs text-white text-center" />
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="glass-card-light overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-white">{data?.disease} — Indikator</span>
        </div>
        <div className="divide-y divide-white/5">
          {(data?.indicators || []).map((ind) => (
            <div key={ind.id} className="px-4 py-3">
              {editingId === ind.id ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg bg-surface-800/60 border border-primary-500/30 text-xs text-white" autoFocus />
                  <button onClick={() => { updateAuditIndicator(activeDept, ind.id, { label: editLabel }); setEditingId(null); }} className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-surface-800/40 text-surface-300 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs text-surface-200">{ind.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${ind.phase === 'diagnosa' ? 'bg-primary-500/10 text-primary-400' : ind.phase === 'tatalaksana' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-accent-500/10 text-accent-400'}`}>
                      {ind.phase} ({(ind.phaseWeight * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <button onClick={() => { setEditingId(ind.id); setEditLabel(ind.label); }} className="p-1 rounded text-surface-300 hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: PRM Bank ───────────────────────────────────────────
function PRMBankTab({ prmConfig, addPREMQuestion, updatePREMQuestion, deletePREMQuestion, addPROMQuestion, updatePROMQuestion, deletePROMQuestion }) {
  const [section, setSection] = useState('prem');
  const [promDept, setPromDept] = useState('cardiology');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newText, setNewText] = useState('');

  const questions = section === 'prem' ? prmConfig.prem.questions : (prmConfig.prom.questions[promDept] || []);

  const handleSave = () => {
    if (editText.trim()) section === 'prem' ? updatePREMQuestion(editingId, editText.trim()) : updatePROMQuestion(promDept, editingId, editText.trim());
    setEditingId(null);
  };

  const handleAdd = () => {
    if (newText.trim()) {
      const q = { id: `${section}_${Date.now()}`, text: newText.trim() };
      section === 'prem' ? addPREMQuestion(q) : addPROMQuestion(promDept, q);
      setNewText(''); setAddingNew(false);
    }
  };

  const handleDelete = (qId) => {
    section === 'prem' ? deletePREMQuestion(qId) : deletePROMQuestion(promDept, qId);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-surface-300">Kelola kuesioner PREM dan PROM. PREM berbobot 60%, PROM berbobot 40%.</p>
      <div className="flex gap-2">
        <button onClick={() => { setSection('prem'); setEditingId(null); setAddingNew(false); }}
          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${section === 'prem' ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-800/40 border-white/5 text-surface-300'}`}>
          PREM (60%)
        </button>
        <button onClick={() => { setSection('prom'); setEditingId(null); setAddingNew(false); }}
          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${section === 'prom' ? 'bg-accent-500/15 border-accent-500/30 text-accent-400' : 'bg-surface-800/40 border-white/5 text-surface-300'}`}>
          PROM (40%)
        </button>
      </div>

      {section === 'prom' && (
        <div className="flex gap-2">
          {DEPARTMENTS.map((d) => {
            const I = DEPT_ICONS[d.id];
            return (
              <button key={d.id} onClick={() => { setPromDept(d.id); setEditingId(null); setAddingNew(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${promDept === d.id ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-800/40 border-white/5 text-surface-300'}`}>
                {I && <I className="w-3.5 h-3.5" />}{d.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="glass-card-light overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <span className="text-xs font-semibold text-white">{questions.length} pertanyaan</span>
        </div>
        <div className="divide-y divide-white/5">
          {questions.map((q, idx) => (
            <div key={q.id} className="px-4 py-3">
              {editingId === q.id ? (
                <div className="flex items-center gap-2">
                  <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} className="flex-1 px-2 py-1.5 rounded-lg bg-surface-800/60 border border-primary-500/30 text-xs text-white resize-none" autoFocus />
                  <button onClick={handleSave} className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-surface-800/40 text-surface-300 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <div className="flex items-start justify-between group">
                  <div className="flex items-start gap-2 flex-1 pr-3">
                    <span className="text-[10px] font-mono text-surface-300/50 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-xs text-surface-200">{q.text}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => { setEditingId(q.id); setEditText(q.text); }} className="p-1 rounded text-surface-300 hover:text-primary-400 cursor-pointer"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(q.id)} className="p-1 rounded text-surface-300 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {addingNew ? (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <textarea value={newText} onChange={(e) => setNewText(e.target.value)} rows={2} placeholder="Pertanyaan baru…" className="flex-1 px-2 py-1.5 rounded-lg bg-surface-800/60 border border-primary-500/30 text-xs text-white resize-none" autoFocus />
                <button onClick={handleAdd} className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => { setAddingNew(false); setNewText(''); }} className="p-1.5 rounded-lg bg-surface-800/40 text-surface-300 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2">
              <button onClick={() => setAddingNew(true)} className="flex items-center gap-1.5 text-[11px] font-medium text-primary-400 hover:text-primary-300 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Tambah Pertanyaan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Fill Log ───────────────────────────────────────────
function FillLogTab({ fillLogs }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-surface-300">Lihat progres pengisian data dari masing-masing spesialisasi secara real-time.</p>
      <div className="glass-card-light overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 grid grid-cols-4 gap-2 text-[10px] font-semibold text-surface-300">
          <span>Rumah Sakit</span><span>Spesialisasi</span><span>Progres</span><span>Diperbarui</span>
        </div>
        <div className="divide-y divide-white/5">
          {fillLogs.map((log) => {
            const dept = DEPARTMENTS.find((d) => d.id === log.department);
            return (
              <div key={log.id} className="px-4 py-3 grid grid-cols-4 gap-2 items-center">
                <span className="text-xs text-white truncate">{log.hospitalName}</span>
                <span className="text-xs text-surface-300">{dept?.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 rounded-full bg-surface-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        log.progress >= 80 ? 'bg-emerald-500' : log.progress >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${log.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-white w-8">{log.progress}%</span>
                </div>
                <span className="text-[10px] text-surface-300">{log.updatedAt}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────
export default function AdminPage() {
  const {
    rsbkConfig, addRSBKItem, updateRSBKItem, deleteRSBKItem,
    auditConfig, updateAuditIndicator, thresholds, updateThreshold,
    prmConfig, addPREMQuestion, updatePREMQuestion, deletePREMQuestion,
    addPROMQuestion, updatePROMQuestion, deletePROMQuestion,
    fillLogs,
  } = useSupabase();

  const [activeTab, setActiveTab] = useState('rsbk');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="text-sm text-surface-300 mt-1">Kelola konfigurasi penilaian rumah sakit.</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-primary-500/15 border-primary-500/30 text-primary-400'
                : 'bg-surface-800/40 border-white/5 text-surface-300 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'rsbk' && <RSBKConfigTab rsbkConfig={rsbkConfig} addRSBKItem={addRSBKItem} updateRSBKItem={updateRSBKItem} deleteRSBKItem={deleteRSBKItem} />}
          {activeTab === 'audit' && <AuditConfigTab auditConfig={auditConfig} updateAuditIndicator={updateAuditIndicator} thresholds={thresholds} updateThreshold={updateThreshold} />}
          {activeTab === 'prm' && <PRMBankTab prmConfig={prmConfig} addPREMQuestion={addPREMQuestion} updatePREMQuestion={updatePREMQuestion} deletePREMQuestion={deletePREMQuestion} addPROMQuestion={addPROMQuestion} updatePROMQuestion={updatePROMQuestion} deletePROMQuestion={deletePROMQuestion} />}
          {activeTab === 'log' && <FillLogTab fillLogs={fillLogs} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
