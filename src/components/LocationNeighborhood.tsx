import { useState } from 'react';
import { MapPin, Star, ExternalLink, PersonStanding, Car, Train, Utensils, Camera, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Highlight {
  label: string;
  distance: string;
  mode: 'walk' | 'car';
}

interface NeighborhoodCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: Highlight[];
}

const NEIGHBORHOOD_DATA: NeighborhoodCategory[] = [
  {
    id: 'transport',
    name: 'Transport',
    icon: <Train className="h-3.5 w-3.5" />,
    items: [
      { label: 'MOA Bus Terminal', distance: '3 min walk', mode: 'walk' },
      { label: 'Mall of Asia Arena', distance: '5 min walk', mode: 'walk' },
      { label: 'NAIA Terminal 1', distance: '12 min drive', mode: 'car' },
    ],
  },
  {
    id: 'dining',
    name: 'Dining',
    icon: <Utensils className="h-3.5 w-3.5" />,
    items: [
      { label: 'S Maison, Conrad Manila', distance: '2 min walk', mode: 'walk' },
      { label: 'MOA Complex Food Court', distance: '3 min walk', mode: 'walk' },
      { label: 'Dampa Seaside Market', distance: '8 min drive', mode: 'car' },
    ],
  },
  {
    id: 'attractions',
    name: 'Attractions',
    icon: <Camera className="h-3.5 w-3.5" />,
    items: [
      { label: 'Mall of Asia', distance: '2 min walk', mode: 'walk' },
      { label: 'MOA Eye (Giant Ferris Wheel)', distance: '5 min walk', mode: 'walk' },
      { label: 'SM by the Bay', distance: '7 min walk', mode: 'walk' },
    ],
  },
];

// Decorative map POI dots
const MAP_DOTS = [
  { x: '20%',  y: '30%', label: 'Bay Area', size: 3 },
  { x: '75%',  y: '20%', label: 'Marina',   size: 2 },
  { x: '30%',  y: '70%', label: 'Terminal', size: 3 },
  { x: '80%',  y: '65%', label: 'Market',   size: 2 },
  { x: '55%',  y: '80%', label: 'Park',     size: 2 },
  { x: '10%',  y: '55%', label: 'Port',     size: 4 },
  { x: '88%',  y: '40%', label: 'Hotel',    size: 2 },
];

interface LocationNeighborhoodProps {
  propertyName: string;
  rating?: number | string;
}

export default function LocationNeighborhood({ propertyName, rating = 4.9 }: LocationNeighborhoodProps) {
  const [activeCategory, setActiveCategory] = useState('transport');
  const [showMarkerCard, setShowMarkerCard] = useState(false);

  const activeData = NEIGHBORHOOD_DATA.find(c => c.id === activeCategory)!;
  const gmapsUrl = 'https://maps.google.com/?q=Mall+of+Asia+Complex,+Pasay,+Metro+Manila,+Philippines';

  return (
    <div className="border-b pb-10">
      {/* Section header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Location &amp; Neighborhood
          </h2>
          <p className="text-sm text-slate-500 dark:text-white/50 flex items-center gap-1.5">
            <Navigation className="h-3.5 w-3.5" />
            MOA Complex, Pasay City, Metro Manila
          </p>
        </div>
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Maps
        </a>
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── CUSTOM CSS DARK MAP ── */}
        <div
          className="relative flex-1 rounded-2xl overflow-hidden border border-[#1e293b] min-h-[300px] lg:min-h-[380px] cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 40%, #0a1e35 100%)',
          }}
        >
          {/* Grid lines (street network simulation) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Horizontal streets */}
            {[15, 28, 42, 55, 68, 80].map(y => (
              <line key={`h${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#3b82f6" strokeWidth="0.8" />
            ))}
            {/* Vertical streets */}
            {[12, 25, 38, 50, 62, 75, 88].map(x => (
              <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#3b82f6" strokeWidth="0.8" />
            ))}
            {/* Diagonal roads */}
            <line x1="0" y1="100%" x2="60%" y2="0" stroke="#60a5fa" strokeWidth="1.2" opacity="0.4" />
            <line x1="40%" y1="100%" x2="100%" y2="20%" stroke="#60a5fa" strokeWidth="1.2" opacity="0.4" />
            {/* Bay water area */}
            <ellipse cx="15%" cy="50%" rx="12%" ry="22%" fill="#1e3a5f" opacity="0.5" />
            {/* Block fills */}
            <rect x="24%" y="14%" width="13%" height="13%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="50%" y="27%" width="11%" height="12%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="74%" y="14%" width="13%" height="12%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="24%" y="41%" width="13%" height="13%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="62%" y="41%" width="11%" height="12%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="38%" y="54%" width="11%" height="13%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="74%" y="54%" width="13%" height="11%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="24%" y="67%" width="13%" height="12%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="50%" y="67%" width="11%" height="11%" rx="1" fill="#0f2a4a" opacity="0.7" />
            <rect x="38%" y="14%" width="11%" height="13%" rx="1" fill="#0f2a4a" opacity="0.7" />
          </svg>

          {/* Water shimmer */}
          <div
            className="absolute"
            style={{
              left: '3%', top: '28%', width: '24%', height: '44%',
              background: 'radial-gradient(ellipse at center, rgba(30,80,140,0.55) 0%, rgba(10,22,40,0) 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Small POI dots */}
          {MAP_DOTS.map(dot => (
            <div
              key={dot.label}
              className="absolute rounded-full bg-blue-400/60"
              style={{
                left: dot.x,
                top: dot.y,
                width: dot.size * 3,
                height: dot.size * 3,
                transform: 'translate(-50%,-50%)',
                boxShadow: '0 0 6px 2px rgba(96,165,250,0.4)',
              }}
            />
          ))}

          {/* ── Pulse Marker (MOA property) ── */}
          <div
            className="absolute z-20 cursor-pointer"
            style={{ left: '50%', top: '46%', transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setShowMarkerCard(true)}
            onMouseLeave={() => setShowMarkerCard(false)}
          >
            {/* Rings */}
            <span className="absolute rounded-full bg-primary/15 animate-ping"
              style={{ width: 56, height: 56, top: -20, left: -20 }} />
            <span className="absolute rounded-full bg-primary/25 animate-ping"
              style={{ width: 40, height: 40, top: -12, left: -12, animationDelay: '0.4s' }} />

            {/* Core pin */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="relative z-10 flex items-center justify-center w-9 h-9 bg-primary rounded-full shadow-2xl ring-2 ring-white/90"
              style={{ boxShadow: '0 0 0 4px rgba(59,130,246,0.3), 0 8px 24px rgba(59,130,246,0.5)' }}
            >
              <MapPin className="h-4 w-4 text-white fill-white" />
            </motion.div>

            {/* Hover mini-card */}
            <AnimatePresence>
              {showMarkerCard && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-30 pointer-events-none"
                  style={{ bottom: '110%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 }}
                >
                  <div
                    className="rounded-xl px-4 py-2.5 text-center min-w-[170px] shadow-2xl"
                    style={{
                      background: 'rgba(10,22,40,0.92)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <p className="text-white text-xs font-bold leading-tight">{propertyName}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-amber-400 text-xs font-bold">{rating}</span>
                      <span className="text-white/40 text-xs">· MOA Complex</span>
                    </div>
                    {/* Arrow */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0"
                      style={{
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgba(10,22,40,0.92)',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Map label overlays */}
          <div className="absolute top-4 left-5 text-[10px] font-semibold text-blue-300/70 uppercase tracking-widest">
            Manila Bay
          </div>
          <div className="absolute bottom-12 right-10 text-[9px] font-medium text-slate-400/60 uppercase tracking-wider">
            Pasay City
          </div>

          {/* Glassmorphism 'View in Google Maps' button */}
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(10,22,40,0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            View in Google Maps
          </a>

          {/* Scale bar */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="h-[2px] w-10 bg-white/30 rounded" />
            <span className="text-white/40 text-[10px] font-mono">500m</span>
          </div>
        </div>

        {/* ── NEIGHBORHOOD HIGHLIGHTS SIDEBAR ── */}
        <div className="lg:w-[290px] flex flex-col gap-3">

          {/* Category tab strip */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-[#0f172a] p-1 gap-1 border border-slate-200 dark:border-[#1e293b]">
            {NEIGHBORHOOD_DATA.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200',
                  activeCategory === cat.id
                    ? 'bg-white dark:bg-[#1e293b] text-primary shadow-sm'
                    : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70'
                )}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Category label */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 px-1">
            Nearby {activeData.name}
          </p>

          {/* Items */}
          <div className="flex flex-col gap-2 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-2"
              >
                {activeData.items.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.07 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] hover:border-primary/30 transition-colors group"
                  >
                    {/* Mode icon */}
                    <div className={cn(
                      'flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors',
                      item.mode === 'walk'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20'
                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20'
                    )}>
                      {item.mode === 'walk'
                        ? <PersonStanding className="h-4 w-4" />
                        : <Car className="h-4 w-4" />
                      }
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-900 dark:text-white text-sm font-semibold truncate leading-tight">{item.label}</p>
                      <p className={cn(
                        'text-xs mt-0.5 font-medium',
                        item.mode === 'walk'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-blue-500 dark:text-blue-400'
                      )}>{item.distance}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <p className="text-[11px] text-slate-400 dark:text-white/30 text-center px-2">
            Distances are estimated based on typical conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
