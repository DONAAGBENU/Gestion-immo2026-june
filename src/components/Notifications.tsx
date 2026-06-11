import { useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, Euro, Building2, Users, X, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface Notif {
  id: string; type: 'payment'|'maintenance'|'lease'|'tenant'|'system';
  title: string; body: string; time: string; read: boolean;
}

const INITIAL: Notif[] = [
  { id:'1', type:'payment',     title:'Loyer en retard',               body:'Locataire Martin — Propriété #2 — 850€ impayé depuis 5 jours.',      time:'Il y a 10 min',  read:false },
  { id:'2', type:'maintenance', title:'Nouvelle demande urgente',       body:'Fuite d\'eau signalée au 3ème étage — Propriété #1.',                  time:'Il y a 1h',      read:false },
  { id:'3', type:'lease',       title:'Bail expirant bientôt',         body:'Bail de Sophie D. expire dans 30 jours — Propriété #3.',              time:'Il y a 3h',      read:false },
  { id:'4', type:'tenant',      title:'Nouveau locataire inscrit',      body:'Jean-Paul K. vient de créer un compte client.',                       time:'Hier, 14h22',    read:false },
  { id:'5', type:'payment',     title:'Paiement reçu',                 body:'Loyer de 1 200€ reçu — Propriété #4 — Locataire Bah A.',              time:'Hier, 09h15',    read:true  },
  { id:'6', type:'system',      title:'Mise à jour système',           body:'PropertyFlow v2.1 disponible — nouvelles fonctionnalités ajoutées.',   time:'Il y a 2 jours', read:true  },
  { id:'7', type:'maintenance', title:'Maintenance terminée',           body:'Réparation plomberie — Propriété #2 — Coût : 320€.',                   time:'Il y a 3 jours', read:true  },
  { id:'8', type:'lease',       title:'Renouvellement de bail signé',  body:'Bail renouvelé pour 12 mois — Propriété #1 — Locataire Diallo F.',    time:'Il y a 4 jours', read:true  },
];

const TYPE_META = {
  payment:     { icon: Euro,          color: '#34d399', bg: 'rgba(52,211,153,0.15)',  label: 'Paiement' },
  maintenance: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Maintenance' },
  lease:       { icon: Building2,     color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', label: 'Bail' },
  tenant:      { icon: Users,         color: '#a78bfa', bg: 'rgba(167,139,250,0.15)',label: 'Locataire' },
  system:      { icon: Bell,          color: '#9ca3af', bg: 'rgba(156,163,175,0.15)',label: 'Système' },
};

function useS() {
  const { theme } = useApp();
  const dk = theme === 'dark';
  return {
    dk, bg: dk ? 'transparent' : '#f1f5f9',
    card: dk ? 'rgba(255,255,255,0.04)' : '#ffffff',
    bdr:  dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    txt:  dk ? '#ffffff' : '#0f172a',
    muted:dk ? '#9ca3af' : '#64748b',
    div:  dk ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
    unread:dk ? 'rgba(59,130,246,0.08)' : '#eff6ff',
  };
}

/* ── Badge exportable pour la cloche du Header ── */
export function NotifBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span style={{ position:'absolute', top:'-4px', right:'-4px', minWidth:'16px', height:'16px', borderRadius:'99px', background:'#ef4444', color:'#fff', fontSize:'10px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px' }}>
      {count > 9 ? '9+' : count}
    </span>
  );
}

export default function Notifications() {
  const { lang } = useApp();
  const s = useS();
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);
  const [filter, setFilter] = useState<'all'|'unread'|Notif['type']>('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAll  = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markOne  = (id: string) => setNotifs(prev => prev.map(n => n.id===id ? { ...n, read:true } : n));
  const deleteOne= (id: string) => setNotifs(prev => prev.filter(n => n.id!==id));
  const deleteAll= () => setNotifs([]);

  const filtered = notifs.filter(n => {
    if (filter === 'all')    return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const FILTERS: { id: typeof filter; label: string }[] = [
    { id:'all',         label: lang==='en'?'All':'Tout' },
    { id:'unread',      label: lang==='en'?'Unread':'Non lus' },
    { id:'payment',     label: lang==='en'?'Payments':'Paiements' },
    { id:'maintenance', label: 'Maintenance' },
    { id:'lease',       label: lang==='en'?'Leases':'Baux' },
    { id:'tenant',      label: lang==='en'?'Tenants':'Locataires' },
  ];

  return (
    <div style={{ minHeight:'100%', background:s.bg, padding:'24px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <h2 style={{ fontSize:'22px', fontWeight:800, color:s.txt }}>{lang==='en'?'Notifications':'Notifications'}</h2>
            {unreadCount > 0 && (
              <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'99px', background:'#ef4444', color:'#fff' }}>{unreadCount}</span>
            )}
          </div>
          <p style={{ fontSize:'13px', color:s.muted, marginTop:'2px' }}>{lang==='en'?'Stay informed about your portfolio':'Restez informé sur votre portefeuille'}</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={markAll} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer', border:`1px solid ${s.bdr}`, background:s.card, color:s.muted }}>
            <CheckCheck style={{ width:'14px', height:'14px' }} />{lang==='en'?'Mark all read':'Tout marquer lu'}
          </button>
          <button onClick={deleteAll} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer', border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#f87171' }}>
            <Trash2 style={{ width:'14px', height:'14px' }} />{lang==='en'?'Clear all':'Effacer tout'}
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'20px', overflowX:'auto', paddingBottom:'4px' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ padding:'6px 14px', borderRadius:'99px', fontSize:'12px', fontWeight:600, cursor:'pointer', border:'none', whiteSpace:'nowrap', flexShrink:0,
              background: filter===f.id ? '#3b82f6' : (s.dk ? 'rgba(255,255,255,0.07)':'#f1f5f9'),
              color: filter===f.id ? '#fff' : s.muted }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <Bell style={{ width:'40px', height:'40px', margin:'0 auto 12px', color:s.muted, opacity:0.4 }} />
            <p style={{ color:s.muted, fontSize:'14px' }}>{lang==='en'?'No notifications':'Aucune notification'}</p>
          </div>
        )}
        {filtered.map(n => {
          const meta = TYPE_META[n.type];
          const Icon = meta.icon;
          return (
            <div key={n.id}
              style={{ background: n.read ? s.card : s.unread, border:`1px solid ${n.read ? s.bdr : 'rgba(59,130,246,0.2)'}`, borderRadius:'14px', padding:'14px 16px',
                       display:'flex', alignItems:'flex-start', gap:'12px', transition:'all .2s' }}>
              <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon style={{ width:'18px', height:'18px', color:meta.color }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px', marginBottom:'3px' }}>
                  <p style={{ fontSize:'14px', fontWeight: n.read ? 500 : 700, color:s.txt }}>{n.title}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
                    {!n.read && (
                      <button onClick={()=>markOne(n.id)} title="Marquer lu"
                        style={{ background:'none', border:'none', cursor:'pointer', color:'#60a5fa', display:'flex', padding:'2px' }}>
                        <Check style={{ width:'14px', height:'14px' }} />
                      </button>
                    )}
                    <button onClick={()=>deleteOne(n.id)} title="Supprimer"
                      style={{ background:'none', border:'none', cursor:'pointer', color:s.muted, display:'flex', padding:'2px' }}>
                      <X style={{ width:'14px', height:'14px' }} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize:'13px', color:s.muted, lineHeight:1.5, marginBottom:'6px' }}>{n.body}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'6px', background:meta.bg, color:meta.color, fontWeight:600 }}>{meta.label}</span>
                  <span style={{ fontSize:'11px', color:s.muted }}>{n.time}</span>
                  {!n.read && <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#3b82f6', display:'inline-block' }} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}