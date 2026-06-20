import { useState } from 'react';

// Theme configuration for the 7 animal cards
export const ANIMAL_THEMES = {
  lion: {
    borderGradient: 'from-amber-400 via-yellow-600 to-amber-800',
    headerBg: 'bg-gradient-to-r from-amber-900/90 to-yellow-800/90',
    footerBg: 'bg-gradient-to-t from-[#1a0f05] via-[#291708] to-[#120a03]',
    glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500/50',
    badgeBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    badgeGlow: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]',
    stars: 5,
    rarityName: 'LEGENDARY',
    rarityColor: 'text-amber-400 text-glow-gold'
  },
  tiger: {
    borderGradient: 'from-orange-500 via-red-500 to-orange-800',
    headerBg: 'bg-gradient-to-r from-orange-950/90 to-red-950/90',
    footerBg: 'bg-gradient-to-t from-[#1f0d05] via-[#331508] to-[#140803]',
    glowClass: 'shadow-[0_0_25px_rgba(249,115,22,0.35)]',
    accentText: 'text-orange-400',
    accentBorder: 'border-orange-500/50',
    badgeBg: 'bg-gradient-to-br from-orange-500 to-red-600',
    badgeGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]',
    stars: 5,
    rarityName: 'EPIC',
    rarityColor: 'text-orange-400'
  },
  jaguar: {
    borderGradient: 'from-emerald-400 via-teal-600 to-emerald-950',
    headerBg: 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90',
    footerBg: 'bg-gradient-to-t from-[#04140f] via-[#092b20] to-[#020b08]',
    glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/50',
    badgeBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    badgeGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    stars: 4,
    rarityName: 'RARE',
    rarityColor: 'text-emerald-400'
  },
  gorilla: {
    borderGradient: 'from-slate-400 via-zinc-600 to-slate-800',
    headerBg: 'bg-gradient-to-r from-slate-900/90 to-zinc-800/90',
    footerBg: 'bg-gradient-to-t from-[#111827] via-[#1f2937] to-[#030712]',
    glowClass: 'shadow-[0_0_25px_rgba(156,163,175,0.3)]',
    accentText: 'text-slate-300',
    accentBorder: 'border-slate-500/40',
    badgeBg: 'bg-gradient-to-br from-slate-400 to-zinc-600',
    badgeGlow: 'shadow-[0_0_15px_rgba(156,163,175,0.4)]',
    stars: 4,
    rarityName: 'RARE',
    rarityColor: 'text-slate-300'
  },
  crocodile: {
    borderGradient: 'from-green-500 via-emerald-700 to-emerald-900',
    headerBg: 'bg-gradient-to-r from-green-950/90 to-emerald-950/90',
    footerBg: 'bg-gradient-to-t from-[#051405] via-[#0b290b] to-[#020802]',
    glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    accentText: 'text-emerald-500',
    accentBorder: 'border-emerald-600/40',
    badgeBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    badgeGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    stars: 3,
    rarityName: 'UNCOMMON',
    rarityColor: 'text-emerald-500'
  },
  falcon: {
    borderGradient: 'from-sky-400 via-amber-500 to-sky-700',
    headerBg: 'bg-gradient-to-r from-sky-950/90 to-indigo-950/90',
    footerBg: 'bg-gradient-to-t from-[#09152b] via-[#13284f] to-[#030a17]',
    glowClass: 'shadow-[0_0_25px_rgba(56,189,248,0.3)]',
    accentText: 'text-sky-300',
    accentBorder: 'border-sky-500/40',
    badgeBg: 'bg-gradient-to-br from-sky-400 to-amber-500',
    badgeGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.4)]',
    stars: 3,
    rarityName: 'UNCOMMON',
    rarityColor: 'text-sky-300'
  },
  cobra: {
    borderGradient: 'from-rose-500 via-red-700 to-rose-950',
    headerBg: 'bg-gradient-to-r from-rose-950/90 to-red-950/90',
    footerBg: 'bg-gradient-to-t from-[#14040a] via-[#290916] to-[#080205]',
    glowClass: 'shadow-[0_0_25px_rgba(225,29,72,0.3)]',
    accentText: 'text-rose-400',
    accentBorder: 'border-rose-500/40',
    badgeBg: 'bg-gradient-to-br from-rose-500 to-red-700',
    badgeGlow: 'shadow-[0_0_15px_rgba(225,29,72,0.4)]',
    stars: 2,
    rarityName: 'COMMON',
    rarityColor: 'text-rose-400'
  }
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
  rarityColor: 'text-slate-400'
};

export function getAnimalTheme(name) {
  if (!name) return DEFAULT_THEME;
  const key = name.toLowerCase();
  return ANIMAL_THEMES[key] || DEFAULT_THEME;
}

// ─── CARD FRAME COMPONENT ───
// Renders the outer metallic structure, border gradients, and shine overlays
export function CardFrame({ name, children, isHovered, isSelected }) {
  const theme = getAnimalTheme(name);
  
  return (
    <div
      className={`relative w-full h-full rounded-2xl p-[3px] bg-gradient-to-b ${theme.borderGradient} ${theme.glowClass} transition-all duration-300 overflow-hidden flex flex-col justify-between`}
    >
      {/* Glossy Metallic Highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18)_0%,transparent_60%)] pointer-events-none z-10" />
      <div className="absolute inset-[1px] bg-gradient-to-tr from-black/60 via-transparent to-white/10 rounded-2xl pointer-events-none z-10" />

      {/* Luxury Gold Corner Brackets/Filigrees */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-white/30 pointer-events-none z-15" />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-white/30 pointer-events-none z-15" />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-white/30 pointer-events-none z-15" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-white/30 pointer-events-none z-15" />

      {/* Holographic Shimmer sheen that sweeps across when hovered or automatically */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] bg-no-repeat pointer-events-none z-20 transition-all duration-1000 ${
          isHovered ? 'animate-shimmer opacity-100' : 'opacity-40 animate-[shimmer_5s_infinite_linear]'
        }`}
        style={{ backgroundPosition: isHovered ? '200% center' : undefined }}
      />

      {/* The main card content slots nested within the frame */}
      <div className="relative w-full h-full rounded-xl overflow-hidden flex flex-col justify-between bg-black/95 select-none">
        {children}
      </div>
    </div>
  );
}

// ─── CARD ARTWORK COMPONENT ───
// Renders the detailed cinematic vector art based on the animal environmental styles
export function CardArtwork({ name }) {
  const norm = name ? name.toLowerCase() : '';
  
  if (norm === 'falcon') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="falcon-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0c1d3a" />
            <stop offset="40%" stopColor="#1e3a8a" />
            <stop offset="70%" stopColor="#c5a880" />
            <stop offset="100%" stopColor="#ffb070" />
          </linearGradient>
          <linearGradient id="sun-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fef08a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mountain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c3a50" />
            <stop offset="100%" stopColor="#0b0f19" />
          </linearGradient>
          <filter id="wind-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Sky Background */}
        <rect width="200" height="300" fill="url(#falcon-sky)" />

        {/* Sunrise Golden Rays */}
        <circle cx="40" cy="220" r="80" fill="url(#sun-glow)" />
        <polygon points="40,220 0,60 30,50" fill="#fef08a" opacity="0.15" />
        <polygon points="40,220 80,30 110,40" fill="#fef08a" opacity="0.15" />
        <polygon points="40,220 160,80 180,110" fill="#fef08a" opacity="0.15" />
        <polygon points="40,220 190,170 200,200" fill="#fef08a" opacity="0.12" />

        {/* Distant Mountain Peak */}
        <polygon points="-50,300 30,170 120,300" fill="#1e293b" opacity="0.8" />
        <polygon points="30,170 42,190 25,195" fill="#f1f5f9" opacity="0.9" /> {/* Snowcap */}

        {/* Midground Rocky Mountains */}
        <path d="M60 300 L120 140 L160 210 L200 130 L260 300 Z" fill="url(#mountain-grad)" />
        <polygon points="120,140 128,162 110,168" fill="#f8fafc" /> {/* Snowcap */}
        <polygon points="200,130 208,155 190,160" fill="#ffffff" /> {/* Snowcap */}

        {/* Wind Streaks (Cinematic motion) */}
        <path d="M-10 100 Q60 80 130 110 T210 90" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="30 15" opacity="0.25" filter="url(#wind-blur)" />
        <path d="M10 160 Q80 140 150 170 T220 145" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="40 20" opacity="0.2" filter="url(#wind-blur)" />

        {/* The Falcon - Flying Majestic Beast */}
        <g transform="translate(100, 110) scale(0.95)">
          {/* Wings Backdrop Shadow */}
          <path d="M-90 -10 C-40 -45, -10 -25, 0 0 C10 -25, 40 -45, 90 -10 C65 20, 35 5, 0 10 C-35 5, -65 20, -90 -10 Z" fill="#090f21" opacity="0.6" />
          
          {/* Main Wings Outstretched */}
          <path d="M-85 -15 C-45 -40, -12 -20, 0 5 C12 -20, 45 -40, 85 -15 C60 15, 30 0, 0 8 C-30 0, -60 15, -85 -15 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
          <path d="M-75 -10 C-40 -30, -10 -15, 0 5 C10 -15, 40 -30, 75 -10 C50 10, 25 2, 0 6 C-25 2, -50 10, -75 -10 Z" fill="#f1f5f9" />
          
          {/* Feather Details */}
          <path d="M-80 -12 L-65 0 M-60 -18 L-48 -3 M-40 -20 L-32 -5 M80 -12 L65 0 M60 -18 L48 -3 M40 -20 L32 -5" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Tail Feathers */}
          <path d="M-15 8 L-5 25 L5 25 L15 8 Z" fill="#94a3b8" />
          <path d="M-10 8 L-2 22 L2 22 L10 8 Z" fill="#e2e8f0" />

          {/* Falcon Body */}
          <ellipse cx="0" cy="-2" rx="12" ry="18" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <path d="M-8 -8 C-8 -22, 8 -22, 8 -8 L4 5 L-4 5 Z" fill="#ffffff" stroke="#475569" strokeWidth="1" /> {/* White Head */}

          {/* Golden Beak */}
          <polygon points="-3,-14 3,-14 0,-4" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" />
          <polygon points="-3,-14 3,-14 0,-9" fill="#fef08a" />

          {/* Fierce Eyes */}
          <circle cx="-3" cy="-16" r="1.2" fill="#000" />
          <circle cx="3" cy="-16" r="1.2" fill="#000" />
          <circle cx="-3.3" cy="-16.3" r="0.5" fill="#fff" />
          <circle cx="2.7" cy="-16.3" r="0.5" fill="#fff" />
          
          {/* Sun glint highlight */}
          <path d="M-10 -2 C-10 -15, 10 -15, 10 -2" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Foreground Clouds/Mist (Adds depth overlay) */}
        <ellipse cx="20" cy="300" rx="60" ry="25" fill="#cbd5e1" opacity="0.2" filter="url(#wind-blur)" />
        <ellipse cx="170" cy="290" rx="50" ry="20" fill="#f1f5f9" opacity="0.15" filter="url(#wind-blur)" />
      </svg>
    );
  }

  if (norm === 'lion') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="lion-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="35%" stopColor="#4c1d95" />
            <stop offset="65%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <radialGradient id="sunset-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <filter id="dust-blur">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        {/* Sunset Sky Background */}
        <rect width="200" height="300" fill="url(#lion-sky)" />

        {/* Giant Sunset Sun */}
        <circle cx="100" cy="180" r="55" fill="url(#sunset-sun)" />

        {/* Floating Savannah Dust/Sparks */}
        <circle cx="40" cy="160" r="1.5" fill="#fde047" opacity="0.7" filter="url(#dust-blur)" />
        <circle cx="50" cy="130" r="2" fill="#fde047" opacity="0.4" />
        <circle cx="160" cy="120" r="1" fill="#fde047" opacity="0.6" filter="url(#dust-blur)" />
        <circle cx="170" cy="170" r="2.5" fill="#f97316" opacity="0.5" />
        <circle cx="110" cy="100" r="1.8" fill="#fde047" opacity="0.8" />
        <circle cx="80" cy="140" r="1.2" fill="#fffbeb" opacity="0.9" />

        {/* Acasia tree silhouette in distance */}
        <path d="M10 240 L15 200 L12 200 Q20 185 35 185 Q40 190 32 195 L25 198 L23 240 Z" fill="#1e1b4b" opacity="0.4" />
        <ellipse cx="28" cy="183" rx="18" ry="4" fill="#1e1b4b" opacity="0.4" />

        {/* The Giant Pride Rock */}
        <path d="M-10 310 L60 210 L150 210 L220 310 Z" fill="#291305" />
        <path d="M50 210 L60 210 L130 210 L120 230 L55 230 Z" fill="#451a03" /> {/* Highlight on rock edge */}
        <path d="M-10 310 L45 230 L50 310 Z" fill="#1c0b02" />

        {/* The Roaring Lion */}
        <g transform="translate(105, 140) scale(0.68)">
          {/* Shadow Behind */}
          <path d="M-30 100 C-30 40, -40 20, -10 10 C20 0, 50 -10, 45 40 C42 60, 55 80, 50 100 Z" fill="#000" opacity="0.35" />

          {/* Lion Body/Pose */}
          <path d="M-35 105 L-30 80 Q-28 50 -15 45 Q5 35 15 40 Q25 45 35 75 L30 105 Z" fill="#451a03" />

          {/* Mane */}
          <path d="M-28 45 C-42 30, -48 10, -32 -8 C-16 -26, 16 -28, 32 -14 C48 0, 42 25, 30 42 C18 55, -14 60, -28 45 Z" fill="#321102" stroke="#1c0700" strokeWidth="2.5" />
          {/* Inner Mane highlights */}
          <path d="M-22 40 C-34 26, -38 12, -26 -4 C-14 -20, 10 -22, 24 -10 C38 2, 34 20, 24 34 Z" fill="#7c2d12" />

          {/* Lion Head Shape */}
          <path d="M-15 -6 C-20 -18, -5 -22, 0 -22 C5 -22, 20 -18, 15 -6 L10 12 L-10 12 Z" fill="#ca8a04" stroke="#451a03" strokeWidth="1.5" />
          
          {/* Snout open in roar */}
          <path d="M-8 -6 Q0 -18 8 -6 Q10 5 8 10 H-8 Z" fill="#eab308" />
          <path d="M-5 1 Q0 -5 5 1 L3 7 H-3 Z" fill="#7f1d1d" /> {/* Inner mouth */}
          <polygon points="-1,6 1,6 0,2" fill="#fff" /> {/* Teeth */}

          {/* Ears */}
          <path d="M-18 -18 C-25 -25, -10 -28, -12 -20 Z" fill="#321102" />
          <path d="M18 -18 C25 -25, 10 -28, 12 -20 Z" fill="#321102" />

          {/* Glowing Sunset Highlights on mane edge (Backlit effect) */}
          <path d="M-35 5 C-45 15, -42 30, -32 45" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M35 5 C45 15, 42 30, 32 45" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M-20 -24 Q0 -28 20 -24" fill="none" stroke="#fffbeb" strokeWidth="2" opacity="0.9" />

          {/* Lion Eyes (Closed, roaring intensely) */}
          <path d="M-10 -10 L-5 -8" stroke="#321102" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 -10 L5 -8" stroke="#321102" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (norm === 'tiger') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="tiger-jungle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#022c22" />
            <stop offset="50%" stopColor="#064e3b" />
            <stop offset="85%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <radialGradient id="orange-energy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff781f" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
          </radialGradient>
          <filter id="motion-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Jungle Canopy Background */}
        <rect width="200" height="300" fill="url(#tiger-jungle)" />

        {/* Swirling Orange Energy in background */}
        <circle cx="100" cy="150" r="90" fill="url(#orange-energy)" />
        <path d="M30 60 Q100 120 70 200 T180 250" fill="none" stroke="#f97316" strokeWidth="8" opacity="0.15" filter="url(#motion-blur)" />
        <path d="M170 40 Q90 120 130 180 T20 280" fill="none" stroke="#facc15" strokeWidth="4" opacity="0.2" filter="url(#motion-blur)" />

        {/* Giant jungle leaves framing the card */}
        <path d="M-10 -10 Q50 30 30 90 Q-20 60 -10 -10 Z" fill="#022c22" opacity="0.8" />
        <path d="M210 -10 Q150 30 170 90 Q220 60 210 -10 Z" fill="#022c22" opacity="0.8" />
        <path d="M-20 220 Q40 200 60 280 Q0 320 -20 220 Z" fill="#043e2f" />
        
        {/* Lunging Tiger */}
        <g transform="translate(100, 155) scale(0.8)">
          {/* Energy aura glow directly behind tiger */}
          <ellipse cx="0" cy="0" rx="60" ry="40" fill="#f97316" opacity="0.25" filter="url(#motion-blur)" />

          {/* Tiger body - lunging forward angle */}
          <path d="M-40 40 Q0 -20 40 40 Q50 90 0 100 Q-50 90 -40 40 Z" fill="#1c0702" />
          <path d="M-35 35 Q0 -15 35 35 Q42 80 0 90 Q-42 80 -35 35 Z" fill="#ea580c" />

          {/* Paw Left (Lunging forward) */}
          <path d="M-55 20 C-65 0, -45 -15, -35 0 L-25 25 Z" fill="#ea580c" stroke="#1c0702" strokeWidth="1.5" />
          <circle cx="-50" cy="-5" r="2.5" fill="#ffffff" /> {/* Claws */}
          <circle cx="-44" cy="-9" r="2.5" fill="#ffffff" />
          <circle cx="-37" cy="-7" r="2.5" fill="#ffffff" />

          {/* Paw Right (Lunging forward) */}
          <path d="M55 20 C65 0, 45 -15, 35 0 L25 25 Z" fill="#ea580c" stroke="#1c0702" strokeWidth="1.5" />
          <circle cx="50" cy="-5" r="2.5" fill="#ffffff" /> {/* Claws */}
          <circle cx="44" cy="-9" r="2.5" fill="#ffffff" />
          <circle cx="37" cy="-7" r="2.5" fill="#ffffff" />

          {/* Tiger Head */}
          <circle cx="0" cy="-25" r="28" fill="#ea580c" stroke="#1c0702" strokeWidth="2.5" />
          <path d="M-18 -45 L-28 -55 L-12 -38 Z" fill="#ea580c" stroke="#1c0702" strokeWidth="1.5" /> {/* Ear L */}
          <path d="M18 -45 L28 -55 L12 -38 Z" fill="#ea580c" stroke="#1c0702" strokeWidth="1.5" /> {/* Ear R */}
          <path d="M-14 -42 L-22 -48 L-11 -37 Z" fill="#fff" />
          <path d="M14 -42 L22 -48 L11 -37 Z" fill="#fff" />

          {/* White Snout & Chest plates */}
          <path d="M-12 -15 C-22 -20, -18 -8, 0 -8 C18 -8, 22 -20, 12 -15 C10 -5, -10 -5, -12 -15 Z" fill="#ffffff" />
          <path d="M-22 -22 C-28 -28, -22 -15, -15 -18" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M22 -22 C28 -28, 22 -15, 15 -18" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

          {/* Tiger Stripes */}
          {/* Face Stripes */}
          <path d="M-26 -28 L-14 -26 M-27 -20 L-16 -20 M-24 -12 L-15 -14" stroke="#1c0702" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M26 -28 L14 -26 M27 -20 L16 -20 M24 -12 L15 -14" stroke="#1c0702" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M-6 -48 L-1 -36 L6 -48" stroke="#1c0702" strokeWidth="3" fill="none" />
          <path d="M0 -34 L0 -24" stroke="#1c0702" strokeWidth="3.5" />

          {/* Snout details */}
          <polygon points="-4,-14 4,-14 0,-19" fill="#1c0702" />
          <path d="M0 -14 L0 -8" stroke="#1c0702" strokeWidth="2" />

          {/* Fierce Orange/Yellow Eyes */}
          <ellipse cx="-10" cy="-28" rx="4.5" ry="3.5" fill="#facc15" stroke="#1c0702" strokeWidth="1.5" />
          <ellipse cx="10" cy="-28" rx="4.5" ry="3.5" fill="#facc15" stroke="#1c0702" strokeWidth="1.5" />
          <circle cx="-9.5" cy="-28" r="1.8" fill="#000" />
          <circle cx="9.5" cy="-28" r="1.8" fill="#000" />
          
          {/* Eyes Sparkle */}
          <circle cx="-11" cy="-29" r="0.8" fill="#fff" />
          <circle cx="8" cy="-29" r="0.8" fill="#fff" />

          {/* Glowing fire sparks orbiting the tiger */}
          <circle cx="-40" cy="-60" r="1.5" fill="#fff" opacity="0.8" />
          <circle cx="50" cy="-50" r="2" fill="#fde047" opacity="0.9" />
          <circle cx="-65" cy="40" r="2.5" fill="#f97316" opacity="0.7" />
        </g>
      </svg>
    );
  }

  if (norm === 'jaguar') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="jaguar-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#061214" />
            <stop offset="60%" stopColor="#02201b" />
            <stop offset="100%" stopColor="#060814" />
          </linearGradient>
          <filter id="mist-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="eye-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Midnight Jungle Background */}
        <rect width="200" height="300" fill="url(#jaguar-sky)" />

        {/* Rainforest Vines/Mist */}
        <path d="M0 0 Q50 80 20 180 T10 300" fill="none" stroke="#052e16" strokeWidth="4" opacity="0.7" />
        <path d="M200 0 Q160 100 180 200 T190 300" fill="none" stroke="#052e16" strokeWidth="5" opacity="0.6" />

        {/* Jungle Mist Clouds */}
        <ellipse cx="60" cy="270" rx="90" ry="35" fill="#14532d" opacity="0.25" filter="url(#mist-blur)" />
        <ellipse cx="150" cy="280" rx="70" ry="25" fill="#047857" opacity="0.2" filter="url(#mist-blur)" />
        <ellipse cx="100" cy="180" rx="110" ry="40" fill="#022c22" opacity="0.3" filter="url(#mist-blur)" />

        {/* Glowing Rainforest Fireflies */}
        <circle cx="30" cy="80" r="1.5" fill="#a7f3d0" opacity="0.8" />
        <circle cx="160" cy="90" r="2.2" fill="#34d399" opacity="0.6" />
        <circle cx="85" cy="50" r="1.2" fill="#a7f3d0" opacity="0.5" />
        <circle cx="120" cy="210" r="2.8" fill="#10b981" opacity="0.4" />

        {/* Stealth Black Jaguar Emerging */}
        <g transform="translate(100, 140) scale(0.72)">
          {/* Shadow boundary blend */}
          <circle cx="0" cy="0" r="55" fill="#020617" opacity="0.7" filter="url(#mist-blur)" />

          {/* Shoulders / Upper Body */}
          <path d="M-45 50 C-45 10, -25 -10, 0 -10 C25 -10, 45 10, 45 50 Z" fill="#040815" stroke="#10b981" strokeWidth="1" opacity="0.9" />
          <path d="M-40 45 C-40 15, -22 -5, 0 -5 C22 -5, 40 15, 40 45 Z" fill="#090d1f" />

          {/* Glowing Rim Lights along shoulders */}
          <path d="M-42 40 C-42 18, -25 0, 0 0" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          <path d="M42 40 C42 18, 25 0, 0 0" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />

          {/* Jaguar Head */}
          <circle cx="0" cy="-15" r="24" fill="#030712" stroke="#0f172a" strokeWidth="2" />
          <circle cx="0" cy="-15" r="23" fill="#090d16" />

          {/* Stealth Spots (Subtle dark purple/indigo rosettes) */}
          <circle cx="-12" cy="-22" r="2.5" fill="#1e1b4b" opacity="0.7" />
          <circle cx="12" cy="-22" r="2.5" fill="#1e1b4b" opacity="0.7" />
          <circle cx="-16" cy="-10" r="3.2" fill="#1e1b4b" opacity="0.7" />
          <circle cx="16" cy="-10" r="3.2" fill="#1e1b4b" opacity="0.7" />
          <circle cx="0" cy="-30" r="2" fill="#1e1b4b" opacity="0.7" />

          {/* Ears */}
          <path d="M-15 -35 C-22 -42, -8 -45, -10 -36 Z" fill="#020617" stroke="#10b981" strokeWidth="1" />
          <path d="M15 -35 C22 -42, 8 -45, 10 -36 Z" fill="#020617" stroke="#10b981" strokeWidth="1" />

          {/* Muzzle */}
          <ellipse cx="0" cy="-8" rx="10" ry="7" fill="#020617" />
          <polygon points="-2.5,-10 2.5,-10 0,-7" fill="#10b981" />
          <path d="M0 -7 L0 -4" stroke="#111827" strokeWidth="1.5" />
          <path d="M-4 -3 Q0 -1 4 -3" fill="none" stroke="#111827" strokeWidth="1.5" />

          {/* Glowing Green Predator Eyes */}
          <g filter="url(#eye-glow)">
            <polygon points="-12,-20 -6,-16 -12,-15" fill="#0df293" />
            <polygon points="12,-20 6,-16 12,-15" fill="#0df293" />
            <circle cx="-10.5" cy="-17.5" r="1.5" fill="#ffffff" />
            <circle cx="10.5" cy="-17.5" r="1.5" fill="#ffffff" />
          </g>
        </g>

        {/* Foreground Mist Overlay */}
        <path d="M-10 300 Q100 240 210 300" fill="none" stroke="#047857" strokeWidth="12" opacity="0.25" filter="url(#mist-blur)" />
      </svg>
    );
  }

  if (norm === 'gorilla') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="gorilla-ruins" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <filter id="fog-blur" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Deep Slate ruins background */}
        <rect width="200" height="300" fill="url(#gorilla-ruins)" />

        {/* Ancient stone pillars */}
        <rect x="15" y="40" width="22" height="260" fill="#0f172a" opacity="0.8" />
        <rect x="15" y="38" width="25" height="12" fill="#1e293b" opacity="0.9" /> {/* Pillar Cap */}
        <rect x="160" y="20" width="25" height="280" fill="#0f172a" opacity="0.6" />

        {/* Ancient glowing carvings on stones */}
        <path d="M22 80 L30 80 L26 95 Z" fill="#64748b" opacity="0.3" />
        <path d="M26 120 Q32 125 22 135" fill="none" stroke="#64748b" strokeWidth="2" opacity="0.3" />

        {/* Thick Atmospheric Fog */}
        <ellipse cx="100" cy="220" rx="120" ry="45" fill="#64748b" opacity="0.2" filter="url(#fog-blur)" />
        <ellipse cx="20" cy="180" rx="50" ry="25" fill="#94a3b8" opacity="0.15" filter="url(#fog-blur)" />
        <ellipse cx="180" cy="260" rx="70" ry="30" fill="#475569" opacity="0.25" filter="url(#fog-blur)" />

        {/* Massive Gorilla - Silverback Stance */}
        <g transform="translate(100, 160) scale(0.85)">
          {/* Giant Silhouette Shadow */}
          <path d="M-55 70 C-55 0, -45 -35, 0 -35 C45 -35, 55 0, 55 70 Z" fill="#030712" opacity="0.65" filter="url(#fog-blur)" />

          {/* Broad Shoulders / Back */}
          <path d="M-50 75 C-50 5, -35 -25, 0 -25 C35 -25, 50 5, 50 75 Z" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <path d="M-44 75 C-44 12, -30 -18, 0 -18 C30 -18, 44 12, 44 75 Z" fill="#1e293b" />

          {/* Silverback highlights on back */}
          <path d="M-22 10 Q0 -10 22 10 L18 75 H-18 Z" fill="#cbd5e1" opacity="0.15" />
          <path d="M-28 2 Q0 -16 28 2" fill="none" stroke="#cbd5e1" strokeWidth="3" opacity="0.3" strokeLinecap="round" />

          {/* Gorilla Head */}
          <path d="M-18 -20 C-22 -35, 22 -35, 18 -20 L14 -5 L-14 -5 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          
          {/* Heavy Brow Ridge */}
          <rect x="-11" y="-22" width="22" height="4" rx="2" fill="#334155" />
          
          {/* Face mask (leather-like texture) */}
          <path d="M-10 -18 Q0 -14 10 -18 L8 -5 Q0 -2 -8 -5 Z" fill="#020617" />
          
          {/* Intimidating eyes nestled deep under brow */}
          <circle cx="-5" cy="-16" r="1" fill="#ff9800" />
          <circle cx="5" cy="-16" r="1" fill="#ff9800" />

          {/* Sagittal Crest (Top of skull) */}
          <path d="M-8 -32 Q0 -38 8 -32 L6 -28 L-6 -28 Z" fill="#0f172a" />
          
          {/* Massive Muscular Arm Silhouettes */}
          <path d="M-45 35 C-58 10, -50 75, -35 75 Z" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <path d="M45 35 C58 10, 50 75, 35 75 Z" fill="#0f172a" stroke="#334155" strokeWidth="1" />

          {/* Arm highlights */}
          <path d="M-45 20 C-48 40, -42 60, -37 70" fill="none" stroke="#475569" strokeWidth="2.5" opacity="0.5" />
          <path d="M45 20 C48 40, 42 60, 37 70" fill="none" stroke="#475569" strokeWidth="2.5" opacity="0.5" />
        </g>

        {/* Ancient creeping vines in foreground */}
        <path d="M0 0 Q40 60 10 120" fill="none" stroke="#064e3b" strokeWidth="2" opacity="0.8" />
        <circle cx="25" cy="40" r="3" fill="#065f46" />
        <circle cx="15" cy="80" r="4" fill="#047857" />
      </svg>
    );
  }

  if (norm === 'crocodile') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="crocodile-swamp" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#021c15" />
            <stop offset="60%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
          <radialGradient id="emerald-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#047857" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </radialGradient>
          <filter id="splash-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Swamp Deep Waters */}
        <rect width="200" height="300" fill="url(#crocodile-swamp)" />

        {/* Emerald light rays filtering through water */}
        <circle cx="100" cy="150" r="80" fill="url(#emerald-glow)" />
        <polygon points="100,0 60,300 80,300" fill="#34d399" opacity="0.08" />
        <polygon points="100,0 120,300 150,300" fill="#34d399" opacity="0.08" />

        {/* Swamp Reeds */}
        <path d="M10 300 Q15 200 8 120" fill="none" stroke="#022c22" strokeWidth="2.5" opacity="0.8" />
        <path d="M22 300 Q18 220 28 140" fill="none" stroke="#022c22" strokeWidth="2" opacity="0.8" />
        <path d="M185 300 Q175 190 190 110" fill="none" stroke="#022c22" strokeWidth="3" opacity="0.7" />

        {/* Ripple rings in the water */}
        <ellipse cx="100" cy="205" rx="55" ry="12" fill="none" stroke="#047857" strokeWidth="1.5" opacity="0.4" />
        <ellipse cx="100" cy="205" rx="80" ry="18" fill="none" stroke="#047857" strokeWidth="1" opacity="0.25" />

        {/* Predator Crocodile Snout Above Water */}
        <g transform="translate(100, 160) scale(0.8)">
          {/* Shadow in water */}
          <ellipse cx="0" cy="40" rx="45" ry="20" fill="#01100c" opacity="0.7" />

          {/* Crocodile Head/Scutes Profile */}
          <path d="M-45 35 L-20 18 Q0 12 35 22 L45 35 L40 44 L-40 44 Z" fill="#022c22" stroke="#064e3b" strokeWidth="1.5" />
          
          {/* Textured Scales / Scutes along back */}
          <polygon points="-38,30 -33,20 -28,30" fill="#022c22" stroke="#047857" strokeWidth="1" />
          <polygon points="-28,26 -23,16 -18,26" fill="#022c22" stroke="#047857" strokeWidth="1" />
          <polygon points="-18,22 -13,12 -8,22" fill="#022c22" stroke="#047857" strokeWidth="1" />

          {/* Yellow Predator Eye (Glowing above water level) */}
          <circle cx="12" cy="18" r="3.5" fill="#f59e0b" stroke="#022c22" strokeWidth="1" />
          <polygon points="12,14.5 12,21.5 13.5,18" fill="#000" /> {/* Slit Pupil */}
          <circle cx="11.2" cy="17" r="0.8" fill="#fff" /> {/* Glint */}

          {/* Crocodile Snout details */}
          <path d="M30 22 C32 20, 36 20, 38 23 L43 32 L28 32 Z" fill="#011c15" />
          <circle cx="37" cy="23" r="1" fill="#000" /> {/* Nostril */}

          {/* Open jaws showing razor teeth under the surface reflection */}
          <path d="M15 32 Q25 35 38 32" stroke="#047857" strokeWidth="1.5" fill="none" />
        </g>

        {/* Water Splashes (Dynamic movement) */}
        <g filter="url(#splash-blur)" opacity="0.7">
          {/* Left Splashes */}
          <path d="M50 200 Q40 180 35 185" fill="none" stroke="#a7f3d0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M55 202 Q48 170 42 178" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
          <circle cx="34" cy="178" r="1.5" fill="#fff" />
          <circle cx="41" cy="168" r="1" fill="#fff" />

          {/* Right Splashes */}
          <path d="M150 200 Q160 180 165 185" fill="none" stroke="#a7f3d0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M145 202 Q152 170 158 178" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
          <circle cx="166" cy="178" r="1.5" fill="#fff" />
          <circle cx="159" cy="168" r="1" fill="#fff" />
        </g>
      </svg>
    );
  }

  if (norm === 'cobra') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="cobra-temple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e0a15" />
            <stop offset="50%" stopColor="#311005" />
            <stop offset="85%" stopColor="#5c1d06" />
            <stop offset="100%" stopColor="#1a0007" />
          </linearGradient>
          <radialGradient id="venom-energy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#9f1239" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#311005" stopOpacity="0" />
          </radialGradient>
          <filter id="venom-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* Desert Temple / Dunes Background */}
        <rect width="200" height="300" fill="url(#cobra-temple)" />

        {/* Stars in Desert Night Sky */}
        <circle cx="25" cy="30" r="0.8" fill="#fff" opacity="0.8" />
        <circle cx="70" cy="20" r="0.5" fill="#fff" opacity="0.5" />
        <circle cx="165" cy="45" r="1" fill="#fff" opacity="0.9" />
        <circle cx="130" cy="15" r="0.7" fill="#fff" opacity="0.6" />

        {/* Sandstone Temple Pillars */}
        <path d="M-20 300 L25 150 L40 150 L60 300 Z" fill="#2d1502" opacity="0.8" />
        <path d="M220 300 L175 150 L160 150 L140 300 Z" fill="#2d1502" opacity="0.8" />
        <rect x="25" y="145" width="18" height="6" fill="#451a03" opacity="0.9" />
        <rect x="157" y="145" width="18" height="6" fill="#451a03" opacity="0.9" />

        {/* Poisonous Red/Purple Venom Mist */}
        <circle cx="100" cy="160" r="75" fill="url(#venom-energy)" />
        <path d="M20 280 Q80 180 50 140 T160 100" fill="none" stroke="#be123c" strokeWidth="6" opacity="0.15" filter="url(#venom-glow)" />

        {/* Giant Flared Cobra Rising */}
        <g transform="translate(100, 150) scale(0.75)">
          {/* Shadow Behind Cobra */}
          <path d="M-35 80 Q-60 10 0 -35 Q60 10 35 80 Z" fill="#000000" opacity="0.5" filter="url(#venom-glow)" />

          {/* Cobra Hood */}
          <path d="M-30 80 Q-55 15 0 -30 Q55 15 30 80 Z" fill="#4c0519" stroke="#900c3f" strokeWidth="2.5" />
          
          {/* Inner Hood Scale Textures (Flared marking pattern) */}
          <path d="M-22 55 Q-38 18 -10 -8" fill="none" stroke="#f43f5e" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
          <path d="M22 55 Q38 18 10 -8" fill="none" stroke="#f43f5e" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
          
          {/* Cobra Crest emblem (Eyeglasses mark) */}
          <path d="M-12 10 Q0 18 12 10 Q0 -2 -12 10 Z" fill="#9f1239" stroke="#f43f5e" strokeWidth="1.5" />
          <circle cx="-5" cy="9" r="2.5" fill="#1e0a15" />
          <circle cx="5" cy="9" r="2.5" fill="#1e0a15" />

          {/* Snake Coils (Body) */}
          <path d="M-14 80 L-10 120 L10 120 L14 80 Z" fill="#4c0519" stroke="#900c3f" strokeWidth="2" />
          <path d="M-25 110 Q0 125 25 110" fill="none" stroke="#900c3f" strokeWidth="12" strokeLinecap="round" />
          <path d="M-30 110 Q0 122 30 110" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

          {/* Cobra Head */}
          <ellipse cx="0" cy="-28" rx="14" ry="11" fill="#4c0519" stroke="#900c3f" strokeWidth="2" />
          <path d="M-10 -25 L0 -33 L10 -25 Z" fill="#31000e" />

          {/* Intimidating Glowing Red/Venom Eyes */}
          <circle cx="-5" cy="-27" r="2.2" fill="#ff2a5f" />
          <circle cx="5" cy="-27" r="2.2" fill="#ff2a5f" />
          <circle cx="-4.5" cy="-28" r="0.6" fill="#fff" />
          <circle cx="5.5" cy="-28" r="0.6" fill="#fff" />

          {/* Fangs & Dripping Venom */}
          <polygon points="-6,-20 -4,-20 -5,-11" fill="#ffffff" />
          <polygon points="6,-20 4,-20 5,-11" fill="#ffffff" />
          {/* Venom Drops */}
          <circle cx="-5" cy="-7" r="1.5" fill="#22c55e" opacity="0.85" filter="url(#venom-glow)" />
          <circle cx="5" cy="-9" r="1.2" fill="#22c55e" opacity="0.85" />
        </g>
      </svg>
    );
  }

  // Fallback vector icon representation for standard animal cards
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1b1c30] to-[#070814] flex flex-col items-center justify-center p-6 text-slate-500">
      <span className="text-4xl mb-2">🐾</span>
      <span className="text-xs font-black uppercase tracking-widest">{name}</span>
    </div>
  );
}

// ─── CARD HEADER COMPONENT ───
// Positioned in top 10% - contains name, stars, and metallic style container
export function CardHeader({ name }) {
  const theme = getAnimalTheme(name);
  
  return (
    <div className={`relative px-3 py-2 ${theme.headerBg} border-b ${theme.accentBorder} flex items-center justify-between z-20 shadow-[0_2px_10px_rgba(0,0,0,0.6)]`}>
      {/* Glossy Header Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 pointer-events-none" />

      {/* Rarity Star Group */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: theme.stars }).map((_, idx) => (
          <svg key={idx} viewBox="0 0 24 24" fill="currentColor" className={`w-2.5 h-2.5 ${theme.accentText} drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]`}>
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
        ))}
      </div>

      {/* Animal Name Plate */}
      <span className="font-display font-black text-[11px] tracking-[0.18em] text-white uppercase text-glow-gold">
        {name}
      </span>

      {/* Rarity Level Badge */}
      <span className={`text-[6.5px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-black/60 rounded border ${theme.accentBorder} ${theme.accentText}`}>
        {theme.rarityName}
      </span>
    </div>
  );
}

// ─── CARD FOOTER COMPONENT ───
// Positioned in bottom 15% - contains luxury details, VP, info panel
export function CardFooter({ name, vp }) {
  const theme = getAnimalTheme(name);
  
  return (
    <div className={`relative ${theme.footerBg} border-t ${theme.accentBorder} p-2 z-20 flex flex-col justify-center min-h-[50px] shadow-[0_-2px_10px_rgba(0,0,0,0.7)]`}>
      {/* Decorative Gold Filigree Trim */}
      <div className={`absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-${theme.accentText.split('-')[1]}-500/30 to-transparent`} />

      <div className="flex items-center justify-between w-full">
        {/* Luxury VP Seal / Shield Badge */}
        <div className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 ${theme.accentBorder} bg-black/80 flex-shrink-0 ${theme.badgeGlow}`}>
          {/* Inner star element */}
          <div className={`absolute inset-0.5 rounded-full border border-white/5 bg-gradient-to-b from-white/10 to-transparent pointer-events-none`} />
          <span className="font-display font-black text-[10px] text-white tracking-tighter text-glow-gold">
            {vp}
          </span>
          <span className="absolute -bottom-1 bg-black px-1 rounded-[2px] text-[5px] font-black text-white/50 border border-white/10 uppercase tracking-tighter scale-90">
            VP
          </span>
        </div>

        {/* Action / Lore Text Area */}
        <div className="flex-1 text-right pl-3">
          <span className={`block text-[8px] font-black uppercase tracking-wider ${theme.accentText}`}>
            ROAR ATTACK
          </span>
          <span className="block text-[6.5px] text-slate-400 font-semibold uppercase tracking-tight truncate max-w-[130px]">
            Double bid value challenge
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COLLECTIBLE CARD COMPONENT ───
// Fully responsive 3D-feeling card wrapper that combines header, art, frame, and footer
export default function PremiumCard({ name, vp, className = '', isHoverable = true, isSelected = false }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => isHoverable && setIsHovered(true)}
      onMouseLeave={() => isHoverable && setIsHovered(false)}
      className={`relative select-none aspect-[2.5/3.6] cursor-pointer transition-all duration-300 ${
        isHoverable && isHovered ? 'scale-105 shadow-card-hover -translate-y-2' : ''
      } ${
        isSelected ? 'ring-2 ring-white scale-110 shadow-glow-gold' : ''
      } ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <CardFrame name={name} isHovered={isHovered} isSelected={isSelected}>
        {/* Top Header Plate (10%) */}
        <CardHeader name={name} />

        {/* Full Artwork Area (75% height flex-1) */}
        <div className="flex-1 relative overflow-hidden bg-[#070a14] border-b border-black/40">
          <CardArtwork name={name} />
          
          {/* Bottom vignette overlay to blend artwork with footer */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        </div>

        {/* Bottom Stat/VP Plate (15%) */}
        <CardFooter name={name} vp={vp} />
      </CardFrame>
    </div>
  );
}
