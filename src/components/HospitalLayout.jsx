import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ClipboardList, Building2, QrCode, History, HelpCircle, LogOut, Activity, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/portal/profile', label: 'Profil RS', icon: Building2 },
  { to: '/portal/surveys', label: 'Survey Pasien', icon: QrCode },
  { to: '/portal/data-entry', label: 'Pengisian Data', icon: ClipboardList },
];

export default function HospitalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="portal-page flex h-screen overflow-hidden">
      <motion.aside initial={false} animate={{ width: sidebarOpen ? 260 : 72 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex flex-col border-r border-white/5 bg-ice-950/80 backdrop-blur-xl z-20">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cobalt-600 to-teal-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-sm font-bold text-white whitespace-nowrap">SIAP PERSI</h1>
              <p className="text-[10px] text-teal-400 whitespace-nowrap">Portal Rumah Sakit</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-teal-500/15 text-teal-400' : 'text-ice-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          {sidebarOpen ? (
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cobalt-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {user?.name?.charAt(0) || 'H'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-ice-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer">
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="flex items-center justify-center w-full h-10 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer" title="Keluar">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-ice-800 border border-white/10 flex items-center justify-center text-ice-300 hover:text-white z-30 cursor-pointer">
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-6 border-b border-white/5 bg-ice-900/60 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg text-ice-400 hover:text-white cursor-pointer">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div />
          <span className="text-xs text-ice-400">Masuk sebagai <span className="text-white font-medium">{user?.name}</span></span>
        </header>
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  );
}
