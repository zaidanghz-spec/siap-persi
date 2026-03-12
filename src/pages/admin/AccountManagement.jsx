import { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import { DEPARTMENTS, PROVINCES } from '../../data/mockData';
import { UserPlus, Trash2, Hospital, MapPin, Mail, Lock, HeartPulse, Brain, Check, X, AlertCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };

export default function AccountManagement() {
  const { hospitals, users, createHospitalAccount, deleteHospitalAccount } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ hospitalName: '', province: '', departments: [], email: '', password: '' });
  const [formError, setFormError] = useState('');

  const hospitalUsers = users.filter((u) => u.role === 'hospital');

  const toggleDept = (id) => setForm((f) => ({
    ...f,
    departments: f.departments.includes(id) ? f.departments.filter((d) => d !== id) : [...f.departments, id],
  }));

  const handleCreate = () => {
    setFormError('');
    if (!form.hospitalName.trim()) return setFormError('Nama RS harus diisi');
    if (!form.province) return setFormError('Provinsi harus dipilih');
    if (form.departments.length === 0) return setFormError('Pilih minimal 1 spesialisasi');
    if (!form.email.trim()) return setFormError('Email harus diisi');
    if (!form.password || form.password.length < 6) return setFormError('Password minimal 6 karakter');
    if (users.some((u) => u.email === form.email.trim())) return setFormError('Email sudah terdaftar');

    createHospitalAccount({
      hospitalName: form.hospitalName.trim(),
      province: form.province,
      departments: form.departments,
      email: form.email.trim(),
      password: form.password,
    });

    setForm({ hospitalName: '', province: '', departments: [], email: '', password: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Akun Rumah Sakit</h1>
          <p className="text-sm text-ice-400 mt-1">Daftarkan akun RS baru agar mereka dapat login dan mengisi data.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setFormError(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            showForm ? 'bg-ice-700 text-ice-300' : 'bg-gradient-to-r from-teal-600 to-cobalt-600 text-white hover:opacity-90'
          }`}>
          {showForm ? <><X className="w-4 h-4" /> Batal</> : <><UserPlus className="w-4 h-4" /> Tambah Akun RS</>}
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><UserPlus className="w-4 h-4 text-teal-400" /> Daftarkan Rumah Sakit Baru</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Nama Rumah Sakit</label>
                  <div className="relative">
                    <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
                    <input type="text" value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                      placeholder="RS Cipto Mangunkusumo"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Provinsi</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
                    <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white appearance-none">
                      <option value="">Pilih Provinsi</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-ice-400 mb-1.5">Spesialisasi</label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((dept) => {
                    const active = form.departments.includes(dept.id);
                    const Icon = DEPT_ICONS[dept.id];
                    return (
                      <button key={dept.id} onClick={() => toggleDept(dept.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          active ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' : 'bg-ice-800/40 border-white/5 text-ice-400 hover:text-white'
                        }`}>
                        {Icon && <Icon className="w-3.5 h-3.5" />}{dept.name}
                        {active && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Email Login</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="admin@rs.co.id"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
                    <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{formError}</p>
              )}

              <button onClick={handleCreate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white text-sm font-semibold hover:opacity-90 cursor-pointer">
                <Check className="w-4 h-4" /> Daftarkan Akun
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hospital list */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-ice-400" />
            <span className="text-sm font-semibold text-white">{hospitals.length} Rumah Sakit Terdaftar</span>
          </div>
        </div>

        {hospitals.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Hospital className="w-10 h-10 text-ice-600 mx-auto mb-3" />
            <p className="text-sm text-ice-400">Belum ada rumah sakit terdaftar.</p>
            <p className="text-xs text-ice-500 mt-1">Klik "Tambah Akun RS" untuk mendaftarkan rumah sakit pertama.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {hospitals.map((h) => {
              const user = hospitalUsers.find((u) => u.hospitalId === h.id);
              return (
                <div key={h.id} className="px-5 py-4 flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-sm shrink-0">
                    {h.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{h.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-ice-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{h.province}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user?.email}</span>
                      <div className="flex gap-1">
                        {h.departments.map((d) => {
                          const Icon = DEPT_ICONS[d]; const dept = DEPARTMENTS.find((dp) => dp.id === d);
                          return <span key={d} className="flex items-center gap-0.5">{Icon && <Icon className="w-3 h-3" />}{dept?.name}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {deleteConfirm === h.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-rose-400">Hapus?</span>
                        <button onClick={() => { deleteHospitalAccount(h.id); setDeleteConfirm(null); }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-[11px] font-medium cursor-pointer">Ya</button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="px-2.5 py-1 rounded-lg bg-ice-700 text-ice-300 text-[11px] cursor-pointer">Batal</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(h.id)}
                        className="p-2 rounded-lg text-ice-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
