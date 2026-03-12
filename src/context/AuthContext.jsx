import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'siap_persi_store';
const USER_KEY = 'siap_persi_user';

// Read users directly from the store's localStorage — avoids all stale closure issues
function findUser(email, password) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw);
    return (store.users || []).find((u) => u.email === email && u.password === password) || null;
  } catch { return null; }
}

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
    await new Promise((r) => setTimeout(r, 600));
    const found = findUser(email, password);
    if (!found) {
      setError('Email atau password salah. Hubungi admin PERSI untuk mendaftarkan akun.');
      throw new Error('Invalid credentials');
    }
    const userData = {
      id: found.id, email: found.email, name: found.name,
      role: found.role, hospitalId: found.hospitalId || null,
    };
    setUser(userData);
    return userData;
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
