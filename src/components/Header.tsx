import { Menu, Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface Props { title: string; onToggleSidebar: () => void; }

export default function Header({ title, onToggleSidebar }: Props) {
  const { theme, t, profile } = useApp();
  const { user } = useAuth();
  const dk = theme === 'dark';

  const bg    = dk ? 'rgba(10,12,16,0.97)'   : 'rgba(255,255,255,0.97)';
  const bdr   = dk ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const txt   = dk ? '#ffffff'                : '#0f172a';
  const muted = dk ? '#9ca3af'                : '#64748b';
  const btnBg = dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9';
  const btnBdr= dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const inpBg = dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9';

  return (
    <header className="px-4 py-3 lg:px-6 flex items-center justify-between flex-shrink-0"
      style={{ background:bg, borderBottom:`1px solid ${bdr}`, backdropFilter:'blur(12px)' }}>
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-lg" style={{ color:muted }}>
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold" style={{ color:txt }}>{title}</h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="hidden sm:flex items-center px-3 py-2 rounded-xl"
          style={{ background:inpBg, border:`1px solid ${btnBdr}` }}>
          <Search className="h-4 w-4 mr-2" style={{ color:muted }} />
          <input type="text" placeholder={t('search')} className="bg-transparent border-none outline-none text-sm w-40 lg:w-52"
            style={{ color:txt }} />
        </div>

        <button className="relative p-2 rounded-xl" style={{ background:btnBg, border:`1px solid ${btnBdr}` }}>
          <Bell className="h-5 w-5" style={{ color:muted }} />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-white flex items-center justify-center font-bold"
            style={{ background:'#ef4444', fontSize:'10px' }}>3</span>
        </button>

        <div className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-xl cursor-pointer"
          style={{ background:btnBg, border:`1px solid ${btnBdr}` }}>
          <div className="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ background:'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
            {profile.avatar
              ? <img src={profile.avatar} alt="av" className="w-full h-full object-cover" />
              : <span className="text-xs font-black text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>}
          </div>
          <span className="hidden sm:block text-sm font-medium" style={{ color:txt }}>{user?.firstName}</span>
        </div>
      </div>
    </header>
  );
}