import { useState } from 'react';
import { Building2, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth, RegisterData } from '../context/AuthContext';

const WEST_AFRICA = [
  { code:'+228', flag:'🇹🇬', name:'Togo' },
  { code:'+225', flag:'🇨🇮', name:"Côte d'Ivoire" },
  { code:'+221', flag:'🇸🇳', name:'Sénégal' },
  { code:'+223', flag:'🇲🇱', name:'Mali' },
  { code:'+226', flag:'🇧🇫', name:'Burkina Faso' },
  { code:'+224', flag:'🇬🇳', name:'Guinée' },
  { code:'+229', flag:'🇧🇯', name:'Bénin' },
  { code:'+227', flag:'🇳🇪', name:'Niger' },
  { code:'+234', flag:'🇳🇬', name:'Nigeria' },
  { code:'+233', flag:'🇬🇭', name:'Ghana' },
  { code:'+220', flag:'🇬🇲', name:'Gambie' },
  { code:'+245', flag:'🇬🇼', name:'Guinée-Bissau' },
  { code:'+232', flag:'🇸🇱', name:'Sierra Leone' },
  { code:'+231', flag:'🇱🇷', name:'Libéria' },
  { code:'+222', flag:'🇲🇷', name:'Mauritanie' },
  { code:'+238', flag:'🇨🇻', name:'Cap-Vert' },
];

const val = {
  name:     (v: string) => v.trim().length >= 2,
  email:    (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone:    (v: string) => /^\d{6,12}$/.test(v.replace(/\s/g,'')),
  password: (v: string) => v.length >= 8 && /[A-Z]/.test(v) && /\d/.test(v),
  address:  (v: string) => v.trim().length >= 5,
};

const pwdStrength = (p: string) => [p.length>=8, /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;

const C = {
  bg:'#080a0f', card:'#111318', border:'rgba(255,255,255,0.09)',
  input:'rgba(255,255,255,0.05)', text:'#fff', muted:'#9ca3af',
  faint:'#4b5563', accent:'#3b82f6', err:'#f87171', ok:'#34d399',
};

const iStyle = (err?: boolean, ok?: boolean): React.CSSProperties => ({
  width:'100%', background:C.input, color:C.text, fontSize:'15px', outline:'none',
  borderRadius:'10px', padding:'11px 14px', boxSizing:'border-box',
  border:`1px solid ${err ? C.err : ok ? C.ok : C.border}`, transition:'border-color .2s',
});

const lStyle: React.CSSProperties = {
  display:'block', fontSize:'11px', fontWeight:700,
  textTransform:'uppercase', letterSpacing:'0.06em', color:C.muted, marginBottom:'6px',
};

/* ────────── LOGIN ────────── */
function Login({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!val.email(email))    { setError('Email invalide.'); return; }
    if (!password)             { setError('Mot de passe requis.'); return; }
    setLoading(true);
    setTimeout(() => {
      const r = login(email, password);
      if (!r.ok) setError(r.error ?? 'Erreur.');
      setLoading(false);
    }, 400);
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md my-auto">
      <div style={{ textAlign:'center', marginBottom:'28px' }}>
        <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <Building2 style={{ width:'26px', height:'26px', color:'#fff' }} />
        </div>
        <h2 style={{ fontSize:'24px', fontWeight:800, color:C.text, marginBottom:'6px' }}>Connexion</h2>
        <p style={{ color:C.muted, fontSize:'13px' }}>Accédez à votre espace PropertyFlow</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        {/* Email */}
        <div>
          <label style={lStyle}>Adresse email</label>
          <div style={{ position:'relative' }}>
            <Mail style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', width:'16px', height:'16px', color:C.faint }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              style={{ ...iStyle(!val.email(email) && email.length>0, val.email(email) && email.length>0), paddingLeft:'38px' }} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={lStyle}>Mot de passe</label>
          <div style={{ position:'relative' }}>
            <Lock style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', width:'16px', height:'16px', color:C.faint }} />
            <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" style={{ ...iStyle(), paddingLeft:'38px', paddingRight:'42px' }} />
            <button type="button" onClick={() => setShow(v => !v)}
              aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.faint, padding:'6px', display:'flex' }}>
              {show ? <EyeOff style={{ width:'16px', height:'16px' }} /> : <Eye style={{ width:'16px', height:'16px' }} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:'10px', padding:'10px 14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <AlertCircle style={{ width:'16px', height:'16px', color:C.err, flexShrink:0 }} />
            <p style={{ color:C.err, fontSize:'13px' }}>{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{ width:'100%', padding:'13px', borderRadius:'12px', border:'none', cursor: loading ? 'not-allowed':'pointer',
            background: loading ? 'rgba(59,130,246,0.5)':'linear-gradient(135deg,#3b82f6,#6366f1)',
            color:'#fff', fontWeight:700, fontSize:'15px', marginTop:'4px' }}>
          {loading ? '⟳ Connexion...' : 'Se connecter'}
        </button>

        <p style={{ textAlign:'center', color:C.muted, fontSize:'14px', marginTop:'8px' }}>
          Pas encore de compte ?{' '}
          <button type="button" onClick={onSwitch} style={{ background:'none', border:'none', color:C.accent, fontWeight:700, cursor:'pointer', fontSize:'14px' }}>
            S'inscrire
          </button>
        </p>
      </div>
    </form>
  );
}

/* ────────── REGISTER ────────── */
function Register({ onSwitch }: { onSwitch: () => void }) {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterData>({
    firstName:'', lastName:'', email:'', password:'',
    phone:'', countryCode:'+228', address:'',
  });
  const [confirm, setConfirm] = useState('');
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string,boolean>>({});

  const set = (k: keyof RegisterData) => (v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setTouched(t => ({ ...t, [k]: true }));
  };
  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }));

  const strength = pwdStrength(form.password);
  const strColor = ['','#ef4444','#f59e0b','#10b981','#10b981'][strength];
  const strLabel = ['','Faible','Moyen','Bon','Fort'][strength];

  const submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!val.name(form.firstName))   { setError('Prénom invalide (min 2 car.).'); return; }
    if (!val.name(form.lastName))    { setError('Nom invalide (min 2 car.).'); return; }
    if (!val.email(form.email))      { setError('Email invalide.'); return; }
    if (!val.phone(form.phone))      { setError('Téléphone invalide (6-12 chiffres).'); return; }
    if (!val.address(form.address))  { setError('Adresse invalide (min 5 car.).'); return; }
    if (!val.password(form.password)){ setError('Mot de passe : min 8 car., 1 majuscule, 1 chiffre.'); return; }
    if (form.password !== confirm)   { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    setTimeout(() => {
      const r = register(form);
      if (!r.ok) setError(r.error ?? 'Erreur.');
      setLoading(false);
    }, 500);
  };

  const T = (k: string) => touched[k];
  const F = (k: keyof RegisterData) => form[k] as string;

  return (
    <form onSubmit={submit} className="w-full max-w-md my-auto py-4">
      <div style={{ textAlign:'center', marginBottom:'20px' }}>
        <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
          <Building2 style={{ width:'24px', height:'24px', color:'#fff' }} />
        </div>
        <h2 style={{ fontSize:'22px', fontWeight:800, color:C.text, marginBottom:'4px' }}>Créer un compte</h2>
        <p style={{ color:C.muted, fontSize:'13px' }}>Rejoignez PropertyFlow gratuitement</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {/* Nom + Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[['firstName','Prénom *','Kofi'],['lastName','Nom *','MENSAH']].map(([k, label, ph]) => (
            <div key={k}>
              <label style={lStyle}>{label}</label>
              <div style={{ position:'relative' }}>
                <User style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'15px', height:'15px', color:C.faint }} />
                <input type="text" value={F(k as keyof RegisterData)}
                  onChange={e => set(k as keyof RegisterData)(e.target.value)}
                  onBlur={() => touch(k)} placeholder={ph}
                  style={{ ...iStyle(T(k) && !val.name(F(k as keyof RegisterData)), T(k) && val.name(F(k as keyof RegisterData))), paddingLeft:'32px' }} />
              </div>
              {T(k) && !val.name(F(k as keyof RegisterData)) && <p style={{ color:C.err, fontSize:'10px', marginTop:'3px' }}>Min 2 caractères</p>}
            </div>
          ))}
        </div>

        {/* Email */}
        <div>
          <label style={lStyle}>Email *</label>
          <div style={{ position:'relative' }}>
            <Mail style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', width:'15px', height:'15px', color:C.faint }} />
            <input type="email" value={form.email} onChange={e => set('email')(e.target.value)} onBlur={() => touch('email')}
              placeholder="kofi@email.com"
              style={{ ...iStyle(T('email') && !val.email(form.email), T('email') && val.email(form.email)), paddingLeft:'38px' }} />
            {T('email') && val.email(form.email) && <CheckCircle style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', width:'15px', height:'15px', color:C.ok }} />}
          </div>
          {T('email') && !val.email(form.email) && <p style={{ color:C.err, fontSize:'10px', marginTop:'3px' }}>⚠ Format email invalide</p>}
        </div>

        {/* Téléphone + indicatif */}
        <div>
          <label style={lStyle}>Téléphone *</label>
          <div style={{ display:'flex', gap:'8px' }}>
            <select value={form.countryCode} onChange={e => setForm(f => ({ ...f, countryCode: e.target.value }))}
              style={{ background:C.input, border:`1px solid ${C.border}`, borderRadius:'10px', color:C.text, padding:'10px 6px', fontSize:'12px', outline:'none', flexShrink:0 }}>
              {WEST_AFRICA.map(c => (
                <option key={c.code} value={c.code} style={{ background:'#1a1d27' }}>
                  {c.flag} {c.code} {c.name}
                </option>
              ))}
            </select>
            <div style={{ position:'relative', flex:1 }}>
              <Phone style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'15px', height:'15px', color:C.faint }} />
              <input type="tel" value={form.phone}
                onChange={e => set('phone')(e.target.value)} onBlur={() => touch('phone')}
                placeholder="90000000"
                style={{ ...iStyle(T('phone') && !val.phone(form.phone), T('phone') && val.phone(form.phone)), paddingLeft:'32px', width:'100%' }} />
            </div>
          </div>
          {T('phone') && !val.phone(form.phone) && <p style={{ color:C.err, fontSize:'10px', marginTop:'3px' }}>⚠ 6 à 12 chiffres uniquement</p>}
        </div>

        {/* Adresse */}
        <div>
          <label style={lStyle}>Adresse *</label>
          <div style={{ position:'relative' }}>
            <MapPin style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', width:'15px', height:'15px', color:C.faint }} />
            <input type="text" value={form.address} onChange={e => set('address')(e.target.value)} onBlur={() => touch('address')}
              placeholder="Tokoin, Lomé, Togo"
              style={{ ...iStyle(T('address') && !val.address(form.address), T('address') && val.address(form.address)), paddingLeft:'38px' }} />
          </div>
          {T('address') && !val.address(form.address) && <p style={{ color:C.err, fontSize:'10px', marginTop:'3px' }}>⚠ Min 5 caractères</p>}
        </div>

        {/* Mot de passe */}
        <div>
          <label style={lStyle}>Mot de passe *</label>
          <div style={{ position:'relative' }}>
            <Lock style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', width:'15px', height:'15px', color:C.faint }} />
            <input type={show ? 'text' : 'password'} value={form.password}
              onChange={e => set('password')(e.target.value)} onBlur={() => touch('password')}
              placeholder="Min 8 car., 1 maj., 1 chiffre"
              style={{ ...iStyle(), paddingLeft:'38px', paddingRight:'42px' }} />
            <button type="button" onClick={() => setShow(v => !v)}
              style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.faint, padding:'6px', display:'flex' }}>
              {show ? <EyeOff style={{ width:'15px', height:'15px' }} /> : <Eye style={{ width:'15px', height:'15px' }} />}
            </button>
          </div>
          {form.password && (
            <div style={{ marginTop:'6px' }}>
              <div style={{ display:'flex', gap:'4px', marginBottom:'3px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex:1, height:'3px', borderRadius:'99px', background: strength >= i ? strColor : C.faint, transition:'background 0.3s' }} />
                ))}
              </div>
              <p style={{ fontSize:'10px', color:strColor }}>{strLabel}</p>
            </div>
          )}
        </div>

        {/* Confirmer */}
        <div>
          <label style={lStyle}>Confirmer le mot de passe *</label>
          <div style={{ position:'relative' }}>
            <Lock style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', width:'15px', height:'15px', color:C.faint }} />
            <input type={show ? 'text' : 'password'} value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              style={{ ...iStyle(confirm.length>0 && confirm!==form.password, confirm.length>0 && confirm===form.password), paddingLeft:'38px' }} />
          </div>
          {confirm.length > 0 && confirm !== form.password && <p style={{ color:C.err, fontSize:'10px', marginTop:'3px' }}>⚠ Les mots de passe ne correspondent pas</p>}
        </div>

        {error && (
          <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:'10px', padding:'10px 14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <AlertCircle style={{ width:'16px', height:'16px', color:C.err, flexShrink:0 }} />
            <p style={{ color:C.err, fontSize:'13px' }}>{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{ width:'100%', padding:'13px', borderRadius:'12px', border:'none', cursor: loading ? 'not-allowed':'pointer',
            background: loading ? 'rgba(59,130,246,0.5)':'linear-gradient(135deg,#3b82f6,#6366f1)',
            color:'#fff', fontWeight:700, fontSize:'15px', marginTop:'6px' }}>
          {loading ? '⟳ Création...' : 'Créer mon compte'}
        </button>

        <p style={{ textAlign:'center', color:C.muted, fontSize:'14px', marginTop:'6px' }}>
          Déjà un compte ?{' '}
          <button type="button" onClick={onSwitch} style={{ background:'none', border:'none', color:C.accent, fontWeight:700, cursor:'pointer', fontSize:'14px' }}>
            Se connecter
          </button>
        </p>
      </div>
    </form>
  );
}

/* ────────── PAGE AUTH ────────── */
export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'register'>('login');
  return (
    <div className="min-h-screen w-full bg-[#080a0f] flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden relative" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Déco */}
      <div style={{ position:'absolute', top:'-100px', left:'-100px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.07),transparent)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-80px', right:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.07),transparent)', pointerEvents:'none' }} />

      {/* Image gauche — desktop only */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-screen">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&auto=format&fit=crop"
          alt="property" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(8,10,15,0.88),rgba(15,23,42,0.55))' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'48px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Building2 style={{ width:'22px', height:'22px', color:'#fff' }} />
            </div>
            <span style={{ fontSize:'20px', fontWeight:800, color:'#fff' }}>PropertyFlow</span>
          </div>
          <h2 style={{ fontSize:'30px', fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:'14px' }}>
            Gérez vos biens<br />immobiliers avec{' '}
            <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              précision.
            </span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'14px', maxWidth:'340px', lineHeight:1.6 }}>
            Plateforme dédiée aux propriétaires et locataires d'Afrique de l'Ouest.
          </p>
          <div style={{ display:'flex', gap:'28px', marginTop:'28px' }}>
            {[{v:'500+',l:'Propriétés'},{v:'1 200+',l:'Utilisateurs'},{v:'16 pays',l:'Afrique de l\'Ouest'}].map(({v,l}) => (
              <div key={l}><p style={{ fontSize:'18px', fontWeight:900, color:'#fff' }}>{v}</p><p style={{ fontSize:'11px', color:'rgba(255,255,255,0.45)' }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire droite */}
      <div className="w-full lg:max-w-[520px] flex-1 flex items-center justify-center p-6 sm:p-10 min-h-screen overflow-y-auto z-10">
        {mode === 'login'
          ? <Login    onSwitch={() => setMode('register')} />
          : <Register onSwitch={() => setMode('login')} />
        }
      </div>
    </div>
  );
}