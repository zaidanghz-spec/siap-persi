import PublicNav from '../../components/PublicNav';
import { useAppStore } from '../../store/AppStore';
import { CalendarDays, MapPin, ExternalLink, Inbox, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventsPage() {
  const { events } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today).reverse();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  function EventCard({ evt, isPast }) {
    const d = new Date(evt.date + 'T00:00');
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={`glass-card-white p-5 flex gap-5 ${isPast ? 'opacity-60' : ''}`}>
        <div className="w-16 text-center shrink-0">
          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${isPast ? 'bg-ice-100' : 'bg-gradient-to-br from-cobalt-500 to-teal-500'}`}>
            <span className={`text-lg font-bold ${isPast ? 'text-ice-500' : 'text-white'}`}>{d.getDate()}</span>
            <span className={`text-[10px] font-medium ${isPast ? 'text-ice-400' : 'text-white/80'}`}>{months[d.getMonth()]}</span>
          </div>
          <p className="text-[10px] text-ice-400 mt-1">{d.getFullYear()}</p>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-cobalt-900">{evt.title}</h3>
          {evt.location && <p className="text-xs text-ice-500 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{evt.location}</p>}
          {evt.description && <p className="text-sm text-ice-600 mt-2 leading-relaxed">{evt.description}</p>}
          {evt.link && (
            <a href={evt.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-cobalt-50 text-cobalt-700 text-xs font-semibold hover:bg-cobalt-100 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Registrasi
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="public-page">
      <PublicNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-cobalt-900">Agenda PERSI</h1>
          <p className="text-sm text-ice-500 mt-1">Kegiatan, konferensi, dan seminar terkait perumahsakitan</p>
        </div>

        {events.length === 0 ? (
          <div className="glass-card-white p-16 text-center">
            <CalendarDays className="w-12 h-12 text-ice-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-cobalt-900">Belum Ada Event</h3>
            <p className="text-sm text-ice-500 mt-2">Jadwal kegiatan akan ditampilkan di sini.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> Akan Datang
                </h2>
                <div className="space-y-3">
                  {upcoming.map((evt) => <EventCard key={evt.id} evt={evt} />)}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-ice-500 uppercase tracking-wider mb-3">Selesai</h2>
                <div className="space-y-3">
                  {past.map((evt) => <EventCard key={evt.id} evt={evt} isPast />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
