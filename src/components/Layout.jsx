import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  BookOpen,
  LogOut,
  Menu,
  X,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/data-entry', label: 'Pengisian Data', icon: ClipboardList },
  { to: '/methodology', label: 'Metodologi', icon: BookOpen },
  { to: '/admin', label: 'Admin', icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 260 : 72 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative flex flex-col border-r border-white/5 bg-surface-950/80 backdrop-blur-xl z-20"
        >
          {/* Logo area */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-sm font-bold text-white whitespace-nowrap">
                  Hospital Ranking
                </h1>
                <p className="text-[10px] text-surface-300 whitespace-nowrap">
                  National System
                </p>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-surface-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-white/5">
            {sidebarOpen ? (
              <div className="glass-card-light p-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-surface-300 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full h-10 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-700 transition-colors z-30 cursor-pointer"
          >
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                sidebarOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </motion.aside>
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 border-b border-white/5 bg-surface-900/60 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-surface-300 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div />
          <div className="flex items-center gap-3">
            <span className="text-xs text-surface-300 hidden sm:block">
              Logged in as <span className="text-white font-medium">{user?.name}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
