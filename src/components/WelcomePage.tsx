import { useEffect, useState } from 'react';
import { Building2, ChevronRight, ChevronLeft, MapPin, Award } from 'lucide-react';

const properties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85&auto=format&fit=crop',
    title: 'Villa Méditerranéenne Tokoin',
    location: 'Tokoin, Lomé, Togo',
    type: 'Villa de luxe',
    price: '280 000 FCFA / mois',
    rating: 4.9,
    desc: 'Somptueuse villa avec piscine à débordement, jardin paysagé et sécurité 24h/24.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85&auto=format&fit=crop',
    title: 'Appartement Bè Plage',
    location: 'Bè, Lomé, Togo',
    type: 'Appartement moderne',
    price: '150 000 FCFA / mois',
    rating: 4.8,
    desc: 'Architecture épurée, grandes baies vitrées avec vue mer et parking sécurisé.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85&auto=format&fit=crop',
    title: 'Studio Agbalépédogan',
    location: 'Agbalépédogan, Lomé, Togo',
    type: 'Studio équipé',
    price: '75 000 FCFA / mois',
    rating: 5.0,
    desc: 'Studio meublé avec soin, idéal pour étudiant ou cadre en mission. Fibre optique incluse.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=85&auto=format&fit=crop',
    title: 'Local Commercial Adidogomé',
    location: 'Adidogomé, Lomé, Togo',
    type: 'Espace commercial',
    price: '200 000 FCFA / mois',
    rating: 4.9,
    desc: 'Superbe local en angle de rue, fort passage piéton et véhiculaire.'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=85&auto=format&fit=crop',
    title: 'Maison Agoè Zongo',
    location: 'Agoè Zongo, Lomé, Togo',
    type: 'Maison familiale',
    price: '120 000 FCFA / mois',
    rating: 4.7,
    desc: 'Grande cour verdoyante, quartier très calme et à proximité de toutes commodités.'
  },
];

const SLIDE_DURATION = 9000;

interface WelcomeProps {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: WelcomeProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % properties.length, 'right');
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [current, animating]);

  const goTo = (index: number, dir: 'left' | 'right') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 350);
  };

  const prev = () => goTo((current - 1 + properties.length) % properties.length, 'left');
  const next = () => goTo((current + 1) % properties.length, 'right');

  const prop = properties[current];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto overflow-x-hidden min-h-screen"
      style={{
        background: '#080a0f',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 flex-shrink-0 w-full relative z-20"
        style={{ background: 'rgba(8,10,15,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-white tracking-tight">PropertyFlow</span>
        </div>
        <button
          onClick={onEnter}
          className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span>Accéder</span> <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      {/* ── HERO SLIDER (Conteneur principal responsive) ── */}
      <div className="flex-1 relative flex flex-col justify-between min-h-[500px] sm:min-h-[600px] w-full">

        {/* Image de fond avec transition */}
        <div
          key={current}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            animation: animating ? `slide-${direction} 0.35s ease forwards` : 'none',
          }}
        >
          <img
            src={prop.image}
            alt={prop.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,10,15,1) 0%, rgba(8,10,15,0.7) 50%, rgba(8,10,15,0.35) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,10,15,0.8) 0%, transparent 80%)' }} />
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-10 md:px-16 lg:px-24 py-8 sm:py-12 max-w-3xl">

          {/* Badge & Rating */}
          <div className="flex items-center space-x-3 mb-3 sm:mb-5 flex-wrap gap-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.4)' }}>
              {prop.type}
            </span>
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Award className="h-3.5 w-3.5" style={{ color: '#fbbf24' }} />
              <span className="text-xs font-bold text-white">{prop.rating}</span>
            </div>
          </div>

          {/* Titre responsive */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-4 leading-tight"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(10px)' : 'translateY(0)',
              transition: 'all 0.35s ease'
            }}
          >
            {prop.title}
          </h1>

          {/* Localisation */}
          <div className="flex items-center mb-3 sm:mb-4" style={{ color: '#93c5fd' }}>
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{prop.location}</span>
          </div>

          {/* Description */}
          <p
            className="text-xs sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-none"
            style={{
              color: '#d1d5db',
              opacity: animating ? 0 : 1,
              transition: 'opacity 0.4s ease 0.1s',
              maxWidth: '540px'
            }}
          >
            {prop.desc}
          </p>

          {/* Prix */}
          <div className="mb-6">
            <p className="text-xs mb-0.5" style={{ color: '#9ca3af' }}>Loyer mensuel</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black" style={{ color: '#60a5fa' }}>{prop.price}</p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onEnter}
              className="flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Accéder au tableau de bord
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* ── FLÈCHES NATIVE SLIDE ── */}
        <button
          onClick={prev}
          aria-label="Précédent"
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full z-20"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(6px)', cursor: 'pointer' }}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={next}
          aria-label="Suivant"
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full z-20"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(6px)', cursor: 'pointer' }}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* ── BARRE INFÉRIEURE : Stats + Thumbnails + Dots ── */}
        <div className="relative z-10 w-full px-4 sm:px-10 md:px-16 lg:px-24 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: 'rgba(8,10,15,0.75)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Stats */}
          <div className="flex items-center space-x-6">
            {[
              { value: '500+', label: 'Propriétés' },
              { value: '98%', label: 'Satisfaction' },
              { value: 'Lomé', label: 'Togo' },
            ].map(({ value, label }) => (
              <div key={label} className="text-left">
                <p className="text-base sm:text-lg font-bold text-white">{value}</p>
                <p className="text-xs" style={{ color: '#9ca3af' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Dots pour mobile */}
          <div className="flex space-x-1.5 md:hidden">
            {properties.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i === current ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>

          {/* Thumbnails pour grand écran */}
          <div className="hidden md:flex space-x-2 overflow-x-auto py-1">
            {properties.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                className="relative rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300"
                style={{
                  width: i === current ? '72px' : '48px',
                  height: '46px',
                  border: i === current ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)',
                  opacity: i === current ? 1 : 0.6,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(25px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-25px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
