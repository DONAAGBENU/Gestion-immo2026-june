import { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Euro, Building2, Users, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockPayments, mockProperties, dashboardStats } from '../data/mockData';

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
    bar:  dk ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
  };
}

const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* Données fictives mensuelles pour les graphiques */
const revenueData = [2800,3200,2950,3600,3100,4200,3800,4500,4100,3900,4800,dashboardStats.monthlyRevenue];
const occupancyData = [72,74,78,80,82,79,85,87,83,88,90,Math.round((dashboardStats.occupiedProperties/dashboardStats.totalProperties)*100)];
const maintenanceData = [3,5,4,6,3,7,5,4,8,6,5,dashboardStats.maintenanceRequests];

function BarChart({ data, color, height = 120 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'4px', height:`${height}px` }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', height:'100%', justifyContent:'flex-end' }}>
          <div style={{ width:'100%', borderRadius:'4px 4px 0 0', transition:'height .5s', background: i === data.length-1 ? color : `${color}55`, height:`${Math.max((v/max)*100,4)}%` }} />
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color }: { data: number[]; color: string }) {
  const w = 100, h = 60;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', height:'60px' }} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={pts} />
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={`${color}22`} />
    </svg>
  );
}

function StatCard({ title, value, sub, icon:Icon, gradient, trend }: any) {
  const s = useS();
  return (
    <div style={{ background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', padding:'20px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:s.muted, marginBottom:'8px' }}>{title}</p>
          <p style={{ fontSize:'26px', fontWeight:800, color:s.txt, marginBottom:'4px' }}>{value}</p>
          <p style={{ fontSize:'12px', color:s.muted }}>{sub}</p>
          {trend && (
            <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'6px' }}>
              {trend.up ? <TrendingUp style={{ width:'13px', height:'13px', color:'#34d399' }} /> : <TrendingDown style={{ width:'13px', height:'13px', color:'#f87171' }} />}
              <span style={{ fontSize:'12px', fontWeight:600, color: trend.up ? '#34d399':'#f87171' }}>{trend.up?'+':'-'}{trend.v}% vs mois dernier</span>
            </div>
          )}
        </div>
        <div style={{ padding:'10px', borderRadius:'12px', background:gradient, flexShrink:0 }}>
          <Icon style={{ width:'20px', height:'20px', color:'#fff' }} />
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { lang } = useApp();
  const s = useS();
  const [period, setPeriod] = useState<'3'|'6'|'12'>('12');

  const months = lang === 'en' ? MONTHS_EN : MONTHS;
  const sliced = parseInt(period);
  const revSlice  = revenueData.slice(-sliced);
  const occSlice  = occupancyData.slice(-sliced);
  const maintSlice= maintenanceData.slice(-sliced);
  const mLabels   = months.slice(-sliced);

  const totalRevenue = revSlice.reduce((a,b)=>a+b,0);
  const avgOccupancy = Math.round(occSlice.reduce((a,b)=>a+b,0)/occSlice.length);
  const paidCount    = mockPayments.filter(p=>p.status==='paid').length;
  const overdueCount = mockPayments.filter(p=>p.status==='overdue').length;

  const btn = (v: '3'|'6'|'12', label: string) => (
    <button onClick={()=>setPeriod(v)} style={{
      padding:'6px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer', border:'none',
      background: period===v ? '#3b82f6' : (s.dk ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
      color: period===v ? '#fff' : s.muted
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight:'100%', background:s.bg, padding:'24px' }}>
      {/* Header */}
      <div style={{ display:'flex', flexDirection:'column', gap:'4px', marginBottom:'24px' }}>
        <h2 style={{ fontSize:'22px', fontWeight:800, color:s.txt }}>{lang==='en'?'Analytics':'Analyses & Rapports'}</h2>
        <p style={{ fontSize:'13px', color:s.muted }}>{lang==='en'?'Performance overview of your portfolio':'Vue d\'ensemble de la performance de votre portefeuille'}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'12px', marginBottom:'24px' }}>
        <StatCard title={lang==='en'?'Total Revenue':'Revenus totaux'} value={`${totalRevenue.toLocaleString()}€`} sub={`Sur ${sliced} mois`} icon={Euro} gradient="linear-gradient(135deg,#8b5cf6,#7c3aed)" trend={{up:true,v:15}} />
        <StatCard title={lang==='en'?'Avg Occupancy':'Taux moyen'} value={`${avgOccupancy}%`} sub={lang==='en'?'Occupied properties':'Propriétés occupées'} icon={Building2} gradient="linear-gradient(135deg,#3b82f6,#6366f1)" trend={{up:true,v:8}} />
        <StatCard title={lang==='en'?'Paid Rents':'Loyers payés'} value={paidCount} sub={`${overdueCount} ${lang==='en'?'overdue':'en retard'}`} icon={Users} gradient="linear-gradient(135deg,#10b981,#059669)" trend={{up:true,v:5}} />
        <StatCard title={lang==='en'?'Maintenance':'Maintenance'} value={dashboardStats.maintenanceRequests} sub={lang==='en'?'Active requests':'Demandes actives'} icon={AlertTriangle} gradient="linear-gradient(135deg,#f59e0b,#d97706)" trend={{up:false,v:3}} />
      </div>

      {/* Filtre période */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'10px' }}>
        <p style={{ fontSize:'13px', fontWeight:600, color:s.txt }}>{lang==='en'?'Charts — period:':'Graphiques — période :'}</p>
        <div style={{ display:'flex', gap:'6px' }}>
          {btn('3','3 mois')}{btn('6','6 mois')}{btn('12','12 mois')}
        </div>
      </div>

      {/* Graphiques */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px', marginBottom:'24px' }}>

        {/* Revenus */}
        <div style={{ background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
            <div>
              <p style={{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:s.muted, marginBottom:'4px' }}>{lang==='en'?'Monthly Revenue':'Revenus mensuels'}</p>
              <p style={{ fontSize:'20px', fontWeight:800, color:s.txt }}>{totalRevenue.toLocaleString()}€</p>
            </div>
            <span style={{ fontSize:'11px', padding:'3px 8px', borderRadius:'6px', background:'rgba(52,211,153,0.15)', color:'#34d399', fontWeight:600 }}>+15%</span>
          </div>
          <BarChart data={revSlice} color="#8b5cf6" height={100} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
            {mLabels.filter((_,i)=>i%Math.ceil(mLabels.length/4)===0).map(m=>(
              <span key={m} style={{ fontSize:'10px', color:s.faint }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Taux occupation */}
        <div style={{ background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
            <div>
              <p style={{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:s.muted, marginBottom:'4px' }}>{lang==='en'?'Occupancy rate':'Taux d\'occupation'}</p>
              <p style={{ fontSize:'20px', fontWeight:800, color:s.txt }}>{avgOccupancy}%</p>
            </div>
            <span style={{ fontSize:'11px', padding:'3px 8px', borderRadius:'6px', background:'rgba(59,130,246,0.15)', color:'#60a5fa', fontWeight:600 }}>+8%</span>
          </div>
          <LineChart data={occSlice} color="#3b82f6" />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
            {mLabels.filter((_,i)=>i%Math.ceil(mLabels.length/4)===0).map(m=>(
              <span key={m} style={{ fontSize:'10px', color:s.faint }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div style={{ background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
            <div>
              <p style={{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:s.muted, marginBottom:'4px' }}>{lang==='en'?'Maintenance requests':'Demandes maintenance'}</p>
              <p style={{ fontSize:'20px', fontWeight:800, color:s.txt }}>{maintSlice[maintSlice.length-1]}</p>
            </div>
          </div>
          <BarChart data={maintSlice} color="#f59e0b" height={100} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
            {mLabels.filter((_,i)=>i%Math.ceil(mLabels.length/4)===0).map(m=>(
              <span key={m} style={{ fontSize:'10px', color:s.faint }}>{m}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Statut paiements */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px' }}>

        <div style={{ background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', padding:'20px' }}>
          <p style={{ fontSize:'13px', fontWeight:700, color:s.txt, marginBottom:'16px' }}>{lang==='en'?'Payment status':'Statut des paiements'}</p>
          {[
            { label: lang==='en'?'Paid':'Payés', count: mockPayments.filter(p=>p.status==='paid').length, color:'#34d399', pct: Math.round(mockPayments.filter(p=>p.status==='paid').length/mockPayments.length*100) },
            { label: lang==='en'?'Pending':'En attente', count: mockPayments.filter(p=>p.status==='pending').length, color:'#fbbf24', pct: Math.round(mockPayments.filter(p=>p.status==='pending').length/mockPayments.length*100) },
            { label: lang==='en'?'Overdue':'En retard', count: mockPayments.filter(p=>p.status==='overdue').length, color:'#f87171', pct: Math.round(mockPayments.filter(p=>p.status==='overdue').length/mockPayments.length*100) },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                <span style={{ fontSize:'12px', color:s.muted }}>{row.label}</span>
                <span style={{ fontSize:'12px', fontWeight:700, color:s.txt }}>{row.count} ({row.pct}%)</span>
              </div>
              <div style={{ height:'6px', borderRadius:'99px', background:s.bar, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:'99px', width:`${row.pct}%`, background:row.color, transition:'width .6s' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'16px', padding:'20px' }}>
          <p style={{ fontSize:'13px', fontWeight:700, color:s.txt, marginBottom:'16px' }}>{lang==='en'?'Properties by status':'Propriétés par statut'}</p>
          {[
            { label: lang==='en'?'Occupied':'Occupées',     count: mockProperties.filter(p=>p.status==='occupied').length,    color:'#34d399' },
            { label: lang==='en'?'Vacant':'Vacantes',       count: mockProperties.filter(p=>p.status==='vacant').length,      color:'#fbbf24' },
            { label: lang==='en'?'Maintenance':'Maintenance',count: mockProperties.filter(p=>p.status==='maintenance').length, color:'#f87171' },
          ].map(row => {
            const pct = Math.round(row.count/mockProperties.length*100);
            return (
              <div key={row.label} style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontSize:'12px', color:s.muted }}>{row.label}</span>
                  <span style={{ fontSize:'12px', fontWeight:700, color:s.txt }}>{row.count} ({pct}%)</span>
                </div>
                <div style={{ height:'6px', borderRadius:'99px', background:s.bar, overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:'99px', width:`${pct}%`, background:row.color, transition:'width .6s' }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Export */}
      <div style={{ marginTop:'20px', display:'flex', justifyContent:'flex-end' }}>
        <button onClick={()=>window.print()} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', borderRadius:'12px', background:'linear-gradient(135deg,#3b82f6,#6366f1)', color:'#fff', border:'none', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
          <Download style={{ width:'15px', height:'15px' }} />
          {lang==='en'?'Export PDF':'Exporter en PDF'}
        </button>
      </div>
    </div>
  );
}