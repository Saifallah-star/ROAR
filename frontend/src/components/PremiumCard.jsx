import { useState } from 'react';

// ─── Animal image imports ───────────────────────────────────────────────────
import falconImage from '../assets/animals/falcon.webp';
import lionImage from '../assets/animals/lion.webp';
import tigerImage from '../assets/animals/tiger.webp';
import jaguarImage from '../assets/animals/jaguar.webp';
import gorillaImage from '../assets/animals/gorilla.webp';
import crocodileImage from '../assets/animals/crocodile.webp';
import cobraImage from '../assets/animals/cobra.webp';

export const ANIMAL_IMAGES = {
  falcon: falconImage,
  lion: lionImage,
  tiger: tigerImage,
  jaguar: jaguarImage,
  gorilla: gorillaImage,
  crocodile: crocodileImage,
  cobra: cobraImage,
};

export const ANIMAL_THEMES = {
  lion: {
    borderGradient: 'from-amber-400 via-yellow-600 to-amber-800',
    headerBg: 'bg-gradient-to-r from-amber-900/90 to-yellow-800/90',
    footerBg: 'bg-gradient-to-t from-[#1a0f05] via-[#291708] to-[#120a03]',
    glowClass: 'shadow-[0_0_40px_rgba(245,158,11,0.55)]',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500/50',
    badgeBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    badgeGlow: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]',
    stars: 5,
    rarityName: 'LEGENDARY',
    rarityColor: 'text-amber-400 text-glow-gold',
    overlayFrom: 'rgba(120,53,15,0.15)',
    overlayTo: 'rgba(10,5,0,0.85)',
  },
  tiger: {
    borderGradient: 'from-orange-500 via-red-500 to-orange-800',
    headerBg: 'bg-gradient-to-r from-orange-950/90 to-red-950/90',
    footerBg: 'bg-gradient-to-t from-[#1f0d05] via-[#331508] to-[#140803]',
    glowClass: 'shadow-[0_0_40px_rgba(249,115,22,0.55)]',
    accentText: 'text-orange-400',
    accentBorder: 'border-orange-500/50',
    badgeBg: 'bg-gradient-to-br from-orange-500 to-red-600',
    badgeGlow: 'shadow-[0_0_20px_rgba(249,115,22,0.6)]',
    stars: 5,
    rarityName: 'EPIC',
    rarityColor: 'text-orange-400',
    overlayFrom: 'rgba(124,45,18,0.15)',
    overlayTo: 'rgba(10,4,0,0.85)',
  },
  jaguar: {
    borderGradient: 'from-emerald-400 via-teal-600 to-emerald-950',
    headerBg: 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90',
    footerBg: 'bg-gradient-to-t from-[#04140f] via-[#092b20] to-[#020b08]',
    glowClass: 'shadow-[0_0_40px_rgba(16,185,129,0.5)]',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/50',
    badgeBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    badgeGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]',
    stars: 3,
    rarityName: 'UNCOMMON',
    rarityColor: 'text-emerald-400',
    overlayFrom: 'rgba(4,47,31,0.15)',
    overlayTo: 'rgba(0,8,4,0.85)',
  },
  gorilla: {
    borderGradient: 'from-slate-400 via-zinc-600 to-slate-800',
    headerBg: 'bg-gradient-to-r from-slate-900/90 to-zinc-800/90',
    footerBg: 'bg-gradient-to-t from-[#111827] via-[#1f2937] to-[#030712]',
    glowClass: 'shadow-[0_0_40px_rgba(156,163,175,0.45)]',
    accentText: 'text-slate-300',
    accentBorder: 'border-slate-500/40',
    badgeBg: 'bg-gradient-to-br from-slate-400 to-zinc-600',
    badgeGlow: 'shadow-[0_0_20px_rgba(156,163,175,0.5)]',
    stars: 4,
    rarityName: 'RARE',
    rarityColor: 'text-slate-300',
    overlayFrom: 'rgba(15,23,42,0.15)',
    overlayTo: 'rgba(2,4,10,0.88)',
  },
  crocodile: {
    borderGradient: 'from-green-500 via-emerald-700 to-emerald-900',
    headerBg: 'bg-gradient-to-r from-green-950/90 to-emerald-950/90',
    footerBg: 'bg-gradient-to-t from-[#051405] via-[#0b290b] to-[#020802]',
    glowClass: 'shadow-[0_0_40px_rgba(16,185,129,0.4)]',
    accentText: 'text-emerald-500',
    accentBorder: 'border-emerald-600/40',
    badgeBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    badgeGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    stars: 3,
    rarityName: 'UNCOMMON',
    rarityColor: 'text-emerald-500',
    overlayFrom: 'rgba(2,28,21,0.15)',
    overlayTo: 'rgba(0,6,4,0.88)',
  },
  falcon: {
    borderGradient: 'from-sky-400 via-amber-500 to-sky-700',
    headerBg: 'bg-gradient-to-r from-sky-950/90 to-indigo-950/90',
    footerBg: 'bg-gradient-to-t from-[#09152b] via-[#13284f] to-[#030a17]',
    glowClass: 'shadow-[0_0_40px_rgba(56,189,248,0.45)]',
    accentText: 'text-sky-300',
    accentBorder: 'border-sky-500/40',
    badgeBg: 'bg-gradient-to-br from-sky-400 to-amber-500',
    badgeGlow: 'shadow-[0_0_20px_rgba(56,189,248,0.5)]',
    stars: 3,
    rarityName: 'UNCOMMON',
    rarityColor: 'text-sky-300',
    overlayFrom: 'rgba(9,21,43,0.10)',
    overlayTo: 'rgba(2,5,15,0.88)',
  },
  cobra: {
    borderGradient: 'from-rose-500 via-red-700 to-rose-950',
    headerBg: 'bg-gradient-to-r from-rose-950/90 to-red-950/90',
    footerBg: 'bg-gradient-to-t from-[#14040a] via-[#290916] to-[#080205]',
    glowClass: 'shadow-[0_0_40px_rgba(225,29,72,0.45)]',
    accentText: 'text-rose-400',
    accentBorder: 'border-rose-500/40',
    badgeBg: 'bg-gradient-to-br from-rose-500 to-red-700',
    badgeGlow: 'shadow-[0_0_20px_rgba(225,29,72,0.5)]',
    stars: 2,
    rarityName: 'COMMON',
    rarityColor: 'text-rose-400',
    overlayFrom: 'rgba(20,4,10,0.12)',
    overlayTo: 'rgba(8,0,4,0.88)',
  },
};

const DEFAULT_THEME = {
  borderGradient: 'from-slate-600 via-slate-700 to-slate-800',
  headerBg: 'bg-[#0f172a]/90',
  footerBg: 'bg-[#0b0f19]',
  glowClass: 'shadow-2xl shadow-black/80',
  accentText: 'text-slate-400',
  accentBorder: 'border-slate-600',
  badgeBg: 'bg-slate-600',
  badgeGlow: 'shadow-lg',
  stars: 1,
  rarityName: 'BASIC',
  rarityColor: 'text-slate-400',
  overlayFrom: 'rgba(15,23,42,0.15)',
  overlayTo: 'rgba(2,4,10,0.88)',
};

export function getAnimalTheme(name) {
  if (!name) return DEFAULT_THEME;
  const key = name.toLowerCase();
  return ANIMAL_THEMES[key] || DEFAULT_THEME;
}

// ─── CARD FRAME ─────────────────────────────────────────────────────────────
export function CardFrame({ name, children, isHovered }) {
  const theme = getAnimalTheme(name);
  return (
    <div
      className={`relative w-full h-full rounded-2xl p-[3px] bg-gradient-to-b ${theme.borderGradient} ${theme.glowClass} transition-all duration-300 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18)_0%,transparent_60%)] pointer-events-none z-10" />
      <div className="absolute inset-[1px] bg-gradient-to-tr from-black/60 via-transparent to-white/10 rounded-2xl pointer-events-none z-10" />
      {/* Corner brackets */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-white/40 pointer-events-none z-[15]" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-white/40 pointer-events-none z-[15]" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-white/40 pointer-events-none z-[15]" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-white/40 pointer-events-none z-[15]" />
      {/* Holographic shimmer */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] bg-no-repeat pointer-events-none z-20 transition-all duration-1000 ${isHovered ? 'animate-shimmer opacity-100' : 'opacity-40 animate-[shimmer_5s_infinite_linear]'
          }`}
      />
      <div className="relative w-full h-full rounded-xl overflow-hidden flex flex-col bg-black select-none">
        {children}
      </div>
    </div>
  );
}

// ─── CARD ARTWORK ────────────────────────────────────────────────────────────
export function CardArtwork({ name }) {
  const key = name ? name.toLowerCase() : '';
  const src = ANIMAL_IMAGES[key];
  const theme = getAnimalTheme(name);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1b1c30] to-[#070814] text-slate-500">
          <span className="text-4xl mb-2">🐾</span>
          <span className="text-xs font-black uppercase tracking-widest">{name}</span>
        </div>
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${theme.overlayFrom} 0%, transparent 40%, ${theme.overlayTo} 100%)`,
        }}
      />
    </div>
  );
}

// ─── CARD HEADER ─────────────────────────────────────────────────────────────
export function CardHeader({ name }) {
  const theme = getAnimalTheme(name);
  return (
    <div
      className={`relative flex-shrink-0 px-3 py-2.5 ${theme.headerBg} border-b ${theme.accentBorder} flex items-center justify-between z-20 shadow-[0_2px_10px_rgba(0,0,0,0.6)]`}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 pointer-events-none" />
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: theme.stars }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 ${theme.accentText} drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]`}>
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
        ))}
      </div>
      {/* Name */}
      <span className="font-display font-black text-[13px] tracking-[0.15em] text-white uppercase text-glow-gold">
        {name}
      </span>
      {/* Rarity */}
      <span className={`text-[7px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-black/60 rounded border ${theme.accentBorder} ${theme.accentText}`}>
        {theme.rarityName}
      </span>
    </div>
  );
}

// ─── CARD FOOTER (VP BADGE) ──────────────────────────────────────────────────
export function CardFooter({ name, vp }) {
  const theme = getAnimalTheme(name);
  return (
    <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 ${theme.accentBorder} bg-[#0a0a0a] flex-shrink-0 ${theme.badgeGlow}`}>
        <div className="absolute inset-0.5 rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <span className="font-display font-black text-base text-white tracking-tighter text-glow-gold mt-1 leading-none">
          {vp}
        </span>
        <span className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-0.5 leading-none">
          VP
        </span>
      </div>
    </div>
  );
}

// ─── MAIN PREMIUM CARD COMPONENT ─────────────────────────────────────────────
// ✅ FIX: Removed `style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}`
//    That caused overflow-hidden to fail in Chrome, making the animal image
//    escape the card container and fill the entire viewport.
export default function PremiumCard({ name, vp, className = '', isHoverable = true, isSelected = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const hasWidth = className.split(' ').some(c => c.startsWith('w-') || c.startsWith('w-['));
  const widthClass = hasWidth ? '' : 'w-[250px]';

  return (
    <div
      onMouseEnter={() => isHoverable && setIsHovered(true)}
      onMouseLeave={() => isHoverable && setIsHovered(false)}
      className={`relative select-none aspect-[2.5/3.6] cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl ${widthClass} ${isHoverable && isHovered ? 'scale-105 shadow-card-hover -translate-y-2' : ''
        } ${isSelected ? 'ring-2 ring-white scale-110 shadow-glow-gold' : ''
        } ${className}`}
    >
      <CardFrame name={name} isHovered={isHovered} isSelected={isSelected}>
        <CardHeader name={name} />
        <div className="flex-1 relative overflow-visible min-h-0">
          <CardArtwork name={name} />
          <CardFooter name={name} vp={vp} />
        </div>
      </CardFrame>
    </div>
  );
}