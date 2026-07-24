import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp, ProfileData } from './context/AppContext';
import { usePWA } from './hooks/usePWA';
import { Download } from 'lucide-react';

import AuthPage    from './components/AuthPage';
import Welcome     from './components/WelcomePage';
import Sidebar     from './components/Sidebar';
import Header      from './components/Header';
import Dashboard   from './components/Dashboard';
import Properties  from './components/Properties';
import Tenants     from './components/Tenants';
import Payments    from './components/Payments';
import Maintenance from './components/Maintenance';
import Settings    from './components/Settings';
import Analytics   from './components/Analytics';
import Notifications from './components/Notifications';
import Contracts   from './components/Contracts';
import CalendarPage from './components/CalendarPage';
import Messages    from './components/Messages';
import MapPage     from './components/MapPage';

/*
  Règle d'accès :
  admin  → toutes les pages
  client → dashboard, properties, messages, notifications, settings
*/
const ALL_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard:     Dashboard,
  properties:    Properties,
  tenants:       Tenants,
  payments:      Payments,
  maintenance:   Maintenance,
  analytics:     Analytics,
  notifications: Notifications,
  contracts:     Contracts,
  calendar:      CalendarPage,
  messages:      Messages,
  map:           MapPage,
  settings:      Settings,
};

const CLIENT_ALLOWED = ['dashboard', 'properties', 'messages', 'notifications', 'settings'];

function PWABanner() {
  const { canInstall, install } = usePWA();
  const { theme } = useApp();
  const dk = theme === 'dark';
  if (!canInstall) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
      background: dk ? '#1e2330' : '#fff',
      border: `1px solid ${dk ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
      borderRadius: '14px', padding: '12px 20px', zIndex: 999,
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: dk ? '#fff' : '#0f172a' }}>
        📱 Installer PropertyFlow sur votre appareil
      </p>
      <button onClick={install} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '7px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff',
        fontSize: '12px', fontWeight: 700,
      }}>
        <Download style={{ width: '13px', height: '13px' }} /> Installer
      </button>
    </div>
  );
}

function Inner() {
  const { user, logout } = useAuth();
  const { theme, t, _setCurrentPage, _setNavPayload } = useApp();
  const [welcomed, setWelcomed]   = useState(false);
  const [page, setPage]           = useState('dashboard');
  const [sidebarOpen, setSidebar] = useState(false);

  if (!user) return <AuthPage />;
  if (!welcomed) return <Welcome onEnter={() => setWelcomed(true)} />;

  const allowed = user.role === 'admin' ? Object.keys(ALL_COMPONENTS) : CLIENT_ALLOWED;
  const safePage = allowed.includes(page) ? page : 'dashboard';
  const Page     = ALL_COMPONENTS[safePage] ?? Dashboard;

  // Bridge: expose navigate globally so child components can switch pages + pass payload
  const navigate = (p: string, payload?: Record<string, string>) => {
    if (allowed.includes(p)) {
      setPage(p);
      _setCurrentPage(p);
      _setNavPayload(payload ?? null);
    }
  };
  (window as any).__appNavigate = navigate;

  const titles: Record<string, string> = {
    dashboard:     t('dashboard'),
    properties:    t('properties'),
    tenants:       t('tenants'),
    payments:      t('payments'),
    maintenance:   t('maintenance'),
    analytics:     t('analytics'),
    notifications: t('notifications'),
    contracts:     t('contracts'),
    calendar:      t('calendar'),
    messages:      t('messages'),
    map:           t('map'),
    settings:      t('settings'),
  };

  const bg     = theme === 'dark' ? '#0a0c10' : '#f1f5f9';
  const scroll = theme === 'dark' ? 'rgba(255,255,255,0.1) transparent' : 'rgba(0,0,0,0.1) transparent';

  return (
    <div className="h-screen overflow-hidden flex" style={{ background: bg }}>
      <Sidebar
        currentPage={safePage}
        onPageChange={p => navigate(p)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebar(v => !v)}
        allowedPages={allowed}
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header title={titles[safePage] ?? ''} onToggleSidebar={() => setSidebar(v => !v)} />
        <main className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: scroll }}>
          <Page />
        </main>
      </div>
      <PWABanner />
    </div>
  );
}

function WithAppProvider() {
  const { user } = useAuth();
  const initialProfile: ProfileData = {
    firstName:   user?.firstName   ?? '',
    lastName:    user?.lastName    ?? '',
    email:       user?.email       ?? '',
    phone:       user?.phone       ?? '',
    countryCode: user?.countryCode ?? '+228',
    address:     user?.address     ?? '',
    role:        user?.role === 'admin' ? 'Administrateur' : 'Client',
    avatar:      user?.avatar      ?? '',
  };
  return (
    <AppProvider initialProfile={initialProfile}>
      <Inner />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WithAppProvider />
    </AuthProvider>
  );
}