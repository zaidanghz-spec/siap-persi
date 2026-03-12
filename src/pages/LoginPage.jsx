import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Shield, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, error, clearError, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const isAdminPath = location.pathname.startsWith('/admin');

  // If already logged in, redirect or clear stale session
  useEffect(() => {
    if (user) {
      if (isAdminPath && user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (!isAdminPath && user.role === 'hospital') {
        navigate('/portal/dashboard', { replace: true });
      } else {
        logout();
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (isAdminPath && loggedInUser.role !== 'admin') {
        logout();
        return;
      }
      if (!isAdminPath && loggedInUser.role !== 'hospital') {
        logout();
        return;
      }
      if (loggedInUser.role === 'admin') navigate('/admin/dashboard');
      else navigate('/portal/dashboard');
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}>
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cobalt-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm mx-4">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isAdminPath ? 'bg-gradient-to-br from-cobalt-700 to-cobalt-900' : 'bg-gradient-to-br from-cobalt-600 to-teal-600'}`}>
              {isAdminPath ? <Shield className="w-7 h-7 text-cobalt-300" /> : <Activity className="w-7 h-7 text-white" />}
            </div>
            <h1 className="text-xl font-bold text-white">
              {isAdminPath ? 'Command Center' : 'Portal Rumah Sakit'}
            </h1>
            <p className="text-sm text-ice-400 mt-1">
              {isAdminPath ? 'Login evaluator PERSI' : 'Masuk dengan akun yang terdaftar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ice-300 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }}
                placeholder={isAdminPath ? 'admin@persi.or.id' : 'email@rumahsakit.co.id'}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-ice-400/50" autoFocus />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-ice-300 mb-1.5">Password</label>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-ice-400/50 pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-[34px] text-ice-400 hover:text-white cursor-pointer">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-400 text-center">{error}</motion.p>
            )}

            <button type="submit" disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cobalt-600 to-teal-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" /> Masuk</>}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[10px] text-ice-400/60 text-center">
              {isAdminPath
                ? 'Akses khusus evaluator PERSI'
                : 'Akun dibuat oleh admin PERSI. Hubungi admin jika belum memiliki akun.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
