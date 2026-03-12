import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/AppStore';
import { PRM_DATA, DEPARTMENTS } from '../../data/mockData';
import { QrCode, Plus, User, Check, Clock, Copy, ExternalLink, MessageSquare, ClipboardList, AlertCircle, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StepPRM({ departments, premAnswers, promAnswers, onPremAnswer, onPromAnswer }) {
  const { user } = useAuth();
  const { patientSurveys = [], createSurveyToken, deleteSurvey } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientName: '', rmNumber: '', department: departments[0] || '' });
  const [formError, setFormError] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Surveys for this hospital
  const surveys = useMemo(() =>
    (patientSurveys || []).filter((sv) => sv.hospitalId === user?.hospitalId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [patientSurveys, user?.hospitalId]
  );

  const completed = surveys.filter((s) => s.status === 'completed');
  const pending = surveys.filter((s) => s.status === 'pending');

  // Auto-aggregate scores from completed surveys
  const avgPrem = completed.length > 0
    ? (completed.reduce((sum, s) => sum + (s.premScore || 0), 0) / completed.length).toFixed(1)
    : '—';
  const avgProm = completed.length > 0
    ? (completed.reduce((sum, s) => sum + (s.promScore || 0), 0) / completed.length).toFixed(1)
    : '—';
  const avgTotal = completed.length > 0
    ? (completed.reduce((sum, s) => sum + (s.totalPrmScore || 0), 0) / completed.length).toFixed(1)
    : '—';

  // Sync aggregated scores back to parent after render
  useEffect(() => {
    if (completed.length > 0) {
      const premAvgVal = completed.reduce((sum, s) => sum + (s.premScore || 0), 0) / completed.length;
      const promAvgVal = completed.reduce((sum, s) => sum + (s.promScore || 0), 0) / completed.length;
      onPremAnswer('__aggregate_score', premAvgVal);
      onPromAnswer('__aggregate_score', promAvgVal);
      onPremAnswer('__count', completed.length);
      onPromAnswer('__count', completed.length);
    }
  }, [completed.length]);

  const handleCreate = () => {
    setFormError('');
    if (!form.patientName.trim()) return setFormError('Nama pasien harus diisi');
    if (!form.rmNumber.trim()) return setFormError('No. RM harus diisi');
    if (!form.department) return setFormError('Pilih departemen');

    const token = createSurveyToken({
      hospitalId: user.hospitalId,
      patientName: form.patientName.trim(),
      rmNumber: form.rmNumber.trim(),
      department: form.department,
    });
    setGeneratedToken(token);
    setForm({ patientName: '', rmNumber: '', department: departments[0] || '' });
  };

  const getSurveyUrl = (token) => `${window.location.origin}/survey/${token}`;
  const getQrImageUrl = (token) => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getSurveyUrl(token))}`;

  const copyLink = (token) => {
    navigator.clipboard.writeText(getSurveyUrl(token)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const deptName = (id) => DEPARTMENTS.find((d) => d.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Modul PRM</h2>
        <p className="text-sm text-ice-400 mt-1">
          Patient-Reported Measures: PREM (60%) + PROM (40%). Bobot: <span className="text-gold-500 font-semibold">25%</span> dari total skor.
        </p>
        <p className="text-xs text-ice-500 mt-1">
          Daftarkan pasien → Generate QR → Pasien isi survey di HP mereka → Skor otomatis teragregasi.
        </p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cobalt-500/15 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-cobalt-400" />
          </div>
          <div>
            <p className="text-[11px] text-ice-400">PREM (60%)</p>
            <p className="text-xl font-bold text-white">{avgPrem}<span className="text-xs text-ice-400 ml-1">/ 100</span></p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-gold-500" />
          </div>
          <div>
            <p className="text-[11px] text-ice-400">PROM (40%)</p>
            <p className="text-xl font-bold text-white">{avgProm}<span className="text-xs text-ice-400 ml-1">/ 100</span></p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/15 flex items-center justify-center">
            <Check className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <p className="text-[11px] text-ice-400">Total PRM</p>
            <p className="text-xl font-bold text-white">{avgTotal}<span className="text-xs text-ice-400 ml-1">/ 100</span></p>
          </div>
        </div>
      </div>

      {/* Add Patient */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-ice-400">{completed.length} selesai • {pending.length} menunggu</span>
        </div>
        <button onClick={() => { setShowForm(!showForm); setGeneratedToken(null); setFormError(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            showForm ? 'bg-ice-700 text-ice-300' : 'bg-gradient-to-r from-teal-600 to-cobalt-600 text-white hover:opacity-90'
          }`}>
          {showForm ? <><X className="w-3.5 h-3.5" /> Tutup</> : <><Plus className="w-3.5 h-3.5" /> Tambah Pasien</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-ice-400 mb-1">Nama Pasien<span className="text-rose-400">*</span></label>
                  <input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    placeholder="Nama lengkap"
                    className="w-full px-3 py-2 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1">No. RM<span className="text-rose-400">*</span></label>
                  <input value={form.rmNumber} onChange={(e) => setForm({ ...form, rmNumber: e.target.value })}
                    placeholder="RM-001234"
                    className="w-full px-3 py-2 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1">Departemen<span className="text-rose-400">*</span></label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white appearance-none">
                    <option value="">Pilih...</option>
                    {departments.map((d) => <option key={d} value={d}>{deptName(d)}</option>)}
                  </select>
                </div>
              </div>

              {formError && <p className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{formError}</p>}

              <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white text-xs font-semibold hover:opacity-90 cursor-pointer">
                <QrCode className="w-3.5 h-3.5" /> Generate QR Code
              </button>

              {generatedToken && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/5 border border-teal-500/20 text-center space-y-3">
                  <p className="text-xs text-teal-400 font-semibold">✅ QR Code Berhasil!</p>
                  <div className="inline-block p-2 bg-white rounded-xl">
                    <img src={getQrImageUrl(generatedToken)} alt="QR" className="w-40 h-40" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => copyLink(generatedToken)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cobalt-500/15 text-cobalt-400 text-[11px] font-medium hover:bg-cobalt-500/25 cursor-pointer">
                      {copied ? <><Check className="w-3 h-3" /> Tersalin!</> : <><Copy className="w-3 h-3" /> Salin Link</>}
                    </button>
                    <a href={getSurveyUrl(generatedToken)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/15 text-teal-400 text-[11px] font-medium hover:bg-teal-500/25">
                      <ExternalLink className="w-3 h-3" /> Preview
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Survey List */}
      {surveys.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs font-semibold text-ice-400">Daftar Survey Pasien</span>
          </div>
          <div className="divide-y divide-white/5">
            {surveys.map((sv) => (
              <div key={sv.id} className="px-4 py-3 flex items-center gap-3 group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  sv.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold-500/10 text-gold-500'
                }`}>
                  {sv.status === 'completed' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{sv.patientName}</p>
                  <p className="text-[11px] text-ice-400">
                    RM: {sv.rmNumber} • {deptName(sv.department)}
                    {sv.status === 'completed' && <span className="text-emerald-400 ml-2">Skor: {sv.totalPrmScore?.toFixed(1)}</span>}
                    {sv.status === 'pending' && <span className="text-gold-500 ml-2">Menunggu diisi</span>}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {sv.status === 'pending' && (
                    <button onClick={() => copyLink(sv.id)} title="Salin link" className="p-1.5 rounded-lg text-cobalt-400 hover:bg-cobalt-500/10 cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {deleteConfirm === sv.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => { deleteSurvey(sv.id); setDeleteConfirm(null); }}
                        className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-[10px] font-medium cursor-pointer">Ya</button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 rounded-lg bg-ice-700 text-ice-300 text-[10px] cursor-pointer">Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(sv.id)}
                      className="p-1.5 rounded-lg text-ice-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {surveys.length === 0 && !showForm && (
        <div className="glass-card p-8 text-center">
          <QrCode className="w-10 h-10 text-ice-600 mx-auto mb-3" />
          <p className="text-sm text-ice-400 mb-1">Belum ada survey pasien</p>
          <p className="text-xs text-ice-500">Klik "Tambah Pasien" untuk mendaftarkan pasien dan generate QR code survey.</p>
        </div>
      )}

      {completed.length === 0 && surveys.length > 0 && (
        <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20">
          <p className="text-xs text-gold-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Belum ada pasien yang menyelesaikan survey. Skor PRM akan dihitung otomatis setelah survey selesai diisi.
          </p>
        </div>
      )}
    </div>
  );
}
