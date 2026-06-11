import { useState, useRef, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockTenants } from '../data/mockData';

function useS() {
  const { theme } = useApp();
  const dk = theme === 'dark';
  return {
    dk, bg:dk?'transparent':'#f1f5f9',
    card:dk?'rgba(255,255,255,0.04)':'#ffffff',
    bdr: dk?'rgba(255,255,255,0.08)':'#e2e8f0',
    txt: dk?'#ffffff':'#0f172a',
    muted:dk?'#9ca3af':'#64748b',
    faint:dk?'#4b5563':'#94a3b8',
    inp: dk?'rgba(255,255,255,0.05)':'#f8fafc',
    inBdr:dk?'rgba(255,255,255,0.1)':'#cbd5e1',
    div: dk?'rgba(255,255,255,0.07)':'#e2e8f0',
    bubble:dk?'rgba(255,255,255,0.07)':'#f1f5f9',
  };
}

interface Msg { id:string; from:'admin'|'client'; text:string; time:string; }
interface Conv { id:string; tenantId:string; messages:Msg[]; }

const INIT_CONVS: Conv[] = mockTenants.slice(0,4).map((t,i)=>({
  id:`conv${i}`, tenantId:t.id,
  messages:[
    { id:`m1${i}`, from:'client', text:`Bonjour, j'ai une question concernant mon loyer.`,      time:'10:22' },
    { id:`m2${i}`, from:'admin',  text:`Bonjour ! Bien sûr, je vous écoute. Comment puis-je vous aider ?`, time:'10:25' },
    { id:`m3${i}`, from:'client', text:`Est-il possible de payer en deux fois ce mois-ci ?`,    time:'10:28' },
  ]
}));

function Avatar({ name, size=36 }: { name:string; size?:number }) {
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return (
    <div style={{ width:`${size}px`, height:`${size}px`, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <span style={{ fontSize:`${Math.round(size*0.35)}px`, fontWeight:700, color:'#fff' }}>{initials}</span>
    </div>
  );
}

export default function Messages() {
  const { lang } = useApp();
  const { user } = useAuth();
  const s = useS();
  const isAdmin = user?.role === 'admin';
  const [convs,   setConvs]   = useState<Conv[]>(INIT_CONVS);
  const [activeId, setActiveId] = useState(INIT_CONVS[0].id);
  const [text,    setText]    = useState('');
  const [search,  setSearch]  = useState('');
  const msgRef = useRef<HTMLDivElement>(null);

  const activeConv = convs.find(c=>c.id===activeId)!;
  const tenant = mockTenants.find(t=>t.id===activeConv.tenantId);

  useEffect(() => { msgRef.current?.scrollTo(0, msgRef.current.scrollHeight); }, [activeId, convs]);

  const send = () => {
    if (!text.trim()) return;
    const msg: Msg = { id:`m${Date.now()}`, from: isAdmin?'admin':'client', text:text.trim(), time:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) };
    setConvs(prev=>prev.map(c=>c.id===activeId?{...c,messages:[...c.messages,msg]}:c));
    setText('');
  };

  const filteredConvs = convs.filter(c=>{
    const t = mockTenants.find(x=>x.id===c.tenantId);
    return !search || (t && `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div style={{ height:'calc(100vh - 60px)', display:'flex', background:s.bg, padding:'24px', gap:'16px', boxSizing:'border-box' }}>

      {/* Liste conversations */}
      <div style={{ width:'260px', flexShrink:0, background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'14px', borderBottom:`1px solid ${s.div}` }}>
          <p style={{ fontSize:'14px', fontWeight:700, color:s.txt, marginBottom:'10px' }}>{lang==='en'?'Messages':'Messages'}</p>
          <div style={{ position:'relative' }}>
            <Search style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'13px', height:'13px', color:s.faint }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==='en'?'Search...':'Rechercher...'} style={{ background:s.inp, border:`1px solid ${s.inBdr}`, borderRadius:'8px', padding:'7px 10px 7px 28px', color:s.txt, fontSize:'12px', outline:'none', width:'100%', boxSizing:'border-box' }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {filteredConvs.map(c=>{
            const t = mockTenants.find(x=>x.id===c.tenantId);
            const last = c.messages[c.messages.length-1];
            const active = c.id===activeId;
            return (
              <div key={c.id} onClick={()=>setActiveId(c.id)}
                style={{ display:'flex', gap:'10px', padding:'12px 14px', cursor:'pointer', borderBottom:`1px solid ${s.div}`, background: active?(s.dk?'rgba(59,130,246,0.12)':'#eff6ff'):'transparent', borderRight: active?'2px solid #3b82f6':'2px solid transparent', transition:'background .15s' }}>
                <Avatar name={`${t?.firstName} ${t?.lastName}`} size={36} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'13px', fontWeight:active?700:500, color:s.txt, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t?.firstName} {t?.lastName}</p>
                  <p style={{ fontSize:'11px', color:s.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:'2px' }}>{last?.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone chat */}
      <div style={{ flex:1, background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Header chat */}
        <div style={{ padding:'14px 16px', borderBottom:`1px solid ${s.div}`, display:'flex', alignItems:'center', gap:'10px' }}>
          <Avatar name={`${tenant?.firstName} ${tenant?.lastName}`} size={38} />
          <div>
            <p style={{ fontSize:'14px', fontWeight:700, color:s.txt }}>{tenant?.firstName} {tenant?.lastName}</p>
            <p style={{ fontSize:'11px', color:'#34d399' }}>● {lang==='en'?'Online':'En ligne'}</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={msgRef} style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'10px', scrollbarWidth:'thin' }}>
          {activeConv.messages.map(m=>{
            const mine = isAdmin ? m.from==='admin' : m.from==='client';
            return (
              <div key={m.id} style={{ display:'flex', flexDirection: mine?'row-reverse':'row', gap:'8px', alignItems:'flex-end' }}>
                {!mine && <Avatar name={mine?'Admin':`${tenant?.firstName}`} size={28} />}
                <div style={{ maxWidth:'68%' }}>
                  <div style={{ padding:'10px 14px', borderRadius: mine?'16px 16px 4px 16px':'16px 16px 16px 4px',
                    background: mine?'linear-gradient(135deg,#3b82f6,#6366f1)':s.bubble, color: mine?'#fff':s.txt, fontSize:'13px', lineHeight:1.5 }}>
                    {m.text}
                  </div>
                  <p style={{ fontSize:'10px', color:s.faint, marginTop:'3px', textAlign: mine?'right':'left' }}>{m.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ padding:'12px 16px', borderTop:`1px solid ${s.div}`, display:'flex', gap:'10px', alignItems:'center' }}>
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()}
            placeholder={lang==='en'?'Type a message...':'Écrire un message...'}
            style={{ flex:1, background:s.inp, border:`1px solid ${s.inBdr}`, borderRadius:'12px', padding:'10px 14px', color:s.txt, fontSize:'13px', outline:'none' }} />
          <button onClick={send} disabled={!text.trim()}
            style={{ width:'40px', height:'40px', borderRadius:'12px', background: text.trim()?'linear-gradient(135deg,#3b82f6,#6366f1)':'rgba(255,255,255,0.08)', border:'none', cursor: text.trim()?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Send style={{ width:'16px', height:'16px', color: text.trim()?'#fff':s.muted }} />
          </button>
        </div>
      </div>
    </div>
  );
}