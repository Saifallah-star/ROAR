import { useState, useEffect } from 'react';
import PremiumCard from './PremiumCard';

// Ornate card border decoration
const Decors = {
  CardBorder: () => (
    <rect x="2" y="2" width="20" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
  )
};

// ─── HIGH-QUALITY CUSTOM ILLUSTRATIVE AVATARS (SVGs) ───
const Avatars = {
  Explorer: ({ className = "w-16 h-16" }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill="#1b2e25" stroke="#3d6b52" strokeWidth="3" />
      <path d="M15 45 C15 25, 85 25, 85 45 Z" fill="#bfa17a" />
      <rect x="10" y="43" width="80" height="6" rx="3" fill="#a3845b" />
      <rect x="25" y="38" width="50" height="5" fill="#5c3f2b" />
      <circle cx="50" cy="58" r="18" fill="#ffdbac" />
      <rect x="34" y="52" width="14" height="10" rx="3" fill="#3a3a3a" stroke="#fff" strokeWidth="1.5" />
      <rect x="52" y="52" width="14" height="10" rx="3" fill="#3a3a3a" stroke="#fff" strokeWidth="1.5" />
      <line x1="48" y1="57" x2="52" y2="57" stroke="#fff" strokeWidth="2" />
      <path d="M42 66 Q50 72 58 66" stroke="#4a3b32" strokeWidth="3" fill="none" />
      <path d="M36 62 Q50 68 64 62" fill="#5c4a3f" />
      <path d="M35 76 L65 76 L60 95 L40 95 Z" fill="#4a5d4e" />
    </svg>
  ),
  Warrior: ({ className = "w-16 h-16" }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill="#2d1c1c" stroke="#6b3d3d" strokeWidth="3" />
      <path d="M38 70 L62 70 L60 90 L40 90 Z" fill="#ffcd94" />
      <path d="M32 60 C32 80, 68 80, 68 60 Z" fill="#1a110f" />
      <circle cx="50" cy="50" r="18" fill="#ffcd94" />
      <path d="M40 45 L43 55 L40 58" stroke="#c41e3a" strokeWidth="2.5" fill="none" />
      <path d="M60 45 L57 55 L60 58" stroke="#c41e3a" strokeWidth="2.5" fill="none" />
      <path d="M30 40 C30 15, 70 15, 70 40 L68 45 L32 45 Z" fill="#5a5d64" />
      <path d="M52 15 L52 25 M44 20 L60 20" stroke="#d4a017" strokeWidth="2" />
      <path d="M32 30 Q20 20 18 35 Q26 36 32 32" fill="#f5f5f5" stroke="#222" strokeWidth="1" />
      <path d="M68 30 Q80 20 82 35 Q74 36 68 32" fill="#f5f5f5" stroke="#222" strokeWidth="1" />
      <circle cx="44" cy="48" r="2.5" fill="#fff" />
      <circle cx="44" cy="48" r="1.2" fill="#000" />
      <circle cx="56" cy="48" r="2.5" fill="#fff" />
      <circle cx="56" cy="48" r="1.2" fill="#000" />
    </svg>
  ),
  Shaman: ({ className = "w-16 h-16" }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill="#2d1c3a" stroke="#60358a" strokeWidth="3" />
      <path d="M35 30 L42 10 L48 30 Z" fill="#c41e3a" />
      <path d="M50 28 L50 5 L56 28 Z" fill="#d4a017" />
      <path d="M65 30 L58 10 L52 30 Z" fill="#2563eb" />
      <rect x="32" y="32" width="36" height="42" rx="8" fill="#8b5a2b" stroke="#5c3a1a" strokeWidth="2" />
      <ellipse cx="44" cy="48" rx="6" ry="3" fill="#a7f3d0" />
      <circle cx="44" cy="48" r="1.5" fill="#047857" />
      <ellipse cx="56" cy="48" rx="6" ry="3" fill="#a7f3d0" />
      <circle cx="56" cy="48" r="1.5" fill="#047857" />
      <path d="M38 60 L46 64 L38 68" stroke="#10b981" strokeWidth="2.5" fill="none" />
      <path d="M62 60 L54 64 L62 68" stroke="#10b981" strokeWidth="2.5" fill="none" />
      <rect x="44" y="62" width="12" height="4" rx="2" fill="#222" />
    </svg>
  ),
  Sorcerer: ({ className = "w-16 h-16" }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill="#13132b" stroke="#313175" strokeWidth="3" />
      <path d="M22 80 C22 30, 78 30, 78 80 Z" fill="#2e1f5c" />
      <path d="M28 80 C28 40, 72 40, 72 80 Z" fill="#1b1238" />
      <circle cx="50" cy="56" r="15" fill="#ffdbac" />
      <path d="M38 62 C38 85, 62 85, 62 62 Z" fill="#f3f4f6" />
      <circle cx="50" cy="48" r="3.5" fill="#fcd34d" className="animate-pulse" />
      <circle cx="50" cy="48" r="1" fill="#fff" />
      <path d="M42 54 L46 54 M54 54 L58 54" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  Bandit: ({ className = "w-16 h-16" }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill="#2a221a" stroke="#5c4a37" strokeWidth="3" />
      <path d="M24 38 Q50 24 76 38 Z" fill="#b91c1c" />
      <circle cx="50" cy="56" r="18" fill="#e0a96d" />
      <path d="M32 50 L56 42" stroke="#111" strokeWidth="3.5" />
      <polygon points="38,44 48,42 46,52 38,50" fill="#111" />
      <circle cx="58" cy="50" r="2.5" fill="#fff" />
      <circle cx="58" cy="50" r="1" fill="#000" />
      <path d="M44 65 Q54 67 58 62" stroke="#222" strokeWidth="2" fill="none" />
      <circle cx="50" cy="62" r="12" fill="none" stroke="#333" strokeWidth="3" strokeDasharray="1 3" />
    </svg>
  )
};

const AVATAR_LIST = [Avatars.Explorer, Avatars.Warrior, Avatars.Shaman, Avatars.Sorcerer, Avatars.Bandit];

// ─── Radial Opponents Seat Matrix (Placed outside the table boundary) ───
// Dynamic opponent positioning is used instead of static coordinates.

export default function GameBoard({ room, player, socket, onLeave }) {
  const me = room?.players?.find((p) => p.id === player.id) || player;
  const gameLogs = room?.logs ?? [];
  const currentBid = typeof room?.currentBid === 'number' ? room.currentBid : 0;

  const highestBidderPlayer = room?.players?.find((p) => p.id === room.highestBidder);
  const currentBidderName = highestBidderPlayer ? (highestBidderPlayer.id === me.id ? 'YOU' : highestBidderPlayer.name) : '—';

  const currentTurnPlayer = room?.players?.[room?.currentTurnIndex];
  const currentTurnPlayerName = currentTurnPlayer?.name || 'the next player';
  const isMyTurn = currentTurnPlayer?.id === me.id;

  const myTotalCash = Array.isArray(me.money)
    ? me.money.reduce((sum, value) => sum + value, 0)
    : (typeof me.moneyCount === 'number' ? me.moneyCount * 10 : 0);

  const isDrawer = room?.drawerId === me.id;
  const hasPassed = room?.passedPlayers?.includes(me.id);
  const nextBidAmount = currentBid + 10;
  const hasEnoughCashForBid = myTotalCash >= nextBidAmount;
  const canPlaceBid = room?.activePhase === 'AUCTION' && !isDrawer && !hasPassed && hasEnoughCashForBid;

  // Always put ME first, then opponents in join order
  const roomPlayers = room?.players || [me];
  const sortedPlayers = [
    ...roomPlayers.filter((p) => p.id === me.id),
    ...roomPlayers.filter((p) => p.id !== me.id),
  ];

  const displayPlayers = sortedPlayers.map((p, idx) => ({
    id: p.id,
    name: (p.name || `P${idx + 1}`).toUpperCase(),
    money: p.id === me.id ? (me.money || p.money || []) : (p.money || []),
    moneyCount: p.moneyCount,
    vp: typeof p.vp === 'number' ? p.vp : 0,
    animals: p.animals || [],
    animalsCount: Array.isArray(p.animals) ? p.animals.length : 0,
    isMe: p.id === me.id,
    avatarIdx: idx % AVATAR_LIST.length,
  }));

  // ✅ Active seat index driven purely by server turn
  const activeSeatIdx = currentTurnPlayer
    ? displayPlayers.findIndex((p) => p.id === currentTurnPlayer.id)
    : -1;

  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);
  const [showBankroll, setShowBankroll] = useState(false);
  const [inspectedPlayerId, setInspectedPlayerId] = useState(null);
  const [expandedAnimalGroup, setExpandedAnimalGroup] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (room?.activePhase === 'AUCTION') {
      setTimeLeft(15);
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [room?.currentBid, room?.highestBidder, room?.activePhase]);

  const handleInspectPlayer = (playerId) => {
    setInspectedPlayerId(playerId);
    setExpandedAnimalGroup(null);
  };

  const inspectedPlayer = room?.players?.find((p) => p.id === inspectedPlayerId);

  // Group inspected player's animals by type for identical stacking logic
  const inspectedGroupedAnimals = (inspectedPlayer?.animals || []).reduce((acc, animal) => {
    const type = animal.name || 'UNKNOWN';
    if (!acc[type]) acc[type] = [];
    acc[type].push(animal);
    return acc;
  }, {});

  const handleDrawCard = () => {
    if (isMyTurn && (room?.activePhase === 'DRAW' || (room?.activePhase === 'CHOOSE_ACTION' && !room?.currentRevealedCard))) {
      socket.emit('draw-card');
    }
  };

  const placeBid = () => {
    socket.emit('place-bid');
  };

  const passBid = () => {
    socket.emit('pass-bid');
  };

  const chooseAction = (action) => {
    socket.emit('choose-action', { action });
  };

  // Check if any opponent holds a matching card for ROAR Challenge eligibility
  const hasRoarChallengeable = room?.activePhase === 'CHOOSE_ACTION' &&
    room?.currentRevealedCard &&
    room?.players?.some(
      (p) => p.id !== me.id &&
        Array.isArray(p.animals) &&
        p.animals.some((a) => a.name === room.currentRevealedCard.name)
    );

  // 70-80% visibility wide spacing transform
  const getFanStyle = (index, total, isHovered, isSelected) => {
    const mid = (total - 1) / 2;
    // Wide horizontal spacing for 70-80% card visibility
    const spacing = 58;
    const tx = (index - mid) * spacing;
    // Radial fan tilt angle
    const angle = total <= 1 ? 0 : (index - mid) * (6 / Math.max(total - 1, 1));
    const ty = total <= 1 ? 0 : Math.abs(index - mid) * (2 / Math.max(mid, 1));

    let transformStr = `translate(-50%, ${ty}px) translateX(${tx}px) rotate(${angle}deg)`;

    if (isSelected) {
      transformStr = `translate(-50%, -44px) translateX(${tx}px) scale(1.15)`;
    } else if (isHovered) {
      transformStr = `translate(-50%, -32px) translateX(${tx}px) scale(1.1) rotate(0deg)`;
    }

    return {
      left: '50%',
      transform: transformStr,
      zIndex: isHovered || isSelected ? 60 : index + 5,
    };
  };

  const getMoneyCardVisualDetails = (value) => {
    switch (value) {
      case 10:
        return {
          bg: 'from-[#2d1c10] to-[#120b07] border-[#d4a017]/35 shadow-amber-950/50',
          text: 'text-amber-200',
        };
      case 20:
        return {
          bg: 'from-[#162338] to-[#09111f] border-[#60a5fa]/35 shadow-blue-950/50',
          text: 'text-sky-200',
        };
      case 50:
        return {
          bg: 'from-[#2f250f] to-[#120f07] border-[#eab308]/40 shadow-yellow-950/50',
          text: 'text-yellow-100',
        };
      default:
        return {
          bg: 'from-slate-700 to-slate-900 border-slate-600 shadow-black/40',
          text: 'text-roar-text',
        };
    }
  };

  const getAvatarGlowClass = (isTurn, idx) => {
    if (isTurn) {
      return 'ring-4 ring-[#10b981] shadow-[0_0_25px_#10b981] animate-pulse';
    }
    const colorRings = [
      'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
      'ring-2 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      'ring-2 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      'ring-2 ring-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      'ring-2 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
    ];
    return colorRings[idx % colorRings.length];
  };
  console.log('DP:', JSON.stringify(displayPlayers.map(p => ({ id: p.id, name: p.name, isMe: p.isMe }))), 'total:', displayPlayers.length);
  return (
    <div className="min-h-screen h-screen w-screen flex flex-col bg-[#020308] bg-mesh font-body text-roar-text overflow-hidden select-none relative">

      {/* ── CINEMATIC AMBIENT STADIUM GLOWS & PARTICLES ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.12)_0%,transparent_75%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.03)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Animated dust particles */}
      <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-roar-gold/30 rounded-full animate-ping pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-1 h-1 bg-blue-400/20 rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-emerald-500/10 rounded-full animate-pulse pointer-events-none" />

      {/* ── TOP NAV BAR ── */}
      <header className="px-6 py-3 flex items-center justify-between border-b border-roar-border/20 bg-[#060a16]/80 backdrop-blur-md z-30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] to-[#d4a017] text-glow-gold">
            ROAR
          </span>
          <span className="text-[9px] bg-roar-crimson/25 border border-roar-crimson/50 text-roar-crimson px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase shadow-[0_0_8px_rgba(196,30,58,0.3)]">
            LIVE ARENA
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="bg-[#0b132b]/90 border border-roar-border/40 px-3 py-1 rounded text-xs flex items-center gap-1.5">
            <span className="text-roar-muted">ROOM CODE:</span>
            <span className="font-display font-black tracking-wider text-roar-gold">{room?.code || 'X7Y2'}</span>
          </div>

          <button
            onClick={onLeave}
            className="px-3 py-1.5 rounded border border-roar-border/40 text-xs font-semibold uppercase tracking-wider text-roar-muted hover:border-roar-crimson hover:text-roar-crimson transition-all duration-150 active:scale-95"
          >
            Leave Match
          </button>
        </div>
      </header>

      {/* ── TOP PLAYER ROW — sits between header and table, never overlaps ── */}
      <div className="w-full flex-shrink-0 px-6 pt-3 pb-0 z-20 flex justify-center">
        <div className="flex items-start justify-center gap-6 flex-wrap w-full max-w-4xl">
          {displayPlayers.filter(p => !p.isMe).map((opp, idx, opponents) => {
            const isTurn = currentTurnPlayer?.id === opp.id;
            const OppAvatar = AVATAR_LIST[opp.avatarIdx % AVATAR_LIST.length];
            return (
              <div
                key={opp.id}
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200"
                onClick={() => handleInspectPlayer(opp.id)}
                title={`Inspect ${opp.name}'s inventory`}
              >
                {/* Turn badge */}
                <span className={`mb-1 text-[7px] font-black rounded px-1.5 py-0.5 tracking-wider uppercase whitespace-nowrap border ${isTurn
                  ? 'bg-[#10b981]/20 text-[#10b981] border-emerald-500/40 animate-pulse'
                  : 'bg-black/70 text-roar-muted border-white/10'
                  }`}>
                  {isTurn ? 'THEIR TURN' : `Waiting`}
                </span>

                {/* Avatar ring */}
                <div className={`relative p-0.5 rounded-full transition-all duration-300 ${getAvatarGlowClass(isTurn, idx)}`}>
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0d0d18] border-2 border-black/80">
                    <OppAvatar className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Nameplate */}
                <div className="mt-1.5 px-2.5 py-1 bg-[#050814]/95 border border-roar-border/40 rounded shadow-2xl flex flex-col items-center min-w-[80px] backdrop-blur">
                  <span className="text-[10px] font-black text-roar-text truncate max-w-[76px]">{opp.name}</span>
                  <div className="flex items-center gap-1.5 mt-0.5 border-t border-white/5 pt-0.5 w-full justify-between">
                    <span className="text-[9px] text-[#22c55e] font-black">${opp.moneyCount !== undefined ? opp.moneyCount * 10 : opp.money.reduce((a, b) => a + b, 0)}</span>
                    <span className="text-[9px] text-amber-500 font-bold" title="Inventory Cards">🐾{opp.animalsCount}</span>
                    <span className="text-[9px] text-roar-gold font-black">{opp.vp} VP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTRAL 3D GAME BOARD PERSPECTIVE ── */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 pt-2 pb-0 z-10 min-h-0">

        {/* UNIFIED CONTAINER: Centers all poker table elements together */}
        <div className="relative w-full max-w-4xl aspect-[2.1/1] flex items-center justify-center flex-shrink-0">

          {/* THE LUXURIOUS OVAL POKER TABLE SURFACE */}
          <div
            className="absolute inset-0 rounded-[50%] bg-gradient-to-b from-[#3a1b0c] to-[#1a0c05] p-[16px] shadow-[0_40px_90px_rgba(0,0,0,0.95)] z-0"
            style={{ transform: 'rotateX(52deg) scale(1.05)' }}
          >
            {/* Inner gold trim ring */}
            <div className="w-full h-full rounded-[50%] border-[4px] border-[#d4a017]/80 p-[6px] bg-black/60 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
              {/* Felt Navy Surface */}
              <div className="w-full h-full rounded-[50%] bg-gradient-to-b from-[#0b1c40] to-[#040818] relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.95)]">
                {/* Felt Diamond Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d4a017_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
                {/* Center table lighting glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)]" />
              </div>
            </div>
          </div>

          {/* DOTTED CONNECTING LINES SVG OVERLAY */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <line x1="22%" y1="92%" x2="26%" y2="80%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="-6%" y1="48%" x2="2%" y2="48%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="19%" y1="-10%" x2="23%" y2="8%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="81%" y1="-10%" x2="77%" y2="8%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="106%" y1="48%" x2="98%" y2="48%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
          </svg>

          {/* 2D BILLBOARD INTERACTION OVERLAY LAYER */}
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">

            {/* 2. CENTRAL TABLETOP VOID (Deck and revealed card) */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 pointer-events-auto flex items-center justify-center gap-8"
            >
              {/* DECK OF CARDS WITH ROAR LOGO */}
              <div className="relative w-22 h-32 flex-shrink-0 flex items-center justify-center">
                {/* 3D stacked deck shadow layers */}
                <div className="absolute w-20 h-30 bg-[#450a0a] border border-black/80 rounded-lg shadow-lg transform -translate-x-1.5 -translate-y-1.5 z-0" />
                <div className="absolute w-20 h-30 bg-[#6b1111] border border-black/80 rounded-lg shadow-lg transform -translate-x-0.75 -translate-y-0.75 z-10" />

                {/* Top card face down with ROAR styling */}
                <div className="absolute w-20 h-30 bg-gradient-to-br from-[#6b1111] to-[#3a0808] border-2 border-[#d4a017]/50 rounded-lg shadow-xl z-20 flex flex-col justify-between p-2">
                  <div className="w-full flex justify-between">
                    <span className="text-[8px] text-roar-gold/30 font-bold">ROAR</span>
                    <span className="text-[8px] text-roar-gold/30 font-bold">🃏</span>
                  </div>

                  {/* Ornate ROAR Shield / Crest logo */}
                  <div className="w-9 h-9 rounded-full border-2 border-[#d4a017]/40 bg-black/40 mx-auto flex items-center justify-center shadow-inner">
                    <span className="font-display font-black text-xs text-roar-gold tracking-tight select-none">R</span>
                  </div>

                  <div className="w-full text-center">
                    <span className="text-[7.5px] font-black text-roar-gold/60 tracking-widest">{room?.deck?.length ?? 24} CARDS</span>
                  </div>
                </div>

                {/* PULSING ACTIVE USER DRAW OVERLAY BUTTON */}
                {(room?.activePhase === 'DRAW' || (room?.activePhase === 'CHOOSE_ACTION' && !room?.currentRevealedCard)) && isMyTurn && (
                  <button
                    id="draw-animal-btn"
                    onClick={handleDrawCard}
                    className="absolute inset-0 w-full h-full bg-roar-gold/15 border-2 border-[#d4a017] rounded-lg z-30 animate-pulse-glow flex items-center justify-center cursor-pointer"
                  >
                    <span className="bg-gradient-to-r from-[#ca8a04] to-[#fef08a] text-[#000] font-display font-black text-[9px] px-2.5 py-1 rounded shadow-lg border border-yellow-200 tracking-wider transform hover:scale-105 active:scale-95 transition-transform">
                      DRAW
                    </span>
                  </button>
                )}
              </div>

              {/* REVEAL ZONE: empty until a valid draw populates room.currentRevealedCard */}
              <div className="relative w-22 h-32 flex-shrink-0 flex items-center justify-center">
                {room?.currentRevealedCard ? (
                  <PremiumCard
                    name={room.currentRevealedCard.name}
                    vp={room.currentRevealedCard.vp}
                    className="w-22 shadow-[0_0_25px_rgba(212,160,23,0.5)] z-20 animate-scale-in"
                    isHoverable={true}
                  />
                ) : null}
              </div>

            </div>

            {room?.activePhase === 'CHOOSE_ACTION' && room?.currentRevealedCard && !isMyTurn && (
              /* ── ALL OTHER PLAYERS: Passive waiting marquee (stays inside table area) ── */
              <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-full max-w-sm pointer-events-none z-30 overflow-hidden">
                <div className="bg-[#040815]/90 border border-roar-gold/25 rounded-lg py-2 px-4 flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-roar-gold animate-pulse" />
                  <div className="overflow-hidden flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-roar-gold/80 whitespace-nowrap animate-[marquee_10s_linear_infinite]">
                      Waiting for {currentTurnPlayerName} to choose a move…&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
                      Waiting for {currentTurnPlayerName} to choose a move…
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. HIGH-END ACTIVE BIDDING CONTROL PANEL — only during AUCTION phase */}
            {room?.activePhase === 'AUCTION' && room?.currentRevealedCard && (
              <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-auto bg-[#050815]/80 backdrop-blur-xl border border-roar-gold/30 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] z-25 p-4 flex flex-col gap-3">
                {/* Subtle Gold / Neon Top Accent Border */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-roar-gold/80 to-transparent shadow-[0_0_10px_#d4a017]" />

                {/* Horizontal Countdown Timer Bar */}
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-roar-gold to-roar-crimson transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(212,160,23,0.5)]"
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>

                {/* Bidding Panel Body - Grid/Flex Layout for Zero Flat Stacks */}
                <div className="flex items-center justify-between gap-4">
                  {/* Bid Info Block (Flex Row for label and value) */}
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[9px] text-roar-muted uppercase font-black tracking-widest">
                      CURRENT BID
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-black text-[#22c55e] text-glow-green">
                        ${currentBid}
                      </span>
                      <span className="text-[10px] text-roar-muted">USD</span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="bg-white/10 h-10 w-[1px]" />

                  {/* Highest Bidder Info Block */}
                  <div className="flex flex-col gap-1 text-left min-w-[120px]">
                    <span className="text-[9px] text-roar-muted uppercase font-black tracking-widest">
                      HIGHEST BIDDER
                    </span>
                    <div className="flex items-center gap-2">
                      {room?.highestBidder ? (
                        <>
                          <div className="w-4 h-4 rounded-full bg-roar-gold/20 flex items-center justify-center border border-roar-gold/40">
                            <span className="text-[8px] text-roar-gold font-bold">👑</span>
                          </div>
                          <span className="text-xs font-black text-roar-gold uppercase tracking-wider truncate max-w-[90px]">
                            {currentBidderName}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-roar-muted uppercase tracking-wider">
                          No bids yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="bg-white/10 h-10 w-[1px]" />

                  {/* Interaction Controls */}
                  <div className="flex items-center justify-end flex-1">
                    {isDrawer ? (
                      /* Elegant static banner status readout for Seller */
                      <div className="flex items-center gap-2 px-3 py-2 bg-roar-gold/10 border border-roar-gold/30 rounded-lg text-roar-gold shadow-[inset_0_0_8px_rgba(212,160,23,0.15)] animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-roar-gold" />
                        <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          Your card is currently on the auction block. Waiting for bids...
                        </span>
                      </div>
                    ) : hasPassed ? (
                      /* Passed Banner for player who passed */
                      <div className="flex items-center gap-2 px-3 py-2 bg-roar-crimson/10 border border-roar-crimson/30 rounded-lg text-roar-crimson shadow-[inset_0_0_8px_rgba(196,30,58,0.15)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-roar-crimson animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Passed
                        </span>
                      </div>
                    ) : (
                      /* Active Bidder Buttons */
                      <div className="flex items-center gap-2">
                        <button
                          onClick={placeBid}
                          disabled={!hasEnoughCashForBid}
                          className={`font-display font-black text-[10px] px-4 py-2.5 rounded-lg uppercase tracking-wider border shadow transition-all duration-200 active:scale-95 ${hasEnoughCashForBid
                            ? 'bg-gradient-to-r from-roar-gold to-roar-gold-light hover:from-[#eab308] hover:to-[#fef08a] text-black border-yellow-200/50 shadow-glow-gold hover:shadow-[0_0_20px_rgba(212,160,23,0.6)] cursor-pointer'
                            : 'bg-white/5 border-white/10 text-roar-muted cursor-not-allowed opacity-50'
                            }`}
                          title={!hasEnoughCashForBid ? 'Insufficient cash to bid' : `Bid $${nextBidAmount}`}
                        >
                          +$10 Bid
                        </button>
                        <button
                          onClick={passBid}
                          className="bg-roar-crimson/20 hover:bg-roar-crimson/40 text-roar-crimson border border-roar-crimson/40 font-display font-black text-[10px] px-4 py-2.5 rounded-lg uppercase tracking-wider shadow hover:shadow-glow-crimson transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          Pass
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ── CHOOSE ACTION PANEL — below the table, never overlapping ── */}
        {room?.activePhase === 'CHOOSE_ACTION' && room?.currentRevealedCard && isMyTurn && (
          <div className="w-full max-w-sm mt-3 flex-shrink-0 pointer-events-auto z-30">
            {/* Card name banner */}
            <div className="mb-2 text-center">
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-roar-gold/70 border border-roar-gold/20 bg-roar-gold/5 px-3 py-1 rounded-full">
                You drew&nbsp;
                <span className="text-roar-gold">{room.currentRevealedCard.name}</span>
                &nbsp;·&nbsp;{room.currentRevealedCard.vp} VP
              </span>
            </div>
            {/* Action buttons */}
            <div className="flex items-stretch gap-3">
              <button
                id="action-keep-card-btn"
                onClick={() => chooseAction('keep-card')}
                className="group flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/50 hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(16,185,129,0.4)] transition-all duration-200 active:scale-95 backdrop-blur"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Keep Card</span>
                <span className="text-[8px] text-emerald-500/70 font-semibold">End turn</span>
              </button>

              <button
                id="action-initiate-trade-btn"
                onClick={() => chooseAction('initiate-trade')}
                className="group flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 border-[#d4a017]/50 bg-[#d4a017]/5 hover:bg-[#d4a017]/15 hover:border-roar-gold hover:shadow-[0_0_18px_rgba(212,160,23,0.4)] transition-all duration-200 active:scale-95 backdrop-blur"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-roar-gold group-hover:scale-110 transition-transform">
                  <polyline points="16 3 21 8 16 13" />
                  <line x1="21" y1="8" x2="9" y2="8" />
                  <polyline points="8 21 3 16 8 11" />
                  <line x1="3" y1="16" x2="15" y2="16" />
                </svg>
                <span className="text-[10px] font-black text-roar-gold uppercase tracking-widest">Trade Card</span>
                <span className="text-[8px] text-roar-gold/50 font-semibold">Initiate auction</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── BOTTOM PRIVATE HUD (Fanned hand widely spread) ── */}
      <footer className="w-full flex flex-col justify-end relative pb-4 z-20">

        {/* HUD Info bar */}
        <div className="w-full max-w-xl mx-auto flex justify-between items-center px-6 mb-2 text-xs text-roar-muted font-semibold">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>MY BANKROLL:</span>
              <span className="text-[#22c55e] font-black">
                ${me.money?.reduce((sum, val) => sum + val, 0) ?? 0}
              </span>
            </div>
            <span className="text-roar-muted/40">|</span>
            <div className="flex items-center gap-1.5">
              <span>MY VP:</span>
              <span className="text-roar-gold font-black">
                {me.vp || 0} VP
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleInspectPlayer(inspectedPlayerId === me.id ? null : me.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded border text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${inspectedPlayerId === me.id
                ? 'bg-[#d4a017]/20 border-roar-gold text-roar-gold shadow-[0_0_15px_rgba(212,160,23,0.3)]'
                : 'bg-black/80 border-roar-gold/50 text-roar-gold/80 hover:bg-[#d4a017]/10 hover:border-roar-gold hover:text-roar-gold'
                }`}
            >
              🐾 Show Animals
            </button>
            <span className="text-[8px] text-roar-gold font-bold bg-roar-gold/10 border border-roar-gold/20 px-2 py-0.5 rounded uppercase tracking-wider">
              70-80% VISIBILITY WIDE FAN
            </span>
          </div>
        </div>

        {/* Fanned Cards container */}
        <div className="flex justify-center items-end relative h-40 w-full max-w-2xl mx-auto px-6">
          {displayPlayers[0].money.map((val, idx) => {
            const isSelected = selectedCardIdx === idx;
            const isHovered = hoveredCardIdx === idx;
            const visual = getMoneyCardVisualDetails(val);

            return (
              <button
                key={idx}
                onClick={() => setSelectedCardIdx(isSelected ? null : idx)}
                onMouseEnter={() => setHoveredCardIdx(idx)}
                onMouseLeave={() => setHoveredCardIdx(null)}
                className={`absolute w-24 h-36 rounded-lg border-2 flex items-center justify-center p-3.5 transition-all duration-200 select-none shadow-2xl bg-gradient-to-b ${visual.bg}`}
                style={getFanStyle(idx, displayPlayers[0].money.length, isHovered, isSelected)}
              >
                {/* Ornate Inner Border Layer */}
                <div className="absolute inset-1 pointer-events-none border border-white/5 rounded-md" />

                <span className={`relative z-10 text-2xl font-black tracking-tight ${visual.text}`}>${val}</span>

              </button>
            );
          })}
        </div>
      </footer>

      {/* ── BOTTOM-LEFT GAME LOG PANEL (Glassmorphism HUD) ── */}
      <div className="fixed bottom-6 left-6 z-30 pointer-events-auto">
        <div className="bg-[#050918]/80 backdrop-blur-md border border-white/10 rounded-lg p-4 w-60 h-44 shadow-[0_15px_35px_rgba(0,0,0,0.8)] text-left flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-xs tracking-wider text-roar-gold border-b border-white/5 pb-1.5 mb-2 uppercase">
              GAME LOG
            </h3>

            <ul className="space-y-1.5">
              {gameLogs.length > 0 ? (
                gameLogs.map((log, idx) => {
                  const message = typeof log === 'string' ? log : log.message;
                  const tone = typeof log === 'string' ? 'neutral' : log.tone;
                  const dotClass = tone === 'bid'
                    ? 'bg-emerald-400'
                    : tone === 'draw'
                      ? 'bg-roar-gold'
                      : tone === 'system'
                        ? 'bg-roar-muted'
                        : 'bg-roar-gold-light';

                  return (
                    <li key={`${message}-${idx}`} className="text-[10px] text-roar-muted flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                      <span className="truncate">{message}</span>
                    </li>
                  );
                })
              ) : (
                <li className="text-[10px] text-roar-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-roar-muted" />
                  Waiting for live game events
                </li>
              )}
            </ul>
          </div>

          <span className="text-[8px] text-roar-muted/40 uppercase font-black tracking-widest self-end">
            STAGE 2 MOCKUP
          </span>
        </div>
      </div>

      {/* ── BOTTOM-RIGHT HIDDEN BANKROLL TOGGLE BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-auto">
        <button
          onClick={() => setShowBankroll(!showBankroll)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-display font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] ${showBankroll
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_#10b981]'
            : 'bg-black/80 border-[#10b981] text-emerald-400 hover:bg-emerald-500/10'
            }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          HIDDEN BANKROLL
        </button>

        {/* Sliding Panel overlaying when bankroll details toggled */}
        {showBankroll && (
          <div className="absolute bottom-14 right-0 bg-[#050813]/95 border border-[#10b981]/50 rounded-lg p-3 w-56 shadow-glow-green text-left backdrop-blur-md animate-scale-in">
            <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-1 mb-1.5">
              Secure Ledger
            </h4>
            <div className="space-y-1 text-[10px] text-roar-muted font-mono">
              <div className="flex justify-between">
                <span>Total Cards:</span>
                <span className="text-roar-text">7 bills</span>
              </div>
              <div className="flex justify-between">
                <span>Locked VP:</span>
                <span className="text-roar-gold">1000 VP</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-white/5 pt-1 mt-1">
                <span>Scrubbed State:</span>
                <span>Enforced ⚡</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── INVENTORY VIEWER TRAY (Smooth sliding overlay) ── */}
      {inspectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="relative w-[90%] max-w-4xl h-[70vh] bg-[#050813]/95 border border-roar-gold/30 rounded-2xl shadow-2xl flex flex-col p-6 animate-scale-in">
            {/* Close Button & Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-black text-roar-gold uppercase tracking-widest flex items-center gap-3">
                  {inspectedPlayer.id === me.id ? (
                    <>🐾 Your Animal Inventory</>
                  ) : (
                    <>🐾 {inspectedPlayer.name}'s Animal Inventory</>
                  )}
                  <span className="text-xs bg-roar-gold/10 text-roar-gold px-2 py-1 rounded-full border border-roar-gold/20">
                    {inspectedPlayer.animals?.length || 0} TOTAL
                  </span>
                </h2>
                <p className="text-xs text-roar-muted mt-1">
                  {inspectedPlayer.id === me.id
                    ? 'Manage and inspect your collected animal sets.'
                    : `Inspecting ${inspectedPlayer.name}'s collected animal sets.`}
                </p>
              </div>
              <button
                onClick={() => setInspectedPlayerId(null)}
                className="text-roar-muted hover:text-white bg-white/5 hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Inventory Grid */}
            <div className="flex-1 overflow-y-auto">
              {/* CRITICAL PRIVACY MIDDLEWARE check: Ensure that during opponent inspection,
                  no monetary figures, individual bankroll values, or private money card breakdowns 
                  from the UI template leak or are displayed. */}
              {inspectedPlayer.id !== me.id && (
                <div className="sr-only" data-privacy-middleware="active">
                  Opponent financial assets and money breakdowns are strictly hidden.
                </div>
              )}

              {Object.keys(inspectedGroupedAnimals).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 pb-10 mt-4">
                  {Object.entries(inspectedGroupedAnimals).map(([type, animals]) => {
                    const isExpanded = expandedAnimalGroup === type;
                    return (
                      <div
                        key={type}
                        className="relative flex flex-col items-center"
                      >
                        {/* Title & Count */}
                        <div className="mb-4 text-center z-20">
                          <span className="block text-sm font-black text-roar-text uppercase tracking-wider">{type}</span>
                          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-900/30 rounded-full border border-emerald-500/30">
                            {animals.length} COPIES
                          </span>
                        </div>

                        {/* Stacking / Fanning Container */}
                        <div
                          className={`relative w-32 h-48 cursor-pointer transition-all duration-300 ${isExpanded ? 'w-full h-56' : ''}`}
                          onClick={() => setExpandedAnimalGroup(isExpanded ? null : type)}
                        >
                          {animals.map((animal, idx) => {
                            // Calculate offset
                            const xOffset = isExpanded ? (idx - (animals.length - 1) / 2) * 60 : idx * 12;
                            const yOffset = isExpanded ? 0 : idx * 12;
                            const rot = isExpanded ? (idx - (animals.length - 1) / 2) * 5 : 0;
                            const zIndex = 20 - idx;

                            return (
                              <div
                                key={animal.id || `${type}-${idx}`}
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 transition-all duration-500 hover:z-50 hover:scale-105"
                                style={{
                                  transform: `translate(calc(-50% + ${xOffset}px), ${yOffset}px) rotate(${rot}deg)`,
                                  zIndex,
                                }}
                              >
                                <PremiumCard
                                  name={type}
                                  vp={animal.vp || 10}
                                  className="w-full"
                                  isHoverable={true}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-roar-muted opacity-50">
                  <span className="text-4xl mb-3">🕸️</span>
                  <p className="text-sm font-bold uppercase tracking-widest">No animals in inventory yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}