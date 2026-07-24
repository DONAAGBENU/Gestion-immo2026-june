import { useState } from 'react';
import { Plus, Search, Clock, CheckCircle, AlertCircle, XCircle, ChevronRight, X, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockPayments, mockTenants, mockProperties } from '../data/mockData';
import { Payment } from '../types';

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
    thead: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc',
  };
}

const FCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA';

const STATUS_META: Record<string, { icon: React.ComponentType<any>; bg: string; txt: string; label: string }> = {
  paid:    { icon: CheckCircle, bg: 'rgba(52,211,153,0.15)',  txt: '#34d399', label: 'Payé'      },
  pending: { icon: Clock,       bg: 'rgba(251,191,36,0.15)',  txt: '#fbbf24', label: 'En attente' },
  overdue: { icon: XCircle,     bg: 'rgba(248,113,113,0.15)', txt: '#f87171', label: 'En retard'  },
};

const TYPE_LABEL: Record<string, string> = {
  rent: 'Loyer', deposit: 'Dépôt', utilities: 'Charges', other: 'Autre',
};

/* ── Modal ajout ── */
function AddPaymentModal({ s, onClose, onAdd }: { s: ReturnType<typeof useS>; onClose: () => void; onAdd: (p: Payment) => void }) {
  const [form, setForm] = useState({ tenantId: '', propertyId: '', type: 'rent' as Payment['type'], amount: '', dueDate: '' });
  const inpS: React.CSSProperties = { background: s.inp, border: `1px solid ${s.inBdr}`, borderRadius: '10px', padding: '9px 12px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lbl: React.CSSProperties  = { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.muted, marginBottom: '6px' };

  const selectedTenant = mockTenants.find(t => t.id === form.tenantId);

  const submit = () => {
    if (!form.tenantId || !form.amount || !form.dueDate) return;
    onAdd({
      id: `pay${Date.now()}`,
      tenantId: form.tenantId,
      propertyId: form.propertyId || selectedTenant?.propertyId || '',
      type: form.type,
      amount: Number(form.amount),
      dueDate: form.dueDate,
      status: 'pending',
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
      <div style={{ background: s.dk ? '#13161f' : '#fff', border: `1px solid ${s.bdr}`, borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.txt }}>Enregistrer un Paiement</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex' }}><X style={{ width: '18px', height: '18px' }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><label style={lbl}>Locataire *</label>
            <select value={form.tenantId} onChange={e => setForm(f => ({ ...f, tenantId: e.target.value, propertyId: mockTenants.find(t => t.id === e.target.value)?.propertyId || '' }))}
              style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
              <option value="">Sélectionner un locataire...</option>
              {mockTenants.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Payment['type'] }))}
              style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
              <option value="rent">Loyer</option>
              <option value="deposit">Dépôt de garantie</option>
              <option value="utilities">Charges</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div><label style={lbl}>Montant (FCFA) *</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder={selectedTenant ? String(selectedTenant.monthlyRent) : '150000'} style={inpS} />
          </div>
          <div><label style={lbl}>Date d'échéance *</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={inpS} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: `1px solid ${s.bdr}`, background: 'transparent', color: s.muted, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
          <button onClick={submit} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ── Card paiement (mobile) ── */
function PaymentCard({ payment, s }: { payment: Payment; s: ReturnType<typeof useS> }) {
  const tenant   = mockTenants.find(t => t.id === payment.tenantId);
  const property = mockProperties.find(p => p.id === payment.propertyId);
  const sm = STATUS_META[payment.status] ?? STATUS_META.pending;
  const Icon = sm.icon;

  return (
    <div style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
          {tenant ? `${tenant.firstName[0]}${tenant.lastName[0]}` : '?'}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: s.txt }}>{tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Inconnu'}</p>
            <p style={{ fontSize: '11px', color: s.muted }}>{property?.name || 'Propriété inconnue'}</p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px', background: sm.bg, color: sm.txt, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <Icon style={{ width: '10px', height: '10px' }} />{sm.label}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 800, color: '#60a5fa' }}>{FCFA(payment.amount)}</p>
            <p style={{ fontSize: '11px', color: s.faint }}>{TYPE_LABEL[payment.type]} · Éch. {new Date(payment.dueDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <button onClick={() => goTo('tenants')}
            style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: 'none', color: '#60a5fa', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
            Locataire <ChevronRight style={{ width: '11px', height: '11px', display: 'inline', verticalAlign: 'middle' }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Ligne table (desktop) ── */
function PaymentRow({ payment, s }: { payment: Payment; s: ReturnType<typeof useS> }) {
  const tenant   = mockTenants.find(t => t.id === payment.tenantId);
  const property = mockProperties.find(p => p.id === payment.propertyId);
  const sm = STATUS_META[payment.status] ?? STATUS_META.pending;
  const Icon = sm.icon;

  return (
    <tr style={{ borderBottom: `1px solid ${s.div}`, transition: 'background .15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = s.dk ? 'rgba(255,255,255,0.03)' : '#f8fafc')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{tenant ? `${tenant.firstName[0]}${tenant.lastName[0]}` : '?'}</span>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: s.txt }}>{tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Inconnu'}</p>
            <p style={{ fontSize: '11px', color: s.muted }}>{tenant?.email}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: '13px', color: s.txt }}>{property?.name || '—'}</p>
        <p style={{ fontSize: '11px', color: s.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{property?.address}</p>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#60a5fa' }}>{FCFA(payment.amount)}</p>
        <p style={{ fontSize: '11px', color: s.muted }}>{TYPE_LABEL[payment.type]}</p>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: '13px', color: s.txt }}>{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</p>
        {payment.paidDate && <p style={{ fontSize: '11px', color: '#34d399' }}>✓ {new Date(payment.paidDate).toLocaleDateString('fr-FR')}</p>}
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '99px', background: sm.bg, color: sm.txt, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Icon style={{ width: '11px', height: '11px' }} />{sm.label}
        </span>
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        <button onClick={() => goTo('tenants')}
          style={{ fontSize: '12px', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Voir →
        </button>
      </td>
    </tr>
  );
}

/* ── Page principale ── */
export default function Payments() {
  const { lang } = useApp();
  const s = useS();
  const [payments, setPayments] = useState([...mockPayments]);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdd, setShowAdd]   = useState(false);

  const filtered = payments.filter(p => {
    const t    = mockTenants.find(t => t.id === p.tenantId);
    const prop = mockProperties.find(x => x.id === p.propertyId);
    const matchSearch = !search ||
      (t && `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase())) ||
      (prop && prop.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const total   = filtered.reduce((s, p) => s + p.amount, 0);
  const paid    = filtered.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = filtered.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const overdue = filtered.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ minHeight: '100%', background: s.bg, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: s.txt }}>{lang === 'en' ? 'Payments' : 'Paiements'}</h2>
          <p style={{ fontSize: '13px', color: s.muted, marginTop: '2px' }}>{lang === 'en' ? 'Track rents and payments' : 'Suivez les loyers et paiements de vos locataires'}</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          <Plus style={{ width: '15px', height: '15px' }} />
          {lang === 'en' ? 'Record Payment' : 'Enregistrer Paiement'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: lang === 'en' ? 'Received' : 'Paiements reçus',   value: FCFA(paid),    color: '#34d399', icon: CheckCircle },
          { label: lang === 'en' ? 'Pending' : 'En attente',          value: FCFA(pending), color: '#fbbf24', icon: Clock },
          { label: lang === 'en' ? 'Overdue' : 'En retard',           value: FCFA(overdue), color: '#f87171', icon: AlertCircle },
          { label: lang === 'en' ? 'Total' : 'Total',                  value: FCFA(total),   color: '#60a5fa', icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: `${color}22` }}>
                <Icon style={{ width: '16px', height: '16px', color }} />
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 800, color }}>{value}</p>
                <p style={{ fontSize: '11px', color: s.muted }}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: s.faint }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search tenant or property...' : 'Rechercher locataire ou propriété...'}
            style={{ background: s.inp, border: `1px solid ${s.inBdr}`, borderRadius: '10px', padding: '9px 12px 9px 36px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[{ k: 'all', l: 'Tous' }, { k: 'paid', l: 'Payé' }, { k: 'pending', l: 'En attente' }, { k: 'overdue', l: 'En retard' }].map(({ k, l }) => (
            <button key={k} onClick={() => setFilterStatus(k)}
              style={{ padding: '8px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                background: filterStatus === k ? '#3b82f6' : (s.dk ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
                color: filterStatus === k ? '#fff' : s.muted }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table (desktop) */}
      <div style={{ display: 'none' }} className="payments-table-wrapper">
        <div style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: s.thead }}>
                  {['Locataire', 'Propriété', 'Montant', 'Date', 'Statut', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => <PaymentRow key={p.id} payment={p} s={s} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cards (mobile + fallback) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(p => <PaymentCard key={p.id} payment={p} s={s} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Clock style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: s.muted, opacity: 0.4 }} />
          <p style={{ color: s.muted, fontSize: '14px' }}>Aucun paiement trouvé</p>
        </div>
      )}

      {showAdd && <AddPaymentModal s={s} onClose={() => setShowAdd(false)} onAdd={p => setPayments(prev => [p, ...prev])} />}
    </div>
  );
}