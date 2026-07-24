import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockPayments, mockMaintenance, mockTenants, mockProperties } from '../data/mockData';

const goTo = (page: string) => (window as any).__appNavigate?.(page);

function useS() {
  const { theme } = useApp();
  const dk = theme === 'dark';
  return {
    dk, bg: dk ? 'transparent' : '#f1f5f9',
    card: dk ? 'rgba(255,255,255,0.04)' : '#ffffff',
    bdr:  dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    txt:  dk ? '#ffffff' : '#0f172a',
    muted:dk ? '#9ca3af' : '#64748b',
    faint:dk ? '#4b5563' : '#cbd5e1',
    div:  dk ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
    today:dk ? 'rgba(59,130,246,0.25)' : '#dbeafe',
    cell: dk ? 'rgba(255,255,255,0.02)' : '#fafafa',
  };
}

const FCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA';

type EventType = 'payment' | 'maintenance' | 'lease' | 'visit';
interface CalEvent { id: string; date: string; type: EventType; title: string; sub?: string; link?: string; }

const EVENT_STYLE: Record<EventType, { bg: string; txt: string; label: string }> = {
  payment:     { bg: 'rgba(52,211,153,0.2)',  txt: '#34d399', label: 'Paiement'    },
  maintenance: { bg: 'rgba(245,158,11,0.2)',  txt: '#fbbf24', label: 'Maintenance' },
  lease:       { bg: 'rgba(96,165,250,0.2)',  txt: '#60a5fa', label: 'Bail'        },
  visit:       { bg: 'rgba(167,139,250,0.2)', txt: '#a78bfa', label: 'Visite'      },
};

function buildEvents(): CalEvent[] {
  const ev: CalEvent[] = [];

  // Paiements (loyers avec vrais noms)
  mockPayments.forEach(p => {
    const tenant   = mockTenants.find(t => t.id === p.tenantId);
    const property = mockProperties.find(pr => pr.id === p.propertyId);
    const tenantName = tenant ? `${tenant.firstName} ${tenant.lastName}` : '';
    const propName   = property?.name || `Propriété #${p.propertyId}`;
    ev.push({
      id: `p${p.id}`, date: p.dueDate.slice(0, 10), type: 'payment',
      title: `Loyer ${FCFA(p.amount)}`, sub: `${tenantName} — ${propName}`, link: 'payments',
    });
  });

  // Maintenances
  mockMaintenance.forEach(m => {
    const property = mockProperties.find(pr => pr.id === m.propertyId);
    const propName = property?.name || `Propriété #${m.propertyId}`;
    ev.push({
      id: `m${m.id}`, date: m.reportedDate.slice(0, 10), type: 'maintenance',
      title: m.title, sub: propName, link: 'maintenance',
    });
    if (m.completedDate) {
      ev.push({
        id: `mc${m.id}`, date: m.completedDate.slice(0, 10), type: 'maintenance',
        title: `✓ ${m.title}`, sub: `Terminé — ${propName}`, link: 'maintenance',
      });
    }
  });

  // Fins de bail
  mockTenants.forEach(t => {
    const property = mockProperties.find(p => p.id === t.propertyId);
    const propName = property?.name || '';
    ev.push({
      id: `l${t.id}`, date: t.leaseEnd.slice(0, 10), type: 'lease',
      title: `Fin bail ${t.firstName} ${t.lastName}`, sub: propName, link: 'contracts',
    });
  });

  // Visite d'aujourd'hui (exemple)
  const today = new Date().toISOString().slice(0, 10);
  ev.push({ id: 'v1', date: today, type: 'visit', title: 'Visite Villa Lumière Tokoin', sub: '14h30' });

  return ev;
}

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function AddEventModal({ s, onClose, onAdd }: { s: ReturnType<typeof useS>; onClose: () => void; onAdd: (e: CalEvent) => void }) {
  const { lang } = useApp();
  const [form, setForm] = useState({ date: '', type: 'visit' as EventType, title: '', sub: '' });
  const inpS: React.CSSProperties = { background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '10px', padding: '9px 12px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lbl: React.CSSProperties  = { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.muted, marginBottom: '6px' };
  const submit = () => { if (!form.date || !form.title.trim()) return; onAdd({ id: `ev${Date.now()}`, ...form }); };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
      <div style={{ background: s.dk ? '#13161f' : '#fff', border: `1px solid ${s.bdr}`, borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.txt }}>{lang === 'en' ? 'Add Event' : 'Ajouter un Événement'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex' }}><X style={{ width: '18px', height: '18px' }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div><label style={lbl}>Titre *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Visite propriété" style={inpS} /></div>
          <div><label style={lbl}>Date *</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inpS} /></div>
          <div><label style={lbl}>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))} style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
              <option value="payment">Paiement</option><option value="maintenance">Maintenance</option>
              <option value="lease">Bail</option><option value="visit">Visite</option>
            </select>
          </div>
          <div><label style={lbl}>Note (optionnel)</label><input value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))} placeholder="Ex: 14h30" style={inpS} /></div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: `1px solid ${s.bdr}`, background: 'transparent', color: s.muted, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
          <button onClick={submit} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { lang } = useApp();
  const s = useS();
  const [cur, setCur]           = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [events, setEvents]     = useState<CalEvent[]>(buildEvents);

  const days   = lang === 'en' ? DAYS_EN   : DAYS_FR;
  const months = lang === 'en' ? MONTHS_EN : MONTHS_FR;

  const firstDay    = new Date(cur.y, cur.m, 1).getDay();
  const offset      = (firstDay + 6) % 7;
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();
  const todayStr    = new Date().toISOString().slice(0, 10);

  const prev = () => setCur(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 });
  const next = () => setCur(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 });

  const dateStr  = (d: number) => `${cur.y}-${String(cur.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const eventsOn = (d: number) => events.filter(e => e.date === dateStr(d));
  const selEvents = selected ? events.filter(e => e.date === selected) : [];

  return (
    <div style={{ minHeight: '100%', background: s.bg, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: s.txt }}>{lang === 'en' ? 'Calendar' : 'Calendrier des Échéances'}</h2>
          <p style={{ fontSize: '13px', color: s.muted, marginTop: '2px' }}>{lang === 'en' ? 'All your deadlines at a glance' : 'Toutes vos échéances en un coup d\'œil'}</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          <Plus style={{ width: '15px', height: '15px' }} />{lang === 'en' ? 'Add Event' : 'Ajouter'}
        </button>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.entries(EVENT_STYLE).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: v.bg, border: `1px solid ${v.txt}55` }} />
            <span style={{ fontSize: '12px', color: s.muted }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Layout responsive : flex-wrap */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Grille calendrier */}
        <div style={{ flex: '1 1 300px', minWidth: '0', background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '16px', overflow: 'hidden' }}>
          {/* Navigation mois */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${s.div}` }}>
            <button onClick={prev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex', padding: '4px' }}><ChevronLeft style={{ width: '18px', height: '18px' }} /></button>
            <p style={{ fontWeight: 700, fontSize: '15px', color: s.txt }}>{months[cur.m]} {cur.y}</p>
            <button onClick={next} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex', padding: '4px' }}><ChevronRight style={{ width: '18px', height: '18px' }} /></button>
          </div>
          {/* Jours de la semaine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '8px 8px 0' }}>
            {days.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: s.muted, padding: '4px 0' }}>{d}</div>)}
          </div>
          {/* Cellules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '4px 8px 8px', gap: '2px' }}>
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const ds  = dateStr(d);
              const ev  = eventsOn(d);
              const isTod = ds === todayStr;
              const isSel = ds === selected;
              return (
                <div key={d} onClick={() => setSelected(isSel ? null : ds)}
                  style={{ minHeight: '50px', borderRadius: '8px', padding: '4px', cursor: 'pointer', transition: 'background .15s',
                    background: isSel ? 'rgba(59,130,246,0.2)' : isTod ? s.today : s.cell,
                    border: isSel ? '1px solid #3b82f6' : isTod ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent' }}>
                  <p style={{ fontSize: '12px', fontWeight: isTod ? 700 : 500, color: isTod ? '#60a5fa' : s.txt, marginBottom: '3px' }}>{d}</p>
                  {ev.slice(0, 2).map(e => (
                    <div key={e.id} style={{ fontSize: '9px', padding: '1px 3px', borderRadius: '3px', marginBottom: '1px', background: EVENT_STYLE[e.type].bg, color: EVENT_STYLE[e.type].txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {e.title}
                    </div>
                  ))}
                  {ev.length > 2 && <p style={{ fontSize: '9px', color: s.muted }}>+{ev.length - 2}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panneau latéral */}
        <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Événements du jour sélectionné */}
          <div style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '16px', padding: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: s.txt, marginBottom: '12px' }}>
              {selected ? new Date(selected + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : lang === 'en' ? 'Select a day' : 'Sélectionnez un jour'}
            </p>
            {selEvents.length === 0 && <p style={{ fontSize: '12px', color: s.muted }}>{lang === 'en' ? 'No events' : 'Aucun événement'}</p>}
            {selEvents.map(e => (
              <div key={e.id} onClick={() => e.link && goTo(e.link)}
                style={{ marginBottom: '8px', padding: '10px', borderRadius: '10px', background: EVENT_STYLE[e.type].bg, border: `1px solid ${EVENT_STYLE[e.type].txt}33`, cursor: e.link ? 'pointer' : 'default' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: EVENT_STYLE[e.type].txt, marginBottom: '2px' }}>{e.title}</p>
                {e.sub && <p style={{ fontSize: '11px', color: s.muted }}>{e.sub}</p>}
                <span style={{ fontSize: '10px', fontWeight: 600, color: EVENT_STYLE[e.type].txt }}>{EVENT_STYLE[e.type].label}</span>
                {e.link && <span style={{ fontSize: '10px', color: s.muted, marginLeft: '6px' }}>→ Voir</span>}
              </div>
            ))}
          </div>

          {/* Prochains événements */}
          <div style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '16px', padding: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: s.txt, marginBottom: '12px' }}>{lang === 'en' ? 'Upcoming' : 'Prochains événements'}</p>
            {events
              .filter(e => e.date >= todayStr)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5)
              .map(e => (
                <div key={e.id} onClick={() => e.link && goTo(e.link)}
                  style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start', cursor: e.link ? 'pointer' : 'default' }}>
                  <div style={{ width: '4px', height: '32px', borderRadius: '99px', background: EVENT_STYLE[e.type].txt, flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: s.txt }}>{e.title}</p>
                    <p style={{ fontSize: '11px', color: s.muted }}>
                      {new Date(e.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      {e.sub && ` · ${e.sub}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showAdd && <AddEventModal s={s} onClose={() => setShowAdd(false)} onAdd={e => { setEvents(p => [...p, e]); setShowAdd(false); }} />}
    </div>
  );
}