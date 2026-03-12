import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS } from '../../data/mockData';
import { QrCode, Plus, User, FileText, Check, Clock, Trash2, X, Copy, ExternalLink, BarChart3, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientSurveyManager() {
  const { user } = useAuth();
  const { hospitals, patientSurveys = [], createSurveyToken, deleteSurvey } = useAppStore();
  const hospital = hospitals.find((h) => h.id === user?.hospitalId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientName: '', rmNumber: '', department: '' });
  const [formError, setFormError] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copied, setCopied] = useState(false);

  const surveys = useMemo(() =>
    (patientSurveys || []).filter((sv) => sv.hospitalId === user?.hospitalId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [patientSurveys, user?.hospitalId]
  );

  const completed = surveys.filter((s) => s.status === 'completed');
  const pending = surveys.filter((s) => s.status === 'pending');

  const avgPrm = completed.length > 0
    ? (completed.reduce((sum, s) => sum + (s.totalPrmScore || 0), 0) / completed.length).toFixed(1)
    : '—';

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
    setForm({ patientName: '', rmNumber: '', department: '' });
  };

  const getSurveyUrl = (token) => {
    const base = window.location.origin;
    return `${base}/survey/${token}`;
  };

  const getQrImageUrl = (token) => {
    const url = encodeURIComponent(getSurveyUrl(token));
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${url}`;
  };

  const copyLink = (token) => {
    navigator.clipboard.writeText(getSurveyUrl(token)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const deptName = (id) => DEPARTMENTS.find((d) => d.id === id)?.name || id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Survey Pasien (PREM/PROM)</h1>
          <p className="text-sm text-ice-400 mt-1">Daftarkan pasien, generate QR code, pasien isi survey di HP mereka.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setGeneratedToken(null); setFormError(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            showForm ? 'bg-ice-700 text-ice-300' : 'bg-gradient-to-r from-teal-600 to-cobalt-600 text-white hover:opacity-90'
          }`}>
          {showForm ? <><X className="w-4 h-4" /> Tutup</> : <><Plus className="w-4 h-4" /> Tambah Pasien</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-ice-400 mb-1">Total Survey</p>
          <p className="text-2xl font-bold text-white">{surveys.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-ice-400 mb-1">Sudah Diisi</p>
          <p className="text-2xl font-bold text-emerald-400">{completed.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-ice-400 mb-1">Rata-rata PRM</p>
          <p className="text-2xl font-bold text-gold-500">{avgPrm}</p>
        </div>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><User className="w-4 h-4 text-teal-400" /> Daftarkan Pasien Baru</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Nama Pasien<span className="text-rose-400 ml-0.5">*</span></label>
                  <input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    placeholder="Nama lengkap pasien"
                    className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">No. Rekam Medis<span className="text-rose-400 ml-0.5">*</span></label>
                  <input value={form.rmNumber} onChange={(e) => setForm({ ...form, rmNumber: e.target.value })}
                    placeholder="RM-001234"
                    className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Departemen<span className="text-rose-400 ml-0.5">*</span></label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white appearance-none">
                    <option value="">Pilih departemen</option>
                    {(hospital?.departments || []).map((d) => (
                      <option key={d} value={d}>{deptName(d)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formError && <p className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{formError}</p>}

              <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white text-sm font-semibold hover:opacity-90 cursor-pointer">
                <QrCode className="w-4 h-4" /> Generate QR Code
              </button>

              {/* QR Result */}
              {generatedToken && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-5 rounded-xl bg-white/5 border border-teal-500/20 text-center space-y-3">
                  <p className="text-sm text-teal-400 font-semibold">✅ QR Code Berhasil Dibuat!</p>
                  <p className="text-xs text-ice-400">Minta pasien scan QR code di bawah ini dengan kamera HP:</p>
                  <div className="inline-block p-3 bg-white rounded-2xl">
                    <img src={getQrImageUrl(generatedToken)} alt="QR Code Survey" className="w-48 h-48" />
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button onClick={() => copyLink(generatedToken)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cobalt-500/15 text-cobalt-400 text-xs font-medium hover:bg-cobalt-500/25 cursor-pointer">
                      {copied ? <><Check className="w-3.5 h-3.5" /> Tersalin!</> : <><Copy className="w-3.5 h-3.5" /> Salin Link</>}
                    </button>
                    <a href={getSurveyUrl(generatedToken)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500/15 text-teal-400 text-xs font-medium hover:bg-teal-500/25">
                      <ExternalLink className="w-3.5 h-3.5" /> Preview
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Survey List */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-ice-400" /> {surveys.length} Survey Pasien
          </span>
        </div>

        {surveys.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <QrCode className="w-10 h-10 text-ice-600 mx-auto mb-3" />
            <p className="text-sm text-ice-400">Belum ada survey pasien.</p>
            <p className="text-xs text-ice-500 mt-1">Klik "Tambah Pasien" untuk memulai.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {surveys.map((sv) => (
              <div key={sv.id} className="px-5 py-4 flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  sv.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold-500/10 text-gold-500'
                }`}>
                  {sv.status === 'completed' ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{sv.patientName}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ice-400">
                    <span>RM: {sv.rmNumber}</span>
                    <span>{deptName(sv.department)}</span>
                    <span>{sv.createdAt}</span>
                    {sv.status === 'completed' && (
                      <span className="text-emerald-400 font-medium">Skor: {sv.totalPrmScore?.toFixed(1)}</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {sv.status === 'pending' && (
                    <button onClick={() => copyLink(sv.id)} title="Salin link survey"
                      className="p-2 rounded-lg text-cobalt-400 hover:bg-cobalt-500/10 cursor-pointer">
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                  {deleteConfirm === sv.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-rose-400">Hapus?</span>
                      <button onClick={() => { deleteSurvey(sv.id); setDeleteConfirm(null); }}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-[11px] font-medium cursor-pointer">Ya</button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="px-2.5 py-1 rounded-lg bg-ice-700 text-ice-300 text-[11px] cursor-pointer">Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(sv.id)}
                      className="p-2 rounded-lg text-ice-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
