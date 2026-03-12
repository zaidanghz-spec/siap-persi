import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/news', label: 'Berita' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/events', label: 'Events' },
  { to: '/methodology', label: 'Metodologi' },
];

export default function PublicNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-cobalt-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cobalt-600 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-cobalt-900">SIAP</span>
              <span className="text-base font-bold text-teal-600 ml-1">PERSI</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-cobalt-700 bg-cobalt-50'
                    : 'text-ice-600 hover:text-cobalt-700 hover:bg-cobalt-50/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/portal/login"
              className="ml-3 px-5 py-2.5 rounded-xl border-2 border-teal-600 text-teal-700 text-sm font-semibold hover:bg-teal-600 hover:text-white transition-all animate-pulse-teal"
            >
              Portal Rumah Sakit
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-ice-600 cursor-pointer">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-cobalt-100 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-ice-700 hover:bg-cobalt-50">
                {link.label}
              </Link>
            ))}
            <Link to="/portal" onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50">
              Portal Rumah Sakit
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
