import { useState, useMemo } from 'react';
import { FileText, Upload, Download, Trash2, Plus, Search, File, X, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockTenants, mockProperties } from '../data/mockData';

const goTo = (page: string, payload?: Record<string, string>) => (window as any).__appNavigate?.(page, payload);

function useS() {
  const { theme } = useApp();
  const dk = theme === 'dark';
  return {
    dk, bg: dk ? 'transparent' : '#f1f5f9',
    card: dk ? 'rgba(255,255,255,0.04)' : '#ffffff',
    bdr:  dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    txt:  dk ? '#ffffff' : '#0f172a',
    muted:dk ? '#9ca3af' : '#64748b',
    faint:dk ? '#6b7280' : '#94a3b8',
    inp:  dk ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    inBdr:dk ? 'rgba(255,255,255,0.1)'  : '#cbd5e1',
    div:  dk ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
  };
}

const FCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FCFA';

interface Contract {
  id: string; tenantId: string; propertyId: string;
  type: 'bail' | 'avenant' | 'etat_lieux' | 'autre';
  name: string; date: string; status: 'active' | 'expired' | 'pending';
  size: string; rent?: number;
}

const TYPE_LABEL: Record<string, string> = { bail: 'Bail', avenant: 'Avenant', etat_lieux: 'État des lieux', autre: 'Autre' };
const TYPE_COLOR: Record<string, { bg: string; txt: string }> = {
  bail:       { bg: 'rgba(59,130,246,0.15)',  txt: '#60a5fa' },
  avenant:    { bg: 'rgba(167,139,250,0.15)', txt: '#a78bfa' },
  etat_lieux: { bg: 'rgba(245,158,11,0.15)',  txt: '#fbbf24' },
  autre:      { bg: 'rgba(156,163,175,0.15)', txt: '#9ca3af' },
};
const STATUS_COLOR: Record<string, { bg: string; txt: string; label: string }> = {
  active:  { bg: 'rgba(52,211,153,0.15)',  txt: '#34d399', label: 'Actif'    },
  expired: { bg: 'rgba(248,113,113,0.15)', txt: '#f87171', label: 'Expiré'   },
  pending: { bg: 'rgba(251,191,36,0.15)',  txt: '#fbbf24', label: 'En cours' },
};

/** Génère les contrats initiaux depuis les vrais locataires */
function buildInitialContracts(): Contract[] {
  const contracts: Contract[] = [];
  mockTenants.forEach(t => {
    const property = mockProperties.find(p => p.id === t.propertyId);
    const propName = property?.name || 'Propriété';
    const now = new Date();
    const leaseEnd = new Date(t.leaseEnd);
    const status: Contract['status'] = leaseEnd < now ? 'expired' : t.status === 'active' ? 'active' : 'pending';

    // Contrat de bail principal
    contracts.push({
      id: `c-bail-${t.id}`, tenantId: t.id, propertyId: t.propertyId || '',
      type: 'bail',
      name: `Contrat de bail - ${t.firstName} ${t.lastName} - ${propName}.pdf`,
      date: t.leaseStart, status,
      size: '245 Ko', rent: t.monthlyRent,
    });

    // État des lieux d'entrée
    contracts.push({
      id: `c-edl-${t.id}`, tenantId: t.id, propertyId: t.propertyId || '',
      type: 'etat_lieux',
      name: `État des lieux entrée - ${t.firstName} ${t.lastName}.pdf`,
      date: t.leaseStart, status: 'active',
      size: '1.2 Mo',
    });
  });

  // Contrat commercial additionnel
  contracts.push({
    id: 'c-com-1', tenantId: '', propertyId: '4',
    type: 'autre',
    name: 'Règlement de copropriété - Local Adidogomé.pdf',
    date: '2024-01-01', status: 'active', size: '320 Ko',
  });

  return contracts;
}

export default function Contracts() {
  const { lang } = useApp();
  const s = useS();
  const [contracts, setContracts] = useState<Contract[]>(useMemo(buildInitialContracts, []));
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ tenantId: '', propertyId: '', type: 'bail' as Contract['type'], name: '' });
  const [uploading, setUploading] = useState(false);

  const inpS: React.CSSProperties = { background: s.inp, border: `1px solid ${s.inBdr}`, borderRadius: '10px', padding: '9px 12px', color: s.txt, fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lbl: React.CSSProperties  = { display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.muted, marginBottom: '6px' };

  const filtered = contracts.filter(c => {
    const t = mockTenants.find(x => x.id === c.tenantId);
    const p = mockProperties.find(x => x.id === c.propertyId);
    return !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (t && `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase())) ||
      (p && p.name.toLowerCase().includes(search.toLowerCase()));
  });

  // Auto-fill property when tenant changes
  const handleTenantChange = (tenantId: string) => {
    const t = mockTenants.find(x => x.id === tenantId);
    setForm(f => ({ ...f, tenantId, propertyId: t?.propertyId || '' }));
  };

  const generate = () => {
    if (!form.name.trim()) return;
    setUploading(true);
    setTimeout(() => {
      const tenant = mockTenants.find(t => t.id === form.tenantId);
      const newC: Contract = {
        id: `c${Date.now()}`, tenantId: form.tenantId, propertyId: form.propertyId,
        type: form.type, name: form.name.endsWith('.pdf') ? form.name : `${form.name}.pdf`,
        date: new Date().toISOString().split('T')[0], status: 'active', size: '—',
        rent: tenant?.monthlyRent,
      };
      setContracts(p => [newC, ...p]);
      setForm({ tenantId: '', propertyId: '', type: 'bail', name: '' });
      setUploading(false); setShowModal(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100%', background: s.bg, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: s.txt }}>{lang === 'en' ? 'Contracts & Documents' : 'Contrats & Documents'}</h2>
          <p style={{ fontSize: '13px', color: s.muted, marginTop: '2px' }}>{contracts.length} {lang === 'en' ? 'documents' : 'documents'}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          <Plus style={{ width: '15px', height: '15px' }} />{lang === 'en' ? 'Add Document' : 'Ajouter Document'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: contracts.length, color: '#60a5fa' },
          { label: 'Actifs', value: contracts.filter(c => c.status === 'active').length, color: '#34d399' },
          { label: 'Expirés', value: contracts.filter(c => c.status === 'expired').length, color: '#f87171' },
          { label: 'En cours', value: contracts.filter(c => c.status === 'pending').length, color: '#fbbf24' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.muted, marginBottom: '6px' }}>{label}</p>
            <p style={{ fontSize: '24px', fontWeight: 800, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: s.faint }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={lang === 'en' ? 'Search documents...' : 'Rechercher un document, locataire, propriété...'}
          style={{ ...inpS, paddingLeft: '36px' }} />
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(c => {
          const tenant   = mockTenants.find(t => t.id === c.tenantId);
          const property = mockProperties.find(p => p.id === c.propertyId);
          const tc = TYPE_COLOR[c.type];
          const sc = STATUS_COLOR[c.status];
          return (
            <div key={c.id}
              style={{ background: s.card, border: `1px solid ${s.bdr}`, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', transition: 'border-color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = s.bdr)}>
              {/* Icône */}
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(248,113,113,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText style={{ width: '20px', height: '20px', color: '#f87171' }} />
              </div>
              {/* Contenu */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: s.txt, marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: tc.bg, color: tc.txt, fontWeight: 600 }}>{TYPE_LABEL[c.type]}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: sc.bg, color: sc.txt, fontWeight: 600 }}>{sc.label}</span>
                  {tenant && (
                    <button onClick={() => goTo('tenants')}
                      style={{ fontSize: '11px', color: s.muted, display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <User style={{ width: '11px', height: '11px' }} />{tenant.firstName} {tenant.lastName}
                    </button>
                  )}
                  {property && <span style={{ fontSize: '11px', color: s.muted }}>{property.name}</span>}
                  {c.rent && <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>{FCFA(c.rent)}/mois</span>}
                  <span style={{ fontSize: '11px', color: s.faint }}>{new Date(c.date).toLocaleDateString('fr-FR')} · {c.size}</span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button title="Télécharger"
                  style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59,130,246,0.12)', border: 'none', cursor: 'pointer', display: 'flex', color: '#60a5fa' }}>
                  <Download style={{ width: '15px', height: '15px' }} />
                </button>
                <button onClick={() => setContracts(prev => prev.filter(x => x.id !== c.id))} title="Supprimer"
                  style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', display: 'flex', color: '#f87171' }}>
                  <Trash2 style={{ width: '15px', height: '15px' }} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <File style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: s.muted, opacity: 0.4 }} />
            <p style={{ color: s.muted }}>Aucun document trouvé</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: s.dk ? '#13161f' : '#fff', border: `1px solid ${s.bdr}`, borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.txt }}>{lang === 'en' ? 'Add Document' : 'Ajouter un Document'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.muted, display: 'flex' }}><X style={{ width: '18px', height: '18px' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={lbl}>Nom du document *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Contrat de bail 2025" style={inpS} /></div>
              <div><label style={lbl}>Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
                  <option value="bail">Bail</option><option value="avenant">Avenant</option>
                  <option value="etat_lieux">État des lieux</option><option value="autre">Autre</option>
                </select>
              </div>
              <div><label style={lbl}>Locataire</label>
                <select value={form.tenantId} onChange={e => handleTenantChange(e.target.value)} style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
                  <option value="">Sélectionner...</option>
                  {mockTenants.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Propriété</label>
                <select value={form.propertyId} onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))} style={{ ...inpS, background: s.dk ? '#1a1d27' : '#f8fafc' }}>
                  <option value="">Sélectionner...</option>
                  {mockProperties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', borderRadius: '12px', border: `2px dashed ${s.bdr}`, cursor: 'pointer', color: s.muted, fontSize: '13px', gap: '6px' }}>
                <Upload style={{ width: '24px', height: '24px' }} />
                <span>Glisser un fichier ou <span style={{ color: '#60a5fa' }}>parcourir</span></span>
                <span style={{ fontSize: '11px' }}>PDF, DOC, DOCX</span>
                <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: `1px solid ${s.bdr}`, background: 'transparent', color: s.muted, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
              <button onClick={generate} disabled={uploading} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                {uploading ? '⟳ Création...' : 'Créer le document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}