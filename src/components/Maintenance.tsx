import { useState } from 'react';
import { Plus, Search, Wrench, Clock, CheckCircle, AlertTriangle, XCircle, MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockMaintenance, mockProperties } from '../data/mockData';
import { Maintenance } from '../types';

const goTo = (page: string, payload?: Record<string, string>) => {
  (window as any).__appNavigate?.(page, payload);
};

function useS() {
  const { theme } = useApp();
  const dk = theme === 'dark';
  return {
    dk,
    bg:    dk ? 'transparent' : '#f1f5f9',
    card:  dk ? 'rgba(255,255,255,0.04)' : '#ffffff',
    bdr:   dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    txt:   dk ? '#ffffff' : '#0f172a',
    muted: dk ? '#9ca3af' : '#64748b',
    faint: dk ? '#6b7280' : '#94a3b8',
    inp:   dk ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    inBdr: dk ? 'rgba(255,255,255,0.1)'  : '#cbd5e1',
    div:   dk ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
  };
}

const FCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA';

const PRIORITY_META: Record<string, { bg: string; txt: string; label: string }> = {
  urgent: { bg: 'rgba(248,113,113,0.15)', txt: '#f87171', label: 'Urgent'  },
  high:   { bg: 'rgba(251,191,36,0.15)',  txt: '#fbbf24', label: 'Élevée'  },
  medium: { bg: 'rgba(96,165,250,0.15)',  txt: '#60a5fa', label: 'Moyenne' },
  low:    { bg: 'rgba(52,211,153,0.15)',  txt: '#34d399', label: 'Faible'  },
};

const STATUS_META: Record<string, { icon: React.ComponentType<any>; bg: string; txt: string; label: string }> = {
  completed:   { icon: CheckCircle,   bg: 'rgba(52,211,153,0.15)',  txt: '#34d399', label: 'Terminé'   },
  'in-progress':{ icon: Clock,        bg: 'rgba(96,165,250,0.15)',  txt: '#60a5fa', label: 'En cours'  },
  reported:    { icon: AlertTriangle, bg: 'rgba(251,191,36,0.15)',  txt: '#fbbf24', label: 'Signalé'   },
  cancelled:   { icon: XCircle,       bg: 'rgba(248,113,113,0.15)', txt: '#f87171', label: 'Annulé'    },
};

/* ── Modal ajout ── */
function AddMaintenanceModal({ s, onClose, onAdd }: { s: ReturnType<typeof useS>; onClose: () => void; onAdd: (m: Maintenance) => void }) {
  const [form, setForm] = useState({ title: '', description: '', propertyId: '', priority: 'medium' as Maintenance['priority'], assignedTo: '', cost: '' });
  const inpS: React.CSSProperties = { background: s.inp, border: `1px solid ${s.inBdr}`, borderRadius: '10px', padding: '9px 12px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lbl: React.CSSProperties  = { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.muted, marginBottom: '6px' };

  const submit = () => {
    if (!form.title.trim() || !form.propertyId) return;
    onAdd({
      id: `m${Date.now()}`,
      title: form.title, description: form.description,
      propertyId: form.propertyId,
      priority: form.priority,
      status: 'reported',
      reportedDate: new Date().toISOString().split('T')[0],
      assignedTo: form.assignedTo || undefined,
      cost: form.cost ? Number(form.cost) : undefined,
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
      <div style={{ background: s.dk ? '#13161f' : '#fff', border: `1px solid ${s.bdr}`, borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.txt }}>Nouvelle Demande de Maintenance</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex' }}><X style={{ width: '18px', height: '18px' }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><label style={lbl}>Titre *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Fuite robinet cuisine" style={inpS} /></div>
          <div><label style={lbl}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Décrivez le problème..." style={{ ...inpS, resize: 'vertical' }} />
          </div>
          <div><label style={lbl}>Propriété concernée *</label>
            <select value={form.propertyId} onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))} style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
              <option value="">Sélectionner une propriété...</option>
              {mockProperties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Priorité</label>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Maintenance['priority'] }))} style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div><label style={lbl}>Assigné à</label><input value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} placeholder="Plombier Express Lomé" style={inpS} /></div>
          <div><label style={lbl}>Coût estimé (FCFA)</label><input type="number" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} placeholder="50000" style={inpS} /></div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: `1px solid ${s.bdr}`, background: 'transparent', color: s.muted, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
          <button onClick={submit} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Créer</button>
        </div>
      </div>
    </div>
  );
}

/* ── Card maintenance ── */
function MaintenanceCard({ item, s, onComplete }: { item: Maintenance; s: ReturnType<typeof useS>; onComplete: () => void }) {
  const property = mockProperties.find(p => p.id === item.propertyId);
  const pm = PRIORITY_META[item.priority] ?? PRIORITY_META.medium;
  const sm = STATUS_META[item.status]    ?? STATUS_META.reported;
  const Icon = sm.icon;

  return (
    <div style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '16px', padding: '18px', transition: 'border-color .2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = s.bdr)}>
      {/* Top */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.txt, flex: 1, paddingRight: '8px' }}>{item.title}</h3>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px', background: pm.bg, color: pm.txt, flexShrink: 0 }}>{pm.label}</span>
        </div>
        <p style={{ fontSize: '12px', color: s.muted, lineHeight: 1.5 }}>{item.description}</p>
      </div>

      {/* Badges statut */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px', background: sm.bg, color: sm.txt, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Icon style={{ width: '10px', height: '10px' }} />{sm.label}
        </span>
      </div>

      {/* Infos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin style={{ width: '13px', height: '13px', color: s.faint, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: s.muted }}>{property?.name || 'Propriété inconnue'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock style={{ width: '13px', height: '13px', color: s.faint, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: s.muted }}>Signalé le {new Date(item.reportedDate).toLocaleDateString('fr-FR')}</span>
        </div>
        {item.assignedTo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench style={{ width: '13px', height: '13px', color: s.faint, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: s.muted }}>{item.assignedTo}</span>
          </div>
        )}
        {item.cost && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 600 }}>💰 {FCFA(item.cost)}</span>
          </div>
        )}
        {item.completedDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle style={{ width: '13px', height: '13px', color: '#34d399', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#34d399' }}>Terminé le {new Date(item.completedDate).toLocaleDateString('fr-FR')}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${s.div}` }}>
        <button onClick={() => goTo('map')}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '8px', borderRadius: '10px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          <MapPin style={{ width: '12px', height: '12px' }} /> Localiser
        </button>
        {item.status !== 'completed' && item.status !== 'cancelled' && (
          <button onClick={onComplete}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '8px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            <CheckCircle style={{ width: '12px', height: '12px' }} /> Terminer
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Page principale ── */
export default function MaintenancePage() {
  const { lang } = useApp();
  const s = useS();
  const [items, setItems]       = useState([...mockMaintenance]);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAdd, setShowAdd]   = useState(false);

  const filtered = items.filter(m => {
    const p = mockProperties.find(p => p.id === m.propertyId);
    const matchSearch = !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      (p && p.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus   = filterStatus   === 'all' || m.status   === filterStatus;
    const matchPriority = filterPriority === 'all' || m.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const active  = items.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length;
  const urgent  = items.filter(m => m.priority === 'urgent' && m.status !== 'completed').length;
  const totalCost = items.filter(m => m.cost).reduce((s, m) => s + (m.cost || 0), 0);
  const done    = items.filter(m => m.status === 'completed').length;

  const markComplete = (id: string) => {
    setItems(prev => prev.map(m => m.id === id
      ? { ...m, status: 'completed' as const, completedDate: new Date().toISOString().split('T')[0] }
      : m
    ));
  };

  return (
    <div style={{ minHeight: '100%', background: s.bg, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: s.txt }}>Maintenance</h2>
          <p style={{ fontSize: '13px', color: s.muted, marginTop: '2px' }}>{lang === 'en' ? 'Track repairs and maintenance' : 'Gérez les demandes de maintenance et réparations'}</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          <Plus style={{ width: '15px', height: '15px' }} />
          Nouvelle Demande
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Actives', value: String(active), color: '#60a5fa' },
          { label: 'Urgentes', value: String(urgent), color: '#f87171' },
          { label: 'Terminées', value: String(done), color: '#34d399' },
          { label: 'Coût total', value: FCFA(totalCost), color: '#fbbf24' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '14px', padding: '16px' }}>
            <p style={{ fontSize: label === 'Coût total' ? '13px' : '24px', fontWeight: 800, color }}>{value}</p>
            <p style={{ fontSize: '11px', color: s.muted, marginTop: '2px', fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 180px', minWidth: '180px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: s.faint }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher titre ou propriété..."
            style={{ background: s.inp, border: `1px solid ${s.inBdr}`, borderRadius: '10px', padding: '9px 12px 9px 36px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ k: 'all', l: 'Tous statuts' }, { k: 'reported', l: 'Signalé' }, { k: 'in-progress', l: 'En cours' }, { k: 'completed', l: 'Terminé' }].map(({ k, l }) => (
            <button key={k} onClick={() => setFilterStatus(k)}
              style={{ padding: '8px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                background: filterStatus === k ? '#3b82f6' : (s.dk ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
                color: filterStatus === k ? '#fff' : s.muted }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ k: 'all', l: 'Toutes priorités' }, { k: 'urgent', l: 'Urgente' }, { k: 'high', l: 'Élevée' }, { k: 'medium', l: 'Moyenne' }].map(({ k, l }) => (
            <button key={k} onClick={() => setFilterPriority(k)}
              style={{ padding: '8px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                background: filterPriority === k ? '#6366f1' : (s.dk ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
                color: filterPriority === k ? '#fff' : s.muted }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
        {filtered.map(m => (
          <MaintenanceCard key={m.id} item={m} s={s} onComplete={() => markComplete(m.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Wrench style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: s.muted, opacity: 0.4 }} />
          <p style={{ color: s.muted, fontSize: '14px' }}>Aucune demande de maintenance trouvée</p>
        </div>
      )}

      {showAdd && <AddMaintenanceModal s={s} onClose={() => setShowAdd(false)} onAdd={m => setItems(prev => [m, ...prev])} />}
    </div>
  );
}