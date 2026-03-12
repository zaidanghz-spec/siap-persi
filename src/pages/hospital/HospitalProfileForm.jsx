import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/AppStore';
import { Building2, MapPin, Phone, Mail, Globe, Calendar, Shield, Bed, Users, UserCheck, Save, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PROVINCES } from '../../data/mockData';

const RS_TYPES = ['Tipe A', 'Tipe B', 'Tipe C', 'Tipe D'];
const ACCREDITATION = ['Paripurna', 'Utama', 'Madya', 'Dasar', 'Belum Terakreditasi'];

const INIT = {
  namaRS: '', alamat: '', kota: '', provinsi: '', telepon: '', email: '',
  website: '', tahunBerdiri: '', tipeRS: '', akreditasi: '',
  tempatTidur: '', jumlahDokter: '', jumlahPerawat: '',
  namaDirektur: '', emailDirektur: '',
};

export default function HospitalProfileForm() {
  const { user } = useAuth();
  const { hospitals, updateHospitalProfile } = useAppStore();
  const hospital = hospitals.find((h) => h.id === user?.hospitalId);
  const [form, setForm] = useState(INIT);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (hospital?.profile) {
      setForm((prev) => ({ ...prev, ...hospital.profile, namaRS: hospital.profile.namaRS || hospital.name }));
    } else if (hospital) {
      setForm((prev) => ({ ...prev, namaRS: hospital.name, provinsi: hospital.province }));
    }
  }, [hospital]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  const validate = () => {
    const e = {};
    if (!form.namaRS.trim()) e.namaRS = true;
    if (!form.alamat.trim()) e.alamat = true;
    if (!form.kota.trim()) e.kota = true;
    if (!form.provinsi) e.provinsi = true;
    if (!form.telepon.trim()) e.telepon = true;
    if (!form.email.trim()) e.email = true;
    if (!form.tipeRS) e.tipeRS = true;
    if (!form.akreditasi) e.akreditasi = true;
    if (!form.namaDirektur.trim()) e.namaDirektur = true;
    if (!form.emailDirektur.trim()) e.emailDirektur = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateHospitalProfile(hospital.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, icon: Icon, field, type = 'text', placeholder, required }) => (
    <div>
      <label className="block text-xs text-ice-400 mb-1.5">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
        <input type={type} value={form[field]} onChange={(e) => set(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-ice-800/60 border text-sm text-white placeholder-ice-400/50 ${errors[field] ? 'border-rose-500/50' : 'border-white/10'}`} />
      </div>
    </div>
  );

  const Select = ({ label, icon: Icon, field, options, required }) => (
    <div>
      <label className="block text-xs text-ice-400 mb-1.5">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
        <select value={form[field]} onChange={(e) => set(field, e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-ice-800/60 border text-sm text-white appearance-none ${errors[field] ? 'border-rose-500/50' : 'border-white/10'}`}>
          <option value="">Pilih...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profil Rumah Sakit</h1>
        <p className="text-sm text-ice-400 mt-1">Lengkapi data umum RS sebelum mengisi assessment. Data ini tidak dinilai.</p>
      </div>

      {/* Informasi Umum */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-teal-400" /> Informasi Umum</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Rumah Sakit" icon={Building2} field="namaRS" placeholder="RS Umum Harapan Sehat" required />
          <Field label="Alamat Lengkap" icon={MapPin} field="alamat" placeholder="Jl. Contoh No. 123" required />
          <Field label="Kota" icon={MapPin} field="kota" placeholder="Jakarta" required />
          <Select label="Provinsi" icon={MapPin} field="provinsi" options={PROVINCES} required />
          <Field label="Nomor Telepon" icon={Phone} field="telepon" placeholder="021-12345678" required />
          <Field label="Email" icon={Mail} field="email" type="email" placeholder="info@rumahsakit.com" required />
          <Field label="Website (Opsional)" icon={Globe} field="website" placeholder="https://www.rumahsakit.com" />
          <div>
            <label className="block text-xs text-ice-400 mb-1.5">Tahun Berdiri</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
              <input type="number" min="1900" max="2026" value={form.tahunBerdiri} onChange={(e) => set('tahunBerdiri', e.target.value)}
                placeholder="2000" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Klasifikasi & Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-cobalt-400" /> Klasifikasi & Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Tipe Rumah Sakit" icon={Shield} field="tipeRS" options={RS_TYPES} required />
          <Select label="Status Akreditasi" icon={Shield} field="akreditasi" options={ACCREDITATION} required />
        </div>
      </motion.div>

      {/* Kapasitas */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2"><Bed className="w-5 h-5 text-gold-500" /> Kapasitas & Sumber Daya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-ice-400 mb-1.5">Kapasitas Tempat Tidur<span className="text-rose-400 ml-0.5">*</span></label>
            <input type="number" min="0" value={form.tempatTidur} onChange={(e) => set('tempatTidur', e.target.value)}
              placeholder="200" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-ice-400 mb-1.5">Jumlah Dokter</label>
            <input type="number" min="0" value={form.jumlahDokter} onChange={(e) => set('jumlahDokter', e.target.value)}
              placeholder="50" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-ice-400 mb-1.5">Jumlah Perawat</label>
            <input type="number" min="0" value={form.jumlahPerawat} onChange={(e) => set('jumlahPerawat', e.target.value)}
              placeholder="150" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white" />
          </div>
        </div>
      </motion.div>

      {/* Penanggung Jawab */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2"><UserCheck className="w-5 h-5 text-emerald-400" /> Penanggung Jawab</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Direktur / PJ" icon={UserCheck} field="namaDirektur" placeholder="Dr. Nama Direktur, Sp.X" required />
          <Field label="Email Direktur" icon={Mail} field="emailDirektur" type="email" placeholder="direktur@rumahsakit.com" required />
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer">
          <Save className="w-4 h-4" /> Simpan Profil
        </button>
        {saved && (
          <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-sm text-emerald-400">
            <Check className="w-4 h-4" /> Tersimpan!
          </motion.span>
        )}
        {Object.keys(errors).length > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-rose-400">
            <AlertCircle className="w-4 h-4" /> Lengkapi semua field bertanda *
          </span>
        )}
      </div>
    </div>
  );
}
