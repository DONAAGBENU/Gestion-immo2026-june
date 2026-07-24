import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  autoPlayInterval?: number; // ms, default 4000
  height?: string;           // CSS height, default '320px'
  showCounter?: boolean;
  className?: string;
}

export default function ImageSlider({
  images,
  autoPlayInterval = 4000,
  height = '320px',
  showCounter = true,
  className = '',
}: ImageSliderProps) {
  const [current, setCurrent]   = useState(0);
  const [paused, setPaused]     = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = images.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  /* ── Auto-play ── */
  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next, autoPlayInterval, total]);

  /* ── Swipe tactile ── */
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
  };

  /* ── Drag souris ── */
  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); startX.current = e.clientX; };
  const onMouseUp   = (e: React.MouseEvent) => {
    if (!dragging) return;
    setDragging(false);
    const dx = e.clientX - startX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
  };

  if (!images || images.length === 0) {
    return (
      <div style={{ height, background: '#1e2330', borderRadius: '12px' }}
        className={`flex items-center justify-center ${className}`}>
        <span style={{ color: '#6b7280' }}>Aucune image</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{ height, background: '#111827', borderRadius: '12px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setDragging(false); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {/* ── Images ── */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Photo ${i + 1}`}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: 'none' }}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      {/* ── Gradient bas ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />

      {/* ── Flèches ── */}
      {total > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full transition-all duration-200"
            style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            aria-label="Image précédente"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full transition-all duration-200"
            style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            aria-label="Image suivante"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── Compteur ── */}
      {showCounter && total > 1 && (
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        >
          📷 {current + 1}/{total}
        </div>
      )}

      {/* ── Bouton pause ── */}
      {total > 1 && (
        <button
          onClick={e => { e.stopPropagation(); setPaused(v => !v); }}
          className="absolute top-3 left-3 z-10 flex items-center justify-center rounded-full"
          style={{ width: 30, height: 30, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
          aria-label={paused ? 'Reprendre' : 'Pause'}
          title={paused ? 'Reprendre le défilement' : 'Pause'}
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      )}

      {/* ── Dots ── */}
      {total > 1 && total <= 30 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i); }}
              aria-label={`Aller à la photo ${i + 1}`}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: i === current ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                transition: 'width 0.3s, background 0.3s',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
