import {
  Home, Building2, Users, CreditCard, Wrench, BarChart3,
  Settings, X, LogOut, Bell, FileText, Calendar, MessageCircle, Map
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  currentPage:  string;
  onPageChange: (p: string) => void;
  isOpen:       boolean;
  onToggle:     () => void;
  allowedPages: string[];
  onLogout:     () => void;
}

const MENU = [
  { id:'dashboard',     icon:Home,          key:'dashboard'   },
  { id:'properties',    icon:Building2,     key:'properties'  },
  { id:'tenants',       icon:Users,         key:'tenants'     },
  { id:'payments',      icon:CreditCard,    key:'payments'    },
  { id:'maintenance',   icon:Wrench,        key:'maintenance' },
  { id:'analytics',     icon:BarChart3,     key:'analytics'   },
  { id:'notifications', icon:Bell,          key:'notifications' },
  { id:'contracts',     icon:FileText,      key:'contracts'   },
  { id:'calendar',      icon:Calendar,      key:'calendar'    },
  { id:'messages',      icon:MessageCircle, key:'messages'    },
  { id:'map',           icon:Map,           key:'map'         },
  { id:'settings',      icon:Settings,      key:'settings'    },
];

const LABELS: Record<string, { fr: string; en: string }> = {
  dashboard:     { fr:'Tableau de bord', en:'Dashboard'     },
  properties:    { fr:'Propriétés',      en:'Properties'    },
  tenants:       { fr:'Locataires',      en:'Tenants'       },
  payments:      { fr:'Paiements',       en:'Payments'      },
  maintenance:   { fr:'Maintenance',     en:'Maintenance'   },
  analytics:     { fr:'Analyses',        en:'Analytics'     },
  notifications: { fr:'Notifications',   en:'Notifications' },
  contracts:     { fr:'Contrats',        en:'Contracts'     },
  calendar:      { fr:'Calendrier',      en:'Calendar'      },
  messages:      { fr:'Messages',        en:'Messages'      },
  map:           { fr:'Carte',           en:'Map'           },
  settings:      { fr:'Paramètres',      en:'Settings'      },
};

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle, allowedPages, onLogout }: Props) {
  const { theme, lang, profile } = useApp();
  const { user } = useAuth();
  const dk = theme === 'dark';

  const bg     = dk ? 'linear-gradient(180deg,#0f1117,#13161f)' : '#ffffff';
  const bdr    = dk ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const muted  = dk ? '#9ca3af' : '#64748b';
  const logo   = dk ? '#ffffff' : '#0f172a';
  const footBg = dk ? 'rgba(255,255,255,0.04)' : '#f1f5f9';
  const actBg  = dk ? 'rgba(59,130,246,0.15)' : '#eff6ff';
  const actTxt = dk ? '#93c5fd' : '#1d4ed8';
  const hovBg  = dk ? 'rgba(255,255,255,0.04)' : '#f8fafc';

  const visible = MENU.filter(m => allowedPages.includes(m.id));

  /* Séparateur visuel entre groupes */
  const groups = [
    ['dashboard','properties','tenants','payments','maintenance'],
    ['analytics','notifications','contracts','calendar','messages','map'],
    ['settings'],
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background:'rgba(0,0,0,0.6)' }} onClick={onToggle} />
      )}
      <div
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto w-64 flex flex-col`}
        style={{ background:bg, borderRight:`1px solid ${bdr}` }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom:`1px solid ${bdr}` }}>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight" style={{ color:logo }}>PropertyFlow</span>
          </div>
          <button onClick={onToggle} className="lg:hidden" style={{ color:muted, background:'none', border:'none', cursor:'pointer' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Badge rôle */}
        <div className="px-5 py-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background:user?.role==='admin'?'rgba(248,113,113,0.15)':'rgba(59,130,246,0.15)', color:user?.role==='admin'?'#f87171':'#60a5fa' }}>
            {user?.role==='admin'?'👑 Administrateur':'👤 Client'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
          {groups.map((group, gi) => {
            const items = visible.filter(m => group.includes(m.id));
            if (!items.length) return null;
            return (
              <div key={gi}>
                {gi > 0 && <div style={{ height:'1px', background:bdr, margin:'6px 4px' }} />}
                <ul className="space-y-0.5 py-1">
                  {items.map(({ id, icon:Icon }) => {
                    const active = currentPage === id;
                    const label  = LABELS[id]?.[lang] ?? id;
                    return (
                      <li key={id}>
                        <button
                          onClick={() => { onPageChange(id); if (window.innerWidth < 1024) onToggle(); }}
                          className="w-full flex items-center px-3 py-2 rounded-xl text-left transition-all duration-150"
                          style={{ background:active?actBg:'transparent', color:active?actTxt:muted, borderLeft:active?'2px solid #3b82f6':'2px solid transparent', border:'none', cursor:'pointer' }}
                          onMouseEnter={e => { if(!active) (e.currentTarget as HTMLElement).style.background=hovBg; }}
                          onMouseLeave={e => { if(!active) (e.currentTarget as HTMLElement).style.background='transparent'; }}
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" style={{ color:active?'#60a5fa':muted }} />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-4 pt-2 space-y-2" style={{ borderTop:`1px solid ${bdr}` }}>
          <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl" style={{ background:footBg }}>
            <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
              {profile.avatar
                ? <img src={profile.avatar} alt="av" className="w-full h-full object-cover" />
                : <span className="text-xs font-black text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color:logo }}>{user?.firstName} {user?.lastName}</p>
              <p className="text-xs truncate" style={{ color:muted, fontSize:'10px' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="w-full flex items-center px-3 py-2 rounded-xl transition-all"
            style={{ color:'#f87171', background:'transparent', border:'none', cursor:'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(248,113,113,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; }}>
            <LogOut className="h-4 w-4 mr-3" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}