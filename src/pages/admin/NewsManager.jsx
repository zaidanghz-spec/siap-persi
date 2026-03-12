import { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import { Newspaper, Plus, Pencil, Trash2, Check, X, AlertCircle, Image, Tag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Akreditasi', 'Kebijakan', 'Inovasi', 'Edukasi', 'Regulasi', 'Lainnya'];

export default function NewsManager() {
  const { news, addNews, updateNews, deleteNews } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ title: '', summary: '', content: '', category: 'Akreditasi', imageUrl: '' });

  const resetForm = () => { setForm({ title: '', summary: '', content: '', category: 'Akreditasi', imageUrl: '' }); setEditingId(null); setShowForm(false); };

  const handleSave = () => {
    if (!form.title.trim() || !form.summary.trim()) return;
    if (editingId) { updateNews(editingId, form); } else { addNews(form); }
    resetForm();
  };

  const startEdit = (article) => {
    setForm({ title: article.title, summary: article.summary, content: article.content || '', category: article.category, imageUrl: article.imageUrl || '' });
    setEditingId(article.id);
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Berita</h1>
          <p className="text-sm text-ice-400 mt-1">Tambah dan kelola berita yang tampil di homepage publik.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${showForm ? 'bg-ice-700 text-ice-300' : 'bg-gradient-to-r from-teal-600 to-cobalt-600 text-white hover:opacity-90'}`}>
          {showForm ? <><X className="w-4 h-4" /> Batal</> : <><Plus className="w-4 h-4" /> Tambah Berita</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">{editingId ? 'Edit Berita' : 'Berita Baru'}</h3>
              <div>
                <label className="block text-xs text-ice-400 mb-1.5">Judul</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Judul berita…" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
              </div>
              <div>
                <label className="block text-xs text-ice-400 mb-1.5">Ringkasan</label>
                <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2}
                  placeholder="Ringkasan singkat untuk preview…" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-ice-400 mb-1.5">Konten (opsional)</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4}
                  placeholder="Isi lengkap berita…" className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50 resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white appearance-none">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-ice-400 mb-1.5">URL Gambar (opsional)</label>
                  <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-ice-800/60 border border-white/10 text-sm text-white placeholder-ice-400/50" />
                </div>
              </div>
              <button onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cobalt-600 text-white text-sm font-semibold hover:opacity-90 cursor-pointer">
                <Check className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Publikasikan'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <span className="text-sm font-semibold text-white flex items-center gap-2"><Newspaper className="w-4 h-4 text-ice-400" />{news.length} Berita</span>
        </div>
        {news.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Newspaper className="w-10 h-10 text-ice-600 mx-auto mb-3" />
            <p className="text-sm text-ice-400">Belum ada berita.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {news.map((article) => (
              <div key={article.id} className="px-5 py-4 flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-cobalt-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {article.imageUrl ? <img src={article.imageUrl} alt="" className="w-full h-full object-cover" /> : <Newspaper className="w-5 h-5 text-cobalt-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{article.title}</h4>
                  <p className="text-xs text-ice-400 mt-0.5 line-clamp-1">{article.summary}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ice-500">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{article.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {deleteConfirm === article.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { deleteNews(article.id); setDeleteConfirm(null); }} className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-[11px] font-medium cursor-pointer">Hapus</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 rounded-lg bg-ice-700 text-ice-300 text-[11px] cursor-pointer">Batal</button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => startEdit(article)} className="p-2 rounded-lg text-ice-500 hover:text-cobalt-400 opacity-0 group-hover:opacity-100 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(article.id)} className="p-2 rounded-lg text-ice-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </>
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
