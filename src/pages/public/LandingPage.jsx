import { Link } from 'react-router-dom';
import PublicNav from '../../components/PublicNav';
import { useAppStore } from '../../store/AppStore';
import {
  Search, ArrowRight, Shield, BarChart3, Users, HeartPulse, Brain, MapPin, Activity,
  Inbox, Newspaper, CalendarDays, Award, BookOpen, Building2, Globe, ChevronRight, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEPT_ICONS = { cardiology: HeartPulse, neurology: Brain };

function RankBadge({ rank }) {
  const cls = rank === 1 ? 'rank-badge-gold' : rank === 2 ? 'rank-badge-silver' : rank === 3 ? 'rank-badge-bronze' : 'bg-ice-300 text-ice-700';
  return <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${cls}`}>{rank}</div>;
}

export default function LandingPage() {
  const { publishedRankings, news, events } = useAppStore();
  const top5 = publishedRankings.slice(0, 5);
  const latestNews = news.slice(0, 3);
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter((e) => e.date >= today).slice(0, 3);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  return (
    <div className="public-page">
      <PublicNav />

      {/* ──── Hero ──── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt-900 via-cobalt-800 to-teal-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(13,148,136,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.3) 0%, transparent 50%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5" /> Standar Akreditasi Nasional
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Mendorong Mutu{' '}
              <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">
                Layanan Rumah Sakit Indonesia.
              </span>
            </h1>
            <p className="text-lg text-cobalt-200 mt-5 leading-relaxed">
              Data-driven insights, ranking terverifikasi, dan standar akreditasi untuk transformasi kualitas pelayanan rumah sakit nasional.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/ranking" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors">
                Lihat Ranking <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/methodology" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
                Pelajari Metodologi
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──── Quick Nav Cards (THE-style) ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/news', icon: Newspaper, title: 'Berita', desc: 'Informasi terkini seputar kesehatan dan perumahsakitan' },
            { to: '/ranking', icon: Award, title: 'Rankings', desc: 'Ranking nasional rumah sakit terverifikasi' },
            { to: '/events', icon: CalendarDays, title: 'Events', desc: 'Agenda dan kegiatan PERSI mendatang' },
            { to: '/methodology', icon: BookOpen, title: 'Metodologi', desc: 'Cara penilaian dan standar akreditasi' },
          ].map((card, i) => (
            <motion.div key={card.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
              <Link to={card.to} className="glass-card-white p-5 block hover:shadow-lg transition-all group h-full">
                <card.icon className="w-6 h-6 text-cobalt-600 mb-3" />
                <h3 className="text-sm font-bold text-cobalt-900 group-hover:text-teal-700 transition-colors">{card.title}</h3>
                <p className="text-xs text-ice-500 mt-1 leading-relaxed line-clamp-2">{card.desc}</p>
                <ArrowRight className="w-4 h-4 text-ice-300 mt-3 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──── Berita Terkini ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-cobalt-900 flex items-center gap-2"><Newspaper className="w-6 h-6 text-teal-600" /> Berita Terkini</h2>
            <p className="text-sm text-ice-500 mt-1">Informasi terbaru seputar kesehatan dan perumahsakitan</p>
          </div>
          {latestNews.length > 0 && (
            <Link to="/news" className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              Semua Berita <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {latestNews.length === 0 ? (
          <div className="glass-card-white p-10 text-center">
            <Newspaper className="w-10 h-10 text-ice-300 mx-auto mb-3" />
            <p className="text-sm text-ice-500">Belum ada berita. Berita akan muncul setelah admin mempublikasikannya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestNews.map((article, idx) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <Link to={`/news/${article.id}`} className="glass-card-white block overflow-hidden hover:shadow-lg transition-shadow group h-full">
                  <div className="h-32 bg-gradient-to-br from-cobalt-100 to-teal-50 flex items-center justify-center overflow-hidden">
                    {article.imageUrl ? <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      : <Newspaper className="w-8 h-8 text-cobalt-300" />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 text-[10px] font-medium border border-teal-100">{article.category}</span>
                      <span className="text-[10px] text-ice-400">{article.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-cobalt-900 group-hover:text-teal-700 transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-ice-500 mt-1 line-clamp-2">{article.summary}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ──── Scoring Modules ──── */}
      <section className="bg-cobalt-50/50 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-cobalt-900 text-center">Tiga Pilar Penilaian</h2>
          <p className="text-sm text-ice-500 text-center mt-1 mb-8">Metodologi terstandarisasi untuk ranking yang objektif</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, title: 'RSBK — 15%', desc: 'Sumber daya medis: SDM spesialis, sarana ruangan, dan alat medis terstandarisasi.', color: 'from-cobalt-500 to-cobalt-600' },
              { icon: Shield, title: 'Audit Klinis — 60%', desc: 'Kepatuhan protokol diagnosa, tatalaksana, dan outcome klinis untuk penyakit prioritas.', color: 'from-teal-500 to-teal-600' },
              { icon: Users, title: 'PRM — 25%', desc: 'Pengalaman dan hasil terapi yang dilaporkan langsung oleh pasien (PREM + PROM).', color: 'from-gold-500 to-gold-600' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-ice-100 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-cobalt-900">{f.title}</h3>
                <p className="text-sm text-ice-600 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Ranking Preview ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-cobalt-900 flex items-center gap-2"><Award className="w-6 h-6 text-gold-500" /> Ranking Rumah Sakit</h2>
            <p className="text-sm text-ice-500 mt-1">
              {top5.length > 0 ? 'Skor tertinggi yang telah terverifikasi dan dipublikasi' : 'Ranking akan muncul setelah data diverifikasi'}
            </p>
          </div>
          {top5.length > 0 && (
            <Link to="/ranking" className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {top5.length === 0 ? (
          <div className="glass-card-white p-10 text-center">
            <Inbox className="w-10 h-10 text-ice-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-cobalt-900">Ranking Belum Tersedia</h3>
            <p className="text-xs text-ice-500 mt-1 max-w-sm mx-auto">Ranking akan muncul setelah rumah sakit mengirimkan data dan diverifikasi oleh tim evaluator PERSI.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {top5.map((h, idx) => (
              <motion.div key={h.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }}>
                <Link to={`/ranking/${h.hospitalId}`} className="glass-card-white p-4 flex items-center gap-4 hover:shadow-md transition-shadow block group">
                  <RankBadge rank={idx + 1} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-cobalt-900 group-hover:text-teal-700 transition-colors truncate">{h.hospitalName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-ice-500"><MapPin className="w-3 h-3" />{h.province}</span>
                      <div className="flex gap-1">
                        {h.departments.map((d) => {
                          const I = DEPT_ICONS[d];
                          return <span key={d} className="text-xs text-ice-400">{I && <I className="w-3 h-3 inline" />}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-cobalt-900">{h.totalScore.toFixed(1)}<span className="text-xs text-ice-400">%</span></p>
                    <p className="text-[10px] text-ice-400">Total Skor</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ──── Agenda PERSI ──── */}
      <section className="bg-cobalt-50/50 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-cobalt-900 flex items-center gap-2"><CalendarDays className="w-6 h-6 text-cobalt-600" /> Agenda PERSI</h2>
              <p className="text-sm text-ice-500 mt-1">Kegiatan dan events mendatang</p>
            </div>
            {upcomingEvents.length > 0 && (
              <Link to="/events" className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700">
                Semua Events <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-ice-100 text-center">
              <CalendarDays className="w-10 h-10 text-ice-300 mx-auto mb-3" />
              <p className="text-sm text-ice-500">Belum ada event mendatang.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((evt, idx) => {
                const d = new Date(evt.date + 'T00:00');
                return (
                  <motion.div key={evt.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                    className="bg-white rounded-2xl p-5 border border-ice-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cobalt-500 to-teal-500 flex flex-col items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-white">{d.getDate()}</span>
                        <span className="text-[9px] text-white/80">{months[d.getMonth()]}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-cobalt-900 line-clamp-2">{evt.title}</h3>
                        {evt.location && <p className="text-xs text-ice-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{evt.location}</p>}
                        {evt.description && <p className="text-xs text-ice-500 mt-1 line-clamp-2">{evt.description}</p>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ──── Tentang PERSI ──── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-cobalt-900">Tentang PERSI</h2>
            <p className="text-sm text-ice-600 mt-3 leading-relaxed">
              PERSI (Perhimpunan Rumah Sakit Seluruh Indonesia) adalah organisasi profesi yang menaungi dan mempersatukan seluruh rumah sakit di Indonesia. Didirikan untuk meningkatkan mutu pelayanan kesehatan rumah sakit dan menjadi wadah komunikasi antarperumahsakitan.
            </p>
            <p className="text-sm text-ice-600 mt-3 leading-relaxed">
              <strong className="text-cobalt-900">SIAP PERSI</strong> (Sistem Informasi Akreditasi & Penilaian) adalah inisiatif digital PERSI untuk menghadirkan transparansi kualitas rumah sakit melalui data terverifikasi, audit klinis, dan survei kepuasan pasien.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: '2.900+', label: 'Rumah Sakit Anggota', icon: Building2 },
                { value: '34', label: 'Provinsi Tercakup', icon: Globe },
                { value: '3', label: 'Pilar Penilaian', icon: TrendingUp },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-cobalt-50 border border-cobalt-100">
                  <stat.icon className="w-5 h-5 text-cobalt-600 mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-cobalt-900">{stat.value}</p>
                  <p className="text-[10px] text-ice-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-cobalt-900 via-cobalt-800 to-teal-900 rounded-2xl p-8 text-white">
            <h3 className="text-lg font-bold mb-2">Visi PERSI</h3>
            <p className="text-sm text-cobalt-200 leading-relaxed mb-4">
              "Menjadi organisasi rumah sakit terdepan dalam mendorong transformasi mutu pelayanan kesehatan yang berstandar internasional."
            </p>
            <h3 className="text-lg font-bold mb-2">Misi</h3>
            <ul className="space-y-2">
              {[
                'Meningkatkan mutu pelayanan kesehatan rumah sakit',
                'Memperkuat tata kelola dan akuntabilitas rumah sakit',
                'Mendorong inovasi dan adopsi teknologi kesehatan',
                'Mengembangkan SDM kesehatan yang kompeten',
              ].map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-cobalt-200">
                  <ChevronRight className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />{m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="bg-gradient-to-r from-cobalt-900 to-teal-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Rumah Sakit Anda Sudah Terdaftar?</h2>
          <p className="text-sm text-cobalt-200 mb-6">Masuk ke portal rumah sakit untuk mengirimkan data penilaian Anda.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/portal/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors">
              Portal Rumah Sakit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/ranking" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
              <Search className="w-4 h-4" /> Cari Rumah Sakit
            </Link>
          </div>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <footer className="bg-cobalt-950 text-cobalt-300 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cobalt-600 to-teal-600 flex items-center justify-center">
                  <Activity className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-base font-bold text-white">SIAP PERSI</span>
              </div>
              <p className="text-xs text-cobalt-400 leading-relaxed">
                Sistem Informasi Akreditasi & Penilaian Rumah Sakit Seluruh Indonesia
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Navigasi</h4>
              <div className="space-y-2">
                {[{ to: '/ranking', label: 'Ranking' }, { to: '/news', label: 'Berita' }, { to: '/events', label: 'Events' }, { to: '/methodology', label: 'Metodologi' }].map((l) => (
                  <Link key={l.to} to={l.to} className="block text-xs text-cobalt-400 hover:text-white transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Portal</h4>
              <div className="space-y-2">
                <Link to="/portal/login" className="block text-xs text-cobalt-400 hover:text-white transition-colors">Login Rumah Sakit</Link>
                <Link to="/admin/login" className="block text-xs text-cobalt-400 hover:text-white transition-colors">Admin PERSI</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Kontak</h4>
              <p className="text-xs text-cobalt-400">PERSI Pusat</p>
              <p className="text-xs text-cobalt-400">Jl. HR Rasuna Said Kav. B7</p>
              <p className="text-xs text-cobalt-400">Jakarta Selatan 12920</p>
              <p className="text-xs text-cobalt-400 mt-2">info@persi.or.id</p>
            </div>
          </div>
          <div className="border-t border-cobalt-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-cobalt-500">© 2026 PERSI — Perhimpunan Rumah Sakit Seluruh Indonesia</p>
            <p className="text-xs text-cobalt-500">SIAP PERSI v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
