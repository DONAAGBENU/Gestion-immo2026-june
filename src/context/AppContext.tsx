import { createContext, useContext, useState, ReactNode } from 'react';

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
  const [theme,   setTheme]   = useState<Theme>('dark');
  const [lang,    setLang]    = useState<Lang>('fr');
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const t = (k: string) => TR[lang][k] ?? k;
  return (
    <AppContext.Provider value={{ theme, lang, setTheme, setLang, t, profile, setProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}