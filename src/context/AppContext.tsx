import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Theme = 'dark' | 'light';
export type Lang  = 'fr'   | 'en';

export interface ProfileData {
  firstName: string; lastName: string; email: string;
  phone: string; countryCode: string; address: string;
  role: string; avatar: string;
}

interface AppCtx {
  theme: Theme; lang: Lang;
  setTheme: (t: Theme) => void;
  setLang:  (l: Lang)  => void;
  t: (k: string) => string;
  profile: ProfileData;
  setProfile: (p: ProfileData) => void;
  /** Navigation inter-composants */
  navigateTo: (page: string, payload?: Record<string, string>) => void;
  navPayload: Record<string, string> | null;
  currentPage: string;
  _setCurrentPage: (p: string) => void;
  _setNavPayload: (pl: Record<string, string> | null) => void;
}

const TR: Record<Lang, Record<string, string>> = {
  fr: {
    dashboard:'Tableau de bord', properties:'Propriétés', tenants:'Locataires',
    payments:'Paiements', maintenance:'Maintenance', analytics:'Analyses',
    settings:'Paramètres', search:'Rechercher...',
    notifications:'Notifications', contracts:'Contrats',
    calendar:'Calendrier', messages:'Messages', map:'Carte',
  },
  en: {
    dashboard:'Dashboard', properties:'Properties', tenants:'Tenants',
    payments:'Payments', maintenance:'Maintenance', analytics:'Analytics',
    settings:'Settings', search:'Search...',
    notifications:'Notifications', contracts:'Contracts',
    calendar:'Calendar', messages:'Messages', map:'Map',
  },
};

const AppContext = createContext<AppCtx | null>(null);

export function AppProvider({ children, initialProfile }: { children: ReactNode; initialProfile: ProfileData }) {
  const [theme,       setTheme]       = useState<Theme>('dark');
  const [lang,        setLang]        = useState<Lang>('fr');
  const [profile,     setProfile]     = useState<ProfileData>(initialProfile);
  const [currentPage, _setCurrentPage] = useState('dashboard');
  const [navPayload,  _setNavPayload]  = useState<Record<string, string> | null>(null);

  const t = (k: string) => TR[lang][k] ?? k;

  const navigateTo = useCallback((page: string, payload?: Record<string, string>) => {
    _setCurrentPage(page);
    _setNavPayload(payload ?? null);
  }, []);

  return (
    <AppContext.Provider value={{
      theme, lang, setTheme, setLang, t,
      profile, setProfile,
      navigateTo, navPayload, currentPage,
      _setCurrentPage, _setNavPayload,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}