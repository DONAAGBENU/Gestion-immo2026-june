import { useState, useRef } from 'react';
import { User, Bell, ChevronRight, Mail, Phone, Lock, Eye, LogOut, MapPin, ShieldCheck, CheckCircle, Edit, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const WEST_AFRICA = [
  { code:'+228',flag:'🇹🇬',name:'Togo' },{ code:'+225',flag:'🇨🇮',name:"Côte d'Ivoire" },
  { code:'+221',flag:'🇸🇳',name:'Sénégal' },{ code:'+223',flag:'🇲🇱',name:'Mali' },
  { code:'+226',flag:'🇧🇫',name:'Burkina Faso' },{ code:'+224',flag:'🇬🇳',name:'Guinée' },
  { code:'+229',flag:'🇧🇯',name:'Bénin' },{ code:'+227',flag:'🇳🇪',name:'Niger' },
  { code:'+234',flag:'🇳🇬',name:'Nigeria' },{ code:'+233',flag:'🇬🇭',name:'Ghana' },
  { code:'+220',flag:'🇬🇲',name:'Gambie' },{ code:'+222',flag:'🇲🇷',name:'Mauritanie' },
];

function useS() {
  const { theme } = useApp();
  const dk = theme === 'dark';
  return {
    dk,
    bg:   dk ? 'transparent' : '#f1f5f9',
    card: dk ? 'rgba(255,255,255,0.04)' : '#ffffff',
    bdr:  dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    txt:  dk ? '#ffffff' : '#0f172a',
    muted:dk ? '#9ca3af' : '#64748b',
    faint:dk ? '#6b7280' : '#94a3b8',
    inp:  dk ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    inBdr:dk ? 'rgba(255,255,255,0.1)'  : '#cbd5e1',
    div:  dk ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
    actBg:dk ? 'rgba(59,130,246,0.15)'  : '#eff6ff',
    actBdr:dk ? 'rgba(59,130,246,0.4)'  : '#bfdbfe',
    actTxt:dk ? '#93c5fd' : '#1d4ed8',
  };
}

const lbl: React.CSSProperties = { display:'block', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'6px' };

export default function Settings() {
  const { theme, setTheme, lang, setLang, profile, setProfile } = useApp();
  const { user, logout } = useAuth();
  const s = useS();
  const [tab,    setTab]    = useState('profile');
  const [local,  setLocal]  = useState({ ...profile });
  const [saved,  setSaved]  = useState(false);
  const [pwd,    setPwd]    = useState({ current:'', newPwd:'', confirm:'' });
  const [showPwd,setShowPwd]= useState(false);
  const [notifs, setNotifs] = useState({ email:true, push:true, sms:false, reports:true });
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => { setProfile(local); setSaved(true); setTimeout(() => setSaved(false), 2200); };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => setLocal(p => ({ ...p, avatar: ev.target?.result as string }));
    r.readAsDataURL(file);
  };

  const TABS = [
    { id:'profile',    label: lang==='en'?'Profile':'Profil',             icon:User    },
    { id:'appearance', label: lang==='en'?'Appearance':'Apparence',       icon:Edit   },
    { id:'language',   label: lang==='en'?'Language':'Langue',            icon:MapPin },
    { id:'notifs',     label: 'Notifications',                            icon:Bell    },
    { id:'security',   label: lang==='en'?'Security':'Sécurité',          icon:ShieldCheck  },
  ];

  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    background:s.inp, border:`1px solid ${s.inBdr}`, color:s.txt,
    borderRadius:'10px', padding:'9px 12px', outline:'none', width:'100%', fontSize:'14px', ...extra,
  });

  const content = () => {
    /* ── PROFIL ── */
    if (tab === 'profile') return (
      <div className="space-y-5">
        <SHead icon={User} label={lang==='en'?'Personal Information':'Informations personnelles'} s={s} />
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
              {local.avatar
                ? <img src={local.avatar} alt="av" className="w-full h-full object-cover" />
                : <span className="text-2xl font-black text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>}
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-lg" style={{ background:'#3b82f6', color:'#fff' }}>
              <Edit className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div>
            <p className="font-bold" style={{ color:s.txt }}>{user?.firstName} {user?.lastName}</p>
            <p className="text-sm" style={{ color:s.muted }}>
              {user?.role === 'admin' ? '👑 Administrateur' : '👤 Client'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['firstName',lang==='en'?'First name':'Prénom'],['lastName',lang==='en'?'Last name':'Nom']].map(([k,l]) => (
            <div key={k}>
              <label style={{ ...lbl, color:s.muted }}>{l}</label>
              <input value={(local as any)[k]} onChange={e => setLocal(p => ({ ...p, [k]: e.target.value }))} style={inp()} />
            </div>
          ))}
          <div>
            <label style={{ ...lbl, color:s.muted }}>Email</label>
            <div style={{ position:'relative' }}>
              <Mail style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'14px', height:'14px', color:s.faint }} />
              <input value={local.email} onChange={e => setLocal(p => ({ ...p, email:e.target.value }))} type="email" style={inp({ paddingLeft:'34px' })} />
            </div>
          </div>
          {/* Téléphone */}
          <div>
            <label style={{ ...lbl, color:s.muted }}>{lang==='en'?'Phone':'Téléphone'}</label>
            <div style={{ display:'flex', gap:'6px' }}>
              <select value={local.countryCode} onChange={e => setLocal(p => ({ ...p, countryCode:e.target.value }))}
                style={{ background:s.inp, border:`1px solid ${s.inBdr}`, borderRadius:'10px', color:s.txt, padding:'9px 6px', fontSize:'12px', outline:'none', flexShrink:0 }}>
                {WEST_AFRICA.map(c => <option key={c.code} value={c.code} style={{ background:'#1a1d27' }}>{c.flag} {c.code}</option>)}
              </select>
              <div style={{ position:'relative', flex:1 }}>
                <Phone style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'13px', height:'13px', color:s.faint }} />
                <input value={local.phone} onChange={e => setLocal(p => ({ ...p, phone:e.target.value }))}
                  type="tel" style={inp({ paddingLeft:'30px' })} />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label style={{ ...lbl, color:s.muted }}>{lang==='en'?'Address':'Adresse'}</label>
            <div style={{ position:'relative' }}>
              <MapPin style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'14px', height:'14px', color:s.faint }} />
              <input value={local.address} onChange={e => setLocal(p => ({ ...p, address:e.target.value }))} style={inp({ paddingLeft:'34px' })} />
            </div>
          </div>
        </div>
      </div>
    );

    /* ── APPARENCE ── */
    if (tab === 'appearance') return (
      <div className="space-y-5">
        <SHead icon={Edit} label={lang==='en'?"Interface Theme":"Thème de l'interface"} s={s} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
              { id:'dark',  Icon:Zap, label:lang==='en'?'Dark Mode':'Mode Sombre',  prev:['#0a0c10','#13161f','#1e2330'] },
              { id:'light', Icon:Zap,  label:lang==='en'?'Light Mode':'Mode Clair',  prev:['#f1f5f9','#ffffff','#e2e8f0'] },
            ].map(opt => {
            const sel = theme === opt.id;
            return (
              <button key={opt.id} onClick={() => setTheme(opt.id as any)}
                className="relative p-5 rounded-2xl text-left transition-all duration-200"
                style={{ background: sel ? s.actBg : s.card, border:`2px solid ${sel ? '#3b82f6' : s.bdr}`, transform: sel ? 'scale(1.02)' : 'scale(1)' }}>
                {sel && <div className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center" style={{ background:'#3b82f6' }}><CheckCircle className="h-3.5 w-3.5 text-white" /></div>}
                <div className="flex space-x-1.5 mb-3">{opt.prev.map((c,i) => <div key={i} className="h-7 flex-1 rounded-lg" style={{ background:c }} />)}</div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl" style={{ background: sel ? 'rgba(59,130,246,0.2)':'rgba(128,128,128,0.1)' }}>
                    <opt.Icon className="h-4 w-4" style={{ color: sel ? '#60a5fa' : s.muted }} />
                  </div>
                  <p className="font-bold text-sm" style={{ color:s.txt }}>{opt.label}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-4 rounded-xl" style={{ background: s.dk ? 'rgba(59,130,246,0.07)':'#eff6ff', border:`1px solid ${s.dk ? 'rgba(59,130,246,0.2)':'#bfdbfe'}` }}>
          <p className="text-xs" style={{ color: s.dk ? '#93c5fd':'#1d4ed8' }}>
            ✅ {lang==='en' ? `Current: ${theme==='dark'?'Dark':'Light'} mode — applied immediately.` : `Thème actuel : ${theme==='dark'?'Sombre':'Clair'} — appliqué immédiatement.`}
          </p>
        </div>
      </div>
    );

    /* ── LANGUE ── */
    if (tab === 'language') return (
      <div className="space-y-5">
        <SHead icon={MapPin} label={lang==='en'?'Interface Language':"Langue de l'interface"} s={s} />
        <div className="space-y-3">
          {[{id:'fr',flag:'🇫🇷',name:'Français',sub:'French · France'},{id:'en',flag:'🇬🇧',name:'English',sub:'Anglais · UK'}].map(opt => {
            const sel = lang === opt.id;
            return (
              <button key={opt.id} onClick={() => setLang(opt.id as any)}
                className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
                style={{ background: sel ? s.actBg : s.card, border:`2px solid ${sel ? '#3b82f6' : s.bdr}` }}>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{opt.flag}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color:s.txt }}>{opt.name}</p>
                    <p className="text-xs" style={{ color:s.muted }}>{opt.sub}</p>
                  </div>
                </div>
                <div className="h-6 w-6 rounded-full flex items-center justify-center"
                  style={{ background: sel ? '#3b82f6':'transparent', border: sel ? 'none':`2px solid ${s.inBdr}` }}>
                  {sel && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );

    /* ── NOTIFICATIONS ── */
    if (tab === 'notifs') return (
      <div className="space-y-5">
        <SHead icon={Bell} label={lang==='en'?'Notification Preferences':'Préférences de notification'} s={s} />
        <div className="space-y-3">
          {[
            { k:'email',   l:'Email',         d: lang==='en'?'Receive alerts by email':'Alertes par email' },
            { k:'push',    l:'Push',           d: lang==='en'?'Browser notifications':'Notifications navigateur' },
            { k:'sms',     l:'SMS',            d: lang==='en'?'Urgent alerts by SMS':'Alertes urgentes SMS' },
            { k:'reports', l: lang==='en'?'Weekly Reports':'Rapports hebdo', d: lang==='en'?'Summary every Monday':'Résumé chaque lundi' },
          ].map(({ k, l, d }) => {
            const on = notifs[k as keyof typeof notifs];
            return (
              <div key={k} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background:s.card, border:`1px solid ${s.bdr}` }}>
                <div><p className="text-sm font-semibold" style={{ color:s.txt }}>{l}</p><p className="text-xs mt-0.5" style={{ color:s.muted }}>{d}</p></div>
                <button onClick={() => setNotifs(n => ({ ...n, [k]: !on }))}
                  style={{ width:'44px', height:'24px', borderRadius:'12px', border:'none', cursor:'pointer', position:'relative', flexShrink:0,
                           background: on ? '#3b82f6' : (s.dk ? 'rgba(255,255,255,0.1)':'#cbd5e1'), transition:'background .3s' }}>
                  <div style={{ position:'absolute', top:'4px', width:'16px', height:'16px', borderRadius:'50%', background:'#fff', left: on ? '24px':'4px', transition:'left .3s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );

    /* ── SÉCURITÉ ── */
    if (tab === 'security') return (
      <div className="space-y-5">
        <SHead icon={ShieldCheck} label={lang==='en'?'Account Security':'Sécurité du compte'} s={s} />
        <div className="space-y-4">
          {[
            [lang==='en'?'Current password':'Mot de passe actuel','current'],
            [lang==='en'?'New password':'Nouveau mot de passe','newPwd'],
            [lang==='en'?'Confirm':'Confirmer','confirm'],
          ].map(([l, k]) => (
            <div key={k}>
              <label style={{ ...lbl, color:s.muted }}>{l}</label>
              <div style={{ position:'relative' }}>
                <Lock style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'14px', height:'14px', color:s.faint }} />
                <input type={showPwd ? 'text':'password'} value={(pwd as any)[k]}
                  onChange={e => setPwd(p => ({ ...p, [k]: e.target.value }))}
                  style={{ ...inp({ paddingLeft:'34px', paddingRight:'38px' }) }} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:s.faint, display:'flex' }}>
                  <Eye style={{ width:'14px', height:'14px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl mt-2" style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-sm font-semibold mb-2" style={{ color:'#f87171' }}>
            {lang==='en'?'⚠️ Log out':'⚠️ Déconnexion'}
          </p>
          <button onClick={logout} className="flex items-center px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)', cursor:'pointer' }}>
            <LogOut className="h-4 w-4 mr-2" />
            {lang==='en'?'Log out of account':'Se déconnecter du compte'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full p-4 sm:p-6" style={{ background:s.bg }}>
      <div className="mb-5">
        <h2 className="text-2xl font-bold" style={{ color:s.txt }}>{lang==='en'?'Settings':'Paramètres'}</h2>
        <p className="text-sm mt-1" style={{ color:s.muted }}>{lang==='en'?'Manage your profile and preferences':'Gérez votre profil et vos préférences'}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="p-4 rounded-2xl mb-3 flex items-center space-x-3" style={{ background:s.card, border:`1px solid ${s.bdr}` }}>
            <div className="h-11 w-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
              {local.avatar ? <img src={local.avatar} alt="av" className="w-full h-full object-cover" />
                : <span className="text-sm font-black text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color:s.txt }}>{user?.firstName} {user?.lastName}</p>
              <p className="text-xs truncate" style={{ color: user?.role==='admin'?'#f87171':'#60a5fa' }}>
                {user?.role === 'admin' ? '👑 Admin' : '👤 Client'}
              </p>
            </div>
          </div>
          <div className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0" style={{ scrollbarWidth:'none' }}>
            {TABS.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl whitespace-nowrap flex-shrink-0 lg:w-full transition-all"
                  style={{ background: active ? s.actBg:'transparent', border:`1px solid ${active ? s.actBdr:'transparent'}`, color: active ? s.actTxt : s.muted }}>
                  <t.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{t.label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:block" style={{ color:s.actTxt }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="p-5 sm:p-6 rounded-2xl" style={{ background:s.card, border:`1px solid ${s.bdr}` }}>
            {content()}
            {tab !== 'notifs' && (
              <div className="mt-6 pt-4 flex flex-col sm:flex-row sm:justify-end gap-3" style={{ borderTop:`1px solid ${s.div}` }}>
                <button className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border:`1px solid ${s.bdr}`, color:s.muted, background:'transparent', cursor:'pointer' }}>
                  {lang==='en'?'Cancel':'Annuler'}
                </button>
                <button onClick={save}
                  className="flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: saved ? 'linear-gradient(135deg,#10b981,#059669)':'linear-gradient(135deg,#3b82f6,#6366f1)', color:'#fff', minWidth:'140px', border:'none', cursor:'pointer' }}>
                      {saved ? <><CheckCircle className="h-4 w-4 mr-2" />{lang==='en'?'Saved!':'Sauvegardé!'}</>
                        : <><Save className="h-4 w-4 mr-2" />{lang==='en'?'Save changes':'Sauvegarder'}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SHead({ icon:Icon, label, s }: any) {
  return (
    <div className="flex items-center space-x-2 mb-5 pb-3" style={{ borderBottom:`1px solid ${s.div}` }}>
      <div className="p-1.5 rounded-lg" style={{ background:'rgba(59,130,246,0.15)' }}>
        <Icon className="h-4 w-4" style={{ color:'#60a5fa' }} />
      </div>
      <h3 className="text-sm font-bold" style={{ color:s.txt }}>{label}</h3>
    </div>
  );
}

function Save(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>; }