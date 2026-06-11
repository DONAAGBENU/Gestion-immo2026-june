import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'admin' | 'client';

export interface AuthUser {
  id:          string;
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  countryCode: string;
  address:     string;
  role:        Role;
  avatar:      string;
}

export interface RegisterData {
  firstName:   string;
  lastName:    string;
  email:       string;
  password:    string;
  phone:       string;
  countryCode: string;
  address:     string;
}

interface AuthCtx {
  user:     AuthUser | null;
  login:    (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: RegisterData)              => { ok: boolean; error?: string };
  logout:   () => void;
}

/* ── Compte admin fixe ── */
/* ── Compte admin fixe (variables d'environnement Vite) ── */
const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL ?? 'donaagbenu2000@gmail.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD ?? '',
};
const ADMIN_USER: AuthUser = {
  id: 'admin-001', firstName: 'Kossi Donatien', lastName: 'AGBENU',
  email: ADMIN_CREDENTIALS.email, phone: '93954818', countryCode: '+228',
  address: 'Lomé, Togo', role: 'admin', avatar: '',
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [clients, setClients] = useState<(AuthUser & { password: string })[]>([]);

  const login = (email: string, password: string) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser(ADMIN_USER);
      return { ok: true };
    }
    const found = clients.find(c => c.email === email && c.password === password);
    if (found) {
      const { password: _p, ...u } = found;
      setUser(u);
      return { ok: true };
    }
    return { ok: false, error: 'Email ou mot de passe incorrect.' };
  };

  const register = (data: RegisterData) => {
    if (data.email === ADMIN_CREDENTIALS.email || clients.find(c => c.email === data.email))
      return { ok: false, error: 'Cet email est déjà utilisé.' };
    const newUser: AuthUser & { password: string } = {
      id: `client-${Date.now()}`, ...data, role: 'client', avatar: '',
    };
    setClients(prev => [...prev, newUser]);
    const { password: _p, ...u } = newUser;
    setUser(u);
    return { ok: true };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}