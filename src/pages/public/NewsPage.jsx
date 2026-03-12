import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicNav from '../../components/PublicNav';
import { useAppStore } from '../../store/AppStore';
import { Search, Tag, Calendar, ArrowLeft, Newspaper, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

function NewsDetail({ article, allNews }) {
  if (!article) return (
    <div className="public-page">
      <PublicNav />
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-ice-500">Berita tidak ditemukan.</p>
        <Link to="/news" className="text-teal-600 text-sm mt-2 inline-block">← Kembali ke Berita</Link>
      </div>
    </div>
  );

  const related = allNews.filter((n) => n.id !== article.id && n.category === article.category).slice(0, 3);

  return (
    <div className="public-page">
      <PublicNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-ice-500 hover:text-cobalt-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Semua Berita
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-[11px] font-medium border border-teal-100">{article.category}</span>
          <span className="text-xs text-ice-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-cobalt-900 leading-tight">{article.title}</h1>
        {article.imageUrl && <img src={article.imageUrl} alt="" className="w-full h-56 object-cover rounded-2xl mt-6" />}
        <p className="text-base text-ice-600 mt-6 leading-relaxed font-medium">{article.summary}</p>
        {article.content && <div className="mt-4 text-sm text-ice-700 leading-relaxed whitespace-pre-line">{article.content}</div>}

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-ice-100">
            <h3 className="text-lg font-bold text-cobalt-900 mb-4">Berita Terkait</h3>
            <div className="space-y-3">
              {related.map((n) => (
                <Link key={n.id} to={`/news/${n.id}`} className="block p-4 rounded-xl bg-ice-50 hover:bg-ice-100 transition-colors">
                  <h4 className="text-sm font-semibold text-cobalt-900">{n.title}</h4>
                  <p className="text-xs text-ice-500 mt-1 line-clamp-1">{n.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  const { id } = useParams();
  const { news } = useAppStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  if (id) {
    const article = news.find((n) => n.id === id);
    return <NewsDetail article={article} allNews={news} />;
  }

  const categories = [...new Set(news.map((n) => n.category))];

  const filtered = useMemo(() => {
    return news.filter((n) => {
      if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.summary.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter && n.category !== catFilter) return false;
      return true;
    });
  }, [news, search, catFilter]);

  return (
    <div className="public-page">
      <PublicNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-cobalt-900">Berita & Publikasi</h1>
          <p className="text-sm text-ice-500 mt-1">Informasi terbaru seputar kesehatan dan perumahsakitan Indonesia</p>
        </div>

        <div className="glass-card-white p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari berita…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-ice-200 text-sm text-cobalt-900 placeholder-ice-400" />
            </div>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white border border-ice-200 text-sm text-cobalt-900 w-full sm:w-48">
              <option value="">Semua Kategori</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {news.length === 0 ? (
          <div className="glass-card-white p-16 text-center">
            <Newspaper className="w-12 h-12 text-ice-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-cobalt-900">Belum Ada Berita</h3>
            <p className="text-sm text-ice-500 mt-2">Berita akan muncul setelah admin mempublikasikannya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article, idx) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Link to={`/news/${article.id}`} className="glass-card-white block overflow-hidden hover:shadow-lg transition-shadow group h-full">
                  <div className="h-36 bg-gradient-to-br from-cobalt-100 to-teal-50 flex items-center justify-center overflow-hidden">
                    {article.imageUrl ? <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      : <Newspaper className="w-8 h-8 text-cobalt-300" />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 text-[10px] font-medium border border-teal-100">{article.category}</span>
                      <span className="text-[10px] text-ice-400">{article.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-cobalt-900 group-hover:text-teal-700 transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-ice-500 mt-1.5 line-clamp-2">{article.summary}</p>
                    <span className="text-xs text-teal-600 mt-3 inline-flex items-center gap-1 font-medium">Baca selengkapnya <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
            {filtered.length === 0 && news.length > 0 && (
              <div className="col-span-full glass-card-white p-12 text-center">
                <Search className="w-10 h-10 text-ice-300 mx-auto mb-3" />
                <p className="text-sm text-ice-500">Tidak ada berita yang sesuai pencarian.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
