import { useState, useMemo } from 'react';
import { Bell, Check, Trash2, AlertTriangle, Building2, Users, X, CheckCheck, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockPayments, mockMaintenance, mockTenants, mockProperties } from '../data/mockData';

const goTo = (page: string) => (window as any).__appNavigate?.(page);

export interface Notif {
  id: string; type: 'payment' | 'maintenance' | 'lease' | 'tenant' | 'system';
  title: string; body: string; time: string; read: boolean; link?: string;
}

const TYPE_META = {
  payment:     { icon: CreditCard,   color: '#34d399', bg: 'rgba(52,211,153,0.15)',  label: 'Paiement'    },
  maintenance: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Maintenance'  },
  lease:       { icon: Building2,     color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', label: 'Bail'         },
  tenant:      { icon: Users,         color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', label: 'Locataire'   },
  system:      { icon: Bell,          color: '#9ca3af', bg: 'rgba(156,163,175,0.15)', label: 'Système'     },
};

/** Génère les notifications dynamiquement depuis les vraies données */
function buildNotifications(): Notif[] {
  const notifs: Notif[] = [];
  const now = new Date();

  // Paiements en retard ou en attente
  mockPayments.forEach(p => {
    const tenant   = mockTenants.find(t => t.id === p.tenantId);
    const property = mockProperties.find(pr => pr.id === p.propertyId);
    const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Locataire';
    const propName   = property?.name || 'Propriété';
    const dueMs = new Date(p.dueDate).getTime();
    const diffDays = Math.floor((now.getTime() - dueMs) / 86400000);

    if (p.status === 'overdue') {
      notifs.push({
        id: `pay-late-${p.id}`, type: 'payment',
        title: 'Loyer en retard',
        body: `${tenantName} — ${propName} — ${new Intl.NumberFormat('fr-FR').format(p.amount)} FCFA impayé depuis ${diffDays} jour${diffDays > 1 ? 's' : ''}.`,
        time: `${diffDays}j de retard`, read: false, link: 'payments',
      });
    } else if (p.status === 'pending' && diffDays >= -5 && diffDays <= 0) {
      notifs.push({
        id: `pay-due-${p.id}`, type: 'payment',
        title: 'Échéance proche',
        body: `Loyer de ${new Intl.NumberFormat('fr-FR').format(p.amount)} FCFA dû bientôt — ${tenantName} — ${propName}.`,
        time: diffDays === 0 ? "Aujourd'hui" : `Dans ${-diffDays}j`, read: false, link: 'payments',
      });
    } else if (p.status === 'paid' && p.paidDate) {
      const paidDays = Math.floor((now.getTime() - new Date(p.paidDate).getTime()) / 86400000);
      if (paidDays <= 3) {
        notifs.push({
          id: `pay-ok-${p.id}`, type: 'payment',
          title: 'Paiement reçu ✓',
          body: `Loyer de ${new Intl.NumberFormat('fr-FR').format(p.amount)} FCFA reçu — ${tenantName} — ${propName}.`,
          time: paidDays === 0 ? "Aujourd'hui" : `Il y a ${paidDays}j`, read: true, link: 'payments',
        });
      }
    }
  });

  // Maintenances urgentes ou récentes
  mockMaintenance.forEach(m => {
    const property = mockProperties.find(p => p.id === m.propertyId);
    const propName = property?.name || 'Propriété';
    const repDays = Math.floor((now.getTime() - new Date(m.reportedDate).getTime()) / 86400000);

    if (m.priority === 'urgent' && m.status !== 'completed') {
      notifs.push({
        id: `maint-urg-${m.id}`, type: 'maintenance',
        title: '🚨 Maintenance urgente',
        body: `${m.title} — ${propName}${m.cost ? ` — ${new Intl.NumberFormat('fr-FR').format(m.cost)} FCFA` : ''}.`,
        time: repDays === 0 ? "Aujourd'hui" : `Il y a ${repDays}j`, read: false, link: 'maintenance',
      });
    } else if (m.status === 'completed' && m.completedDate) {
      const doneDays = Math.floor((now.getTime() - new Date(m.completedDate).getTime()) / 86400000);
      if (doneDays <= 5) {
        notifs.push({
          id: `maint-done-${m.id}`, type: 'maintenance',
          title: 'Maintenance terminée ✓',
          body: `${m.title} — ${propName}${m.cost ? ` — Coût : ${new Intl.NumberFormat('fr-FR').format(m.cost)} FCFA` : ''}.`,
          time: doneDays === 0 ? "Aujourd'hui" : `Il y a ${doneDays}j`, read: true, link: 'maintenance',
        });
      }
    } else if (m.status === 'reported' && repDays <= 1) {
      notifs.push({
        id: `maint-new-${m.id}`, type: 'maintenance',
        title: 'Nouvelle demande signalée',
        body: `${m.title} — ${propName}.`,
        time: repDays === 0 ? "Aujourd'hui" : `Il y a ${repDays}j`, read: false, link: 'maintenance',
      });
    }
  });

  // Baux expirant dans moins de 60 jours
  mockTenants.forEach(t => {
    const property = mockProperties.find(p => p.id === t.propertyId);
    const propName = property?.name || 'Propriété';
    const endDate  = new Date(t.leaseEnd);
    const daysLeft = Math.floor((endDate.getTime() - now.getTime()) / 86400000);
    if (daysLeft >= 0 && daysLeft <= 60) {
      notifs.push({
        id: `lease-${t.id}`, type: 'lease',
        title: daysLeft <= 14 ? '⚠️ Bail expirant très bientôt' : 'Bail expirant bientôt',
        body: `Bail de ${t.firstName} ${t.lastName} expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''} — ${propName}.`,
        time: `Dans ${daysLeft}j`, read: daysLeft > 30, link: 'contracts',
      });
    }
  });

  // Système (statique)
  notifs.push({
    id: 'sys-1', type: 'system',
    title: 'Bienvenue sur PropertyFlow',
    body: 'Votre application de gestion immobilière est prête. Ajoutez vos propriétés et locataires.',
    time: 'Aujourd\'hui', read: true,
  });

  // Trier : non lus d'abord, puis par temps
  return notifs.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return 0;
  });
}

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
  const initialNotifs = useMemo(buildNotifications, []);
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifs);
  const [filter, setFilter] = useState<'all' | 'unread' | Notif['type']>('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAll   = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markOne   = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteOne = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const deleteAll = () => setNotifs([]);

  const filtered = notifs.filter(n => {
    if (filter === 'all')    return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const FILTERS: { id: typeof filter; label: string }[] = [
    { id: 'all',         label: lang === 'en' ? 'All' : 'Tout' },
    { id: 'unread',      label: lang === 'en' ? 'Unread' : 'Non lus' },
    { id: 'payment',     label: lang === 'en' ? 'Payments' : 'Paiements' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'lease',       label: lang === 'en' ? 'Leases' : 'Baux' },
    { id: 'tenant',      label: lang === 'en' ? 'Tenants' : 'Locataires' },
  ];

  return (
    <div style={{ minHeight: '100%', background: s.bg, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: s.txt }}>Notifications</h2>
            {unreadCount > 0 && (
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: '#ef4444', color: '#fff' }}>{unreadCount}</span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: s.muted, marginTop: '2px' }}>
            {lang === 'en' ? 'Stay informed about your portfolio' : 'Restez informé sur votre portefeuille'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={markAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${s.bdr}`, background: s.card, color: s.muted }}>
            <CheckCheck style={{ width: '14px', height: '14px' }} />{lang === 'en' ? 'Mark all read' : 'Tout marquer lu'}
          </button>
          <button onClick={deleteAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>
            <Trash2 style={{ width: '14px', height: '14px' }} />{lang === 'en' ? 'Clear all' : 'Effacer tout'}
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              background: filter === f.id ? '#3b82f6' : (s.dk ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
              color: filter === f.id ? '#fff' : s.muted }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Bell style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: s.muted, opacity: 0.4 }} />
            <p style={{ color: s.muted, fontSize: '14px' }}>{lang === 'en' ? 'No notifications' : 'Aucune notification'}</p>
          </div>
        )}
        {filtered.map(n => {
          const meta = TYPE_META[n.type];
          const Icon = meta.icon;
          return (
            <div key={n.id}
              style={{ background: n.read ? s.card : s.unread, border: `1px solid ${n.read ? s.bdr : 'rgba(59,130,246,0.2)'}`, borderRadius: '14px', padding: '14px 16px',
                       display: 'flex', alignItems: 'flex-start', gap: '12px', transition: 'all .2s', cursor: n.link ? 'pointer' : 'default' }}
              onClick={() => n.link && goTo(n.link)}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: '18px', height: '18px', color: meta.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                  <p style={{ fontSize: '14px', fontWeight: n.read ? 500 : 700, color: s.txt }}>{n.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {!n.read && (
                      <button onClick={e => { e.stopPropagation(); markOne(n.id); }} title="Marquer lu"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', display: 'flex', padding: '2px' }}>
                        <Check style={{ width: '14px', height: '14px' }} />
                      </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); deleteOne(n.id); }} title="Supprimer"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex', padding: '2px' }}>
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: s.muted, lineHeight: 1.5, marginBottom: '6px' }}>{n.body}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: meta.bg, color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                  <span style={{ fontSize: '11px', color: s.muted }}>{n.time}</span>
                  {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />}
                  {n.link && <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>→ Voir</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}