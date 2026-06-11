import { useEffect, useState } from 'react';
import { Building2, ChevronRight, ChevronLeft, MapPin, Award } from 'lucide-react';

const properties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85&auto=format&fit=crop',
    title: 'Villa Méditerranéenne',
    location: 'Côte d\'Azur, France',
    type: 'Villa de luxe',
    price: '2 755 000 FCFA / mois',
    rating: 4.9,
    desc: 'Somptueuse villa avec piscine à débordement, vue panoramique sur la mer et jardins paysagés.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85&auto=format&fit=crop',
    title: 'Maison Contemporaine',
    location: 'Bordeaux, France',
    type: 'Maison moderne',
    price: '1 836 000 FCFA / mois',
    rating: 4.8,
    desc: 'Architecture épurée, grandes baies vitrées, matériaux nobles et jardin privé au calme.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85&auto=format&fit=crop',
    title: 'Villa Prestige',
    location: 'Saint-Tropez, France',
    type: 'Villa premium',
    price: '4 264 000 FCFA / mois',
    rating: 5.0,
    desc: 'Propriété d\'exception nichée dans un parc arboré, piscine chauffée et accès plage privée.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=85&auto=format&fit=crop',
    title: 'Appartement Haussmannien',
    location: 'Paris 8ème, France',
    type: 'Appartement de prestige',
    price: '3 345 000 FCFA / mois',
    rating: 4.9,
    desc: 'Grand appartement de standing au cœur de Paris, parquet point de Hongrie, moulures et vue dégagée.'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=85&auto=format&fit=crop',
    title: 'Chalet Montagnard',
    location: 'Megève, Alpes',
    type: 'Chalet de montagne',
    price: '2 558 000 FCFA / mois',
    rating: 4.7,
    desc: 'Chalet authentique avec spa privatif, cheminée centrale et vue imprenable sur les sommets enneigés.'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=85&auto=format&fit=crop',
    title: 'Penthouse Vue Panoramique',
    location: 'Lyon, France',
    type: 'Penthouse',
    price: '2 361 000 FCFA / mois',
    rating: 4.8,
    desc: 'Penthouse d\'exception au dernier étage, terrasse XXL, cuisine ouverte haut de gamme et domotique intégrée.'
  },
];

const SLIDE_DURATION = 9000; // ms

interface WelcomeProps {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: WelcomeProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % properties.length, 'right');
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (index: number, dir: 'left' | 'right') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  const prev = () => goTo((current - 1 + properties.length) % properties.length, 'left');
  const next = () => goTo((current + 1) % properties.length, 'right');

  const prop = properties[current];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: '#080a0f',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease'
      }}
    >
      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between px-8 py-5 flex-shrink-0" style={{ zIndex: 10, position: 'relative' }}>
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">PropertyFlow</span>
        </div>
        <button
          onClick={onEnter}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#d1d5db',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
        >
          Se connecter <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </nav>

      {/* ── HERO SLIDER (plein écran) ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Image de fond animée */}
        <div
          key={current}
          className="absolute inset-0"
          style={{
            animation: animating
              ? `slide-${direction} 0.4s ease forwards`
              : 'none',
          }}
        >
          <img
            src={prop.image}
            alt={prop.title}
            className="w-full h-full object-cover"
            style={{ transition: 'opacity 0.4s' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,10,15,1) 0%, rgba(8,10,15,0.55) 45%, rgba(8,10,15,0.1) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,10,15,0.5) 0%, transparent 60%)' }} />
        </div>

        {/* Contenu centré à gauche */}
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 lg:px-24" style={{ zIndex: 2, maxWidth: '680px' }}>

          {/* Badge type */}
          <div className="flex items-center space-x-3 mb-5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.4)' }}>
              {prop.type}
            </span>
            <div className="flex items-center space-x-1">
              <Award className="h-3.5 w-3.5" style={{ color: '#fbbf24' }} />
              <span className="text-xs font-bold text-white">{prop.rating}</span>
            </div>
          </div>

          {/* Titre */}
          <h1
            className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(12px)' : 'translateY(0)',
              transition: 'all 0.4s ease'
            }}
          >
            {prop.title}
          </h1>

          {/* Localisation */}
          <div className="flex items-center mb-4" style={{ color: '#93c5fd' }}>
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{prop.location}</span>
          </div>

          {/* Description */}
          <p
            className="text-base md:text-lg mb-6 leading-relaxed"
            style={{
              color: '#9ca3af',
              opacity: animating ? 0 : 1,
              transition: 'opacity 0.5s ease 0.1s',
              maxWidth: '520px'
            }}
          >
            {prop.desc}
          </p>

          {/* Prix */}
          <div className="flex items-center space-x-6 mb-8">
            <div>
              <p className="text-xs mb-0.5" style={{ color: '#6b7280' }}>À partir de</p>
              <p className="text-3xl font-black text-white">{prop.price}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onEnter}
              className="flex items-center px-8 py-4 rounded-2xl font-bold text-base"
              style={{
                background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(59,130,246,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(59,130,246,0.35)'; }}
            >
              Accéder au tableau de bord
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
            <button
              className="px-6 py-4 rounded-2xl font-semibold text-sm"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Voir les biens
            </button>
          </div>
        </div>

        {/* ── FLÈCHES navigation ── */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 p-3 rounded-full z-10"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-full z-10"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* ── THUMBNAILS en bas à droite ── */}
        <div
          className="absolute bottom-8 right-8 flex space-x-3 z-10"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {properties.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i, i > current ? 'right' : 'left')}
              className="relative rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300"
              style={{
                width: i === current ? '80px' : '56px',
                height: '52px',
                border: i === current ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.1)',
                opacity: i === current ? 1 : 0.55,
                transform: i === current ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              {i === current && (
                <div className="absolute bottom-0 left-0 h-1 rounded-b-xl" style={{ background: '#3b82f6', animation: `progress ${SLIDE_DURATION}ms linear infinite` }} />
              )}
            </button>
          ))}
        </div>

        {/* ── DOTS indicateurs ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 'right' : 'left')}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '6px',
                height: '6px',
                background: i === current ? '#3b82f6' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>

        {/* ── STATS en bas à gauche ── */}
        <div className="absolute bottom-8 left-10 flex space-x-6 z-10">
          {[
            { value: '500+', label: 'Propriétés' },
            { value: '98%', label: 'Satisfaction' },
            { value: '12 ans', label: "d'expérience" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-black text-white">{value}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>{label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* ── Keyframes inline ── */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
