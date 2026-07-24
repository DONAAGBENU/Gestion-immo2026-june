import { useState } from 'react';
import {
  Plus, Search, Mail, Phone, Calendar, Edit, Eye, User,
  Home, CreditCard, FileText, ChevronRight, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockTenants, mockProperties, mockPayments } from '../data/mockData';
import { Tenant } from '../types';

/* ── utilitaire navigation ── */
const goTo = (page: string, payload?: Record<string, string>) => {
  (window as any).__appNavigate?.(page, payload);
};

/* ── styles thème ── */
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
    hover: dk ? 'rgba(255,255,255,0.06)' : '#f8fafc',
  };
}

const FCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA';

const STATUS_META: Record<string, { bg: string; txt: string; label: string }> = {
  active:   { bg: 'rgba(52,211,153,0.15)',  txt: '#34d399', label: 'Actif'      },
  inactive: { bg: 'rgba(248,113,113,0.15)', txt: '#f87171', label: 'Inactif'    },
  pending:  { bg: 'rgba(251,191,36,0.15)',  txt: '#fbbf24', label: 'En attente' },
};

/* ── Modal Détails ── */
function TenantModal({ tenant, s, onClose }: { tenant: Tenant; s: ReturnType<typeof useS>; onClose: () => void }) {
  const property = mockProperties.find(p => p.id === tenant.propertyId);
  const payments = mockPayments.filter(p => p.tenantId === tenant.id);
  const paidCount = payments.filter(p => p.status === 'paid').length;
  const pendingCount = payments.filter(p => p.status === 'pending' || p.status === 'overdue').length;
  const sm = STATUS_META[tenant.status] ?? STATUS_META.active;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
      <div style={{ background: s.dk ? '#13161f' : '#fff', border: `1px solid ${s.bdr}`, borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{tenant.firstName[0]}{tenant.lastName[0]}</span>
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: s.txt }}>{tenant.firstName} {tenant.lastName}</p>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '99px', background: sm.bg, color: sm.txt }}>{sm.label}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex', padding: '4px' }}><X style={{ width: '18px', height: '18px' }} /></button>
        </div>

        {/* Infos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {[
            { icon: Mail, label: tenant.email },
            { icon: Phone, label: tenant.phone },
            { icon: Calendar, label: `Bail : ${new Date(tenant.leaseStart).toLocaleDateString('fr-FR')} → ${new Date(tenant.leaseEnd).toLocaleDateString('fr-FR')}` },
            { icon: Home, label: property ? property.name : 'Propriété non assignée' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon style={{ width: '15px', height: '15px', color: s.muted, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: s.muted }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Stats loyer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Loyer/mois', value: FCFA(tenant.monthlyRent), color: '#60a5fa' },
            { label: 'Paiements OK', value: String(paidCount), color: '#34d399' },
            { label: 'En attente', value: String(pendingCount), color: '#f87171' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: s.dk ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: 800, color }}>{value}</p>
              <p style={{ fontSize: '10px', color: s.muted, marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Liens de navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => { onClose(); goTo('payments', { tenantId: tenant.id }); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', cursor: 'pointer', color: '#60a5fa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard style={{ width: '15px', height: '15px' }} />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Voir les paiements</span>
            </div>
            <ChevronRight style={{ width: '15px', height: '15px' }} />
          </button>
          <button onClick={() => { onClose(); goTo('contracts', { tenantId: tenant.id }); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', cursor: 'pointer', color: '#a78bfa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText style={{ width: '15px', height: '15px' }} />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Voir les contrats</span>
            </div>
            <ChevronRight style={{ width: '15px', height: '15px' }} />
          </button>
          {property && (
            <button onClick={() => { onClose(); goTo('map'); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', cursor: 'pointer', color: '#34d399' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Home style={{ width: '15px', height: '15px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Voir la propriété sur la carte</span>
              </div>
              <ChevronRight style={{ width: '15px', height: '15px' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Formulaire Ajout ── */
function AddTenantModal({ s, onClose, onAdd }: { s: ReturnType<typeof useS>; onClose: () => void; onAdd: (t: Tenant) => void }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    leaseStart: '', leaseEnd: '', monthlyRent: '', deposit: '', propertyId: '',
  });
  const inpS: React.CSSProperties = { background: s.inp, border: `1px solid ${s.inBdr}`, borderRadius: '10px', padding: '9px 12px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lbl: React.CSSProperties  = { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.muted, marginBottom: '6px' };

  const submit = () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    onAdd({
      id: `t${Date.now()}`,
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, phone: form.phone,
      leaseStart: form.leaseStart, leaseEnd: form.leaseEnd,
      monthlyRent: Number(form.monthlyRent) || 0,
      deposit: Number(form.deposit) || 0,
      status: 'active',
      propertyId: form.propertyId || undefined,
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
      <div style={{ background: s.dk ? '#13161f' : '#fff', border: `1px solid ${s.bdr}`, borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.txt }}>Ajouter un Locataire</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex' }}><X style={{ width: '18px', height: '18px' }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div><label style={lbl}>Prénom *</label><input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Kofi" style={inpS} /></div>
            <div><label style={lbl}>Nom *</label><input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="MENSAH" style={inpS} /></div>
          </div>
          <div><label style={lbl}>Email *</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="kofi@gmail.com" style={inpS} /></div>
          <div><label style={lbl}>Téléphone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="90112233" style={inpS} /></div>
          <div><label style={lbl}>Propriété</label>
            <select value={form.propertyId} onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))} style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
              <option value="">Sélectionner une propriété...</option>
              {mockProperties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div><label style={lbl}>Début du bail</label><input type="date" value={form.leaseStart} onChange={e => setForm(f => ({ ...f, leaseStart: e.target.value }))} style={inpS} /></div>
            <div><label style={lbl}>Fin du bail</label><input type="date" value={form.leaseEnd} onChange={e => setForm(f => ({ ...f, leaseEnd: e.target.value }))} style={inpS} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div><label style={lbl}>Loyer mensuel (FCFA)</label><input type="number" value={form.monthlyRent} onChange={e => setForm(f => ({ ...f, monthlyRent: e.target.value }))} placeholder="150000" style={inpS} /></div>
            <div><label style={lbl}>Dépôt (FCFA)</label><input type="number" value={form.deposit} onChange={e => setForm(f => ({ ...f, deposit: e.target.value }))} placeholder="300000" style={inpS} /></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: `1px solid ${s.bdr}`, background: 'transparent', color: s.muted, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
          <button onClick={submit} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

/* ── Carte Locataire ── */
function TenantCard({ tenant, s, onView }: { tenant: Tenant; s: ReturnType<typeof useS>; onView: () => void }) {
  const property = mockProperties.find(p => p.id === tenant.propertyId);
  const sm = STATUS_META[tenant.status] ?? STATUS_META.active;
  const pendingPayments = mockPayments.filter(p => p.tenantId === tenant.id && (p.status === 'pending' || p.status === 'overdue')).length;

  return (
    <div style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '16px', padding: '18px', transition: 'all .2s', cursor: 'default' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = s.bdr)}>
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{tenant.firstName[0]}{tenant.lastName[0]}</span>
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: s.txt }}>{tenant.firstName} {tenant.lastName}</p>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', background: sm.bg, color: sm.txt }}>{sm.label}</span>
          </div>
        </div>
        {pendingPayments > 0 && (
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
            {pendingPayments} impayé{pendingPayments > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Infos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
        {[
          { icon: Mail, text: tenant.email },
          { icon: Phone, text: tenant.phone },
          { icon: Calendar, text: `${new Date(tenant.leaseStart).toLocaleDateString('fr-FR')} → ${new Date(tenant.leaseEnd).toLocaleDateString('fr-FR')}` },
          ...(property ? [{ icon: Home, text: property.name }] : []),
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon style={{ width: '13px', height: '13px', color: s.faint, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: s.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${s.div}` }}>
        <div>
          <p style={{ fontSize: '10px', color: s.faint, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loyer mensuel</p>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#60a5fa' }}>{FCFA(tenant.monthlyRent)}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onView}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            <Eye style={{ width: '13px', height: '13px' }} /> Détails
          </button>
          <button
            style={{ padding: '7px', borderRadius: '10px', background: s.dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9', border: `1px solid ${s.bdr}`, color: s.muted, cursor: 'pointer', display: 'flex' }}>
            <Edit style={{ width: '13px', height: '13px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page principale ── */
export default function Tenants() {
  const { lang } = useApp();
  const s = useS();
  const [tenants, setTenants] = useState([...mockTenants]);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [viewTenant, setViewTenant] = useState<Tenant | null>(null);

  const filtered = tenants.filter(t => {
    const matchSearch = `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                        t.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total:    tenants.length,
    active:   tenants.filter(t => t.status === 'active').length,
    inactive: tenants.filter(t => t.status === 'inactive').length,
    pending:  tenants.filter(t => t.status === 'pending').length,
  };

  return (
    <div style={{ minHeight: '100%', background: s.bg, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: s.txt }}>{lang === 'en' ? 'Tenants' : 'Locataires'}</h2>
          <p style={{ fontSize: '13px', color: s.muted, marginTop: '2px' }}>{lang === 'en' ? 'Manage your tenants' : 'Gérez vos locataires et leurs informations'}</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          <Plus style={{ width: '15px', height: '15px' }} />
          {lang === 'en' ? 'Add Tenant' : 'Ajouter Locataire'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: stats.total, color: '#60a5fa' },
          { label: 'Actifs', value: stats.active, color: '#34d399' },
          { label: 'Inactifs', value: stats.inactive, color: '#f87171' },
          { label: 'En attente', value: stats.pending, color: '#fbbf24' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 800, color }}>{value}</p>
            <p style={{ fontSize: '11px', color: s.muted, marginTop: '2px', fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Recherche + Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: s.faint }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search tenant...' : 'Rechercher un locataire...'}
            style={{ background: s.inp, border: `1px solid ${s.inBdr}`, borderRadius: '10px', padding: '9px 12px 9px 36px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['all', 'active', 'inactive', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                background: filter === f ? '#3b82f6' : (s.dk ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
                color: filter === f ? '#fff' : s.muted }}>
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'inactive' ? 'Inactifs' : 'En attente'}
            </button>
          ))}
        </div>
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
        {filtered.map(t => (
          <TenantCard key={t.id} tenant={t} s={s} onView={() => setViewTenant(t)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <User style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: s.muted, opacity: 0.4 }} />
          <p style={{ color: s.muted, fontSize: '14px' }}>Aucun locataire trouvé</p>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddTenantModal s={s} onClose={() => setShowAdd(false)}
          onAdd={t => setTenants(prev => [t, ...prev])} />
      )}
      {viewTenant && (
        <TenantModal tenant={viewTenant} s={s} onClose={() => setViewTenant(null)} />
      )}
    </div>
  );
}