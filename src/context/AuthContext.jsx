import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const USER_KEY = 'siap_persi_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = async (email, password) => {
    setError(null);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError('Email atau password salah. Hubungi admin PERSI untuk mendaftarkan akun.');
      throw err;
    }
  };

  const logout = () => { setUser(null); setError(null); };
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
