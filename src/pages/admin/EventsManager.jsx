import { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import { CalendarDays, Plus, Pencil, Trash2, Check, X, MapPin, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventsManager() {
  const { events, addEvent, updateEvent, deleteEvent } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '', link: '' });

  const resetForm = () => { setForm({ title: '', date: '', location: '', description: '', link: '' }); setEditingId(null); setShowForm(false); };

  const handleSave = () => {
    if (!form.title.trim() || !form.date) return;
    if (editingId) { updateEvent(editingId, form); } else { addEvent(form); }
    resetForm();
  };

  const startEdit = (evt) => {
    setForm({ title: evt.title, date: evt.date, location: evt.location, description: evt.description || '', link: evt.link || '' });
    setEditingId(evt.id);
    setShowForm(true);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Events</h1>
          <p className="text-sm text-ice-400 mt-1">Tambah dan kelola agenda kegiatan PERSI.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${showForm ? 'bg-ice-700 text-ice-300' : 'bg-gradient-to-r from-teal-600 to-cobalt-600 text-white hover:opacity-90'}`}>
          {showForm ? <><X className="w-4 h-4" /> Batal</> : <><Plus className="w-4 h-4" /> Tambah Event</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">{editingId ? 'Edit Event' : 'Event Baru'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Nama Event</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="PERSI Annual Conference 2026" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Tanggal</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Lokasi</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Jakarta Convention Center" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Link Registrasi (opsional)</label>
                  <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-ice-400 mb-1.5">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  placeholder="Detail kegiatan…" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50 resize-none" />
              </div>
              <button onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white text-sm font-semibold hover:opacity-90 cursor-pointer">
                <Check className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <span className="text-sm font-semibold text-white flex items-center gap-2"><CalendarDays className="w-4 h-4 text-ice-400" />{events.length} Events</span>
        </div>
        {events.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CalendarDays className="w-10 h-10 text-ice-600 mx-auto mb-3" />
            <p className="text-sm text-ice-400">Belum ada event.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {events.map((evt) => {
              const isPast = evt.date < today;
              return (
                <div key={evt.id} className={`px-5 py-4 flex items-start gap-4 group ${isPast ? 'opacity-50' : ''}`}>
                  <div className="w-14 text-center shrink-0">
                    <p className="text-lg font-bold text-white">{new Date(evt.date + 'T00:00').getDate()}</p>
                    <p className="text-[10px] text-ice-400 uppercase">{new Date(evt.date + 'T00:00').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{evt.title}</h4>
                    {evt.location && <p className="text-xs text-ice-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</p>}
                    {evt.description && <p className="text-xs text-ice-500 mt-1 line-clamp-1">{evt.description}</p>}
                    {evt.link && <a href={evt.link} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-400 hover:text-teal-300 mt-1 inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" />Registrasi</a>}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    {deleteConfirm === evt.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => { deleteEvent(evt.id); setDeleteConfirm(null); }} className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-[11px] cursor-pointer">Hapus</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 rounded-lg bg-ice-700 text-ice-300 text-[11px] cursor-pointer">Batal</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => startEdit(evt)} className="p-2 rounded-lg text-ice-500 hover:text-cobalt-400 opacity-0 group-hover:opacity-100 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(evt.id)} className="p-2 rounded-lg text-ice-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </>
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
