import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockProperties } from '../data/mockData';

function useS() {
  const { theme } = useApp();
  const dk = theme === 'dark';
  return {
    dk, bg:dk?'transparent':'#f1f5f9',
    card:dk?'rgba(255,255,255,0.04)':'#ffffff',
    bdr: dk?'rgba(255,255,255,0.08)':'#e2e8f0',
    txt: dk?'#ffffff':'#0f172a',
    muted:dk?'#9ca3af':'#64748b',
  };
}

/* Coordonnées fictives pour les propriétés de démonstration */
const COORDS: Record<string,[number,number]> = {
  '1': [6.1375, 1.2123],
  '2': [6.1422, 1.2201],
  '3': [6.1308, 1.2055],
  '4': [6.1480, 1.2310],
};

export default function MapPage() {
  const { lang } = useApp();
  const s = useS();
  const mapRef  = useRef<HTMLDivElement>(null);
  const [ready, setReady]   = useState(false);
  const [sel,   setSel]     = useState<string|null>(null);
  const [error, setError]   = useState(false);

  

  useEffect(() => {
    /* Charge Leaflet depuis CDN */
    if ((window as any).L) { setReady(true); return; }
    const link = document.createElement('link');
    link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setReady(true);
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const L = (window as any).L;
    if (mapRef.current.dataset.initialized) return;
    mapRef.current.dataset.initialized='1';

    const map = L.map(mapRef.current).setView([6.14, 1.22], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:'© OpenStreetMap'
    }).addTo(map);

    mockProperties.forEach(p => {
      const coords = COORDS[p.id] || [6.14+Math.random()*0.02-0.01, 1.22+Math.random()*0.02-0.01];
      const color  = p.status==='occupied'?'#34d399': p.status==='vacant'?'#fbbf24':'#f87171';
      const icon = L.divIcon({
        html:`<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);font-size:14px">🏠</div></div>`,
        className:'', iconSize:[32,32], iconAnchor:[16,32],
      });
      const marker = L.marker(coords,{icon}).addTo(map);
      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:180px;">
          <p style="font-weight:700;font-size:14px;margin:0 0 4px">${p.name}</p>
          <p style="color:#64748b;font-size:12px;margin:0 0 6px">${p.address}</p>
          <p style="font-weight:700;color:#3b82f6;font-size:16px;margin:0">${p.rent}€<span style="font-size:11px;font-weight:400;color:#94a3b8">/mois</span></p>
          <span style="display:inline-block;margin-top:6px;font-size:11px;padding:2px 8px;border-radius:99px;font-weight:600;
            background:${p.status==='occupied'?'rgba(52,211,153,0.2)':p.status==='vacant'?'rgba(251,191,36,0.2)':'rgba(248,113,113,0.2)'};
            color:${color}">
            ${p.status==='occupied'?'Occupé':p.status==='vacant'?'Disponible':'Maintenance'}
          </span>
        </div>
      `);
      marker.on('click', () => setSel(p.id));
    });
  }, [ready]);

  return (
    <div style={{ minHeight:'100%', background:s.bg, padding:'24px' }}>
      <div style={{ marginBottom:'20px' }}>
        <h2 style={{ fontSize:'22px', fontWeight:800, color:s.txt }}>{lang==='en'?'Property Map':'Carte des Propriétés'}</h2>
        <p style={{ fontSize:'13px', color:s.muted, marginTop:'2px' }}>{lang==='en'?'View all your properties on the map':'Visualisez tous vos biens sur la carte'}</p>
      </div>

      {/* Légende */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' }}>
        {[{label:lang==='en'?'Occupied':'Occupé',color:'#34d399'},{label:lang==='en'?'Vacant':'Disponible',color:'#fbbf24'},{label:'Maintenance',color:'#f87171'}].map(({label,color})=>(
          <div key={label} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:color }} />
            <span style={{ fontSize:'12px', color:s.muted }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
        {/* Carte */}
        <div style={{ flex:'1 1 320px', height:'460px', borderRadius:'16px', overflow:'hidden', border:`1px solid ${s.bdr}`, position:'relative' }}>
          {error && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:s.card, gap:'8px' }}>
              <MapPin style={{ width:'32px', height:'32px', color:s.muted, opacity:.5 }} />
              <p style={{ color:s.muted, fontSize:'13px' }}>Carte indisponible (CDN bloqué)</p>
              <p style={{ color:s.muted, fontSize:'11px' }}>Leaflet.js doit être accessible</p>
            </div>
          )}
          {!ready && !error && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:s.card }}>
              <p style={{ color:s.muted, fontSize:'13px' }}>Chargement de la carte…</p>
            </div>
          )}
          <div ref={mapRef} style={{ width:'100%', height:'100%' }} />
        </div>

        {/* Liste propriétés */}
        <div style={{ width:'240px', flexShrink:0, display:'flex', flexDirection:'column', gap:'8px' }}>
          {mockProperties.map(p=>{
            const isSel = p.id===sel;
            const color = p.status==='occupied'?'#34d399':p.status==='vacant'?'#fbbf24':'#f87171';
            return (
              <div key={p.id} onClick={()=>setSel(isSel?null:p.id)}
                style={{ background:s.card, border:`1px solid ${isSel?'#3b82f6':s.bdr}`, borderRadius:'14px', padding:'12px', cursor:'pointer', transition:'all .15s',
                  boxShadow: isSel?'0 0 0 2px rgba(59,130,246,0.3)':'none' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'10px', overflow:'hidden', flexShrink:0 }}>
                    <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:s.txt, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize:'11px', fontWeight:700, color:'#60a5fa', marginTop:'2px' }}>{p.rent}€<span style={{ fontWeight:400, color:s.muted }}>/mois</span></p>
                  </div>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:color, flexShrink:0, marginTop:'4px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Infos GPS */}
      <div style={{ marginTop:'16px', background:s.card, border:`1px solid ${s.bdr}`, borderRadius:'14px', padding:'14px 16px' }}>
        <p style={{ fontSize:'12px', color:s.muted }}>
          💡 {lang==='en'
            ? 'GPS coordinates are taken from the GPS field when adding a property. The map uses OpenStreetMap (free & open source).'
            : 'Les coordonnées GPS proviennent du champ GPS lors de l\'ajout d\'une propriété. La carte utilise OpenStreetMap (gratuit & open source).'}
        </p>
      </div>
    </div>
  );
}