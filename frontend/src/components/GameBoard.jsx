import { useState, useEffect } from 'react';
import PremiumCard from './PremiumCard';
import { ANIMAL_IMAGES } from './PremiumCard';

const MOCKUP_AVATARS = [
  ANIMAL_IMAGES.tiger,
  ANIMAL_IMAGES.lion,
  ANIMAL_IMAGES.gorilla,
  ANIMAL_IMAGES.falcon,
  ANIMAL_IMAGES.cobra
];

export default function GameBoard({ room, player, socket, onLeave }) {
  const me = room?.players?.find((p) => p.id === player.id) || player;
  const gameLogs = room?.logs ?? [];
  const currentBid = typeof room?.currentBid === 'number' ? room.currentBid : 0;

  const highestBidderPlayer = room?.players?.find((p) => p.id === room.highestBidder);
  const currentBidderName = highestBidderPlayer
    ? (highestBidderPlayer.id === me.id ? 'YOU' : highestBidderPlayer.name)
    : '—';

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
    avatarIdx: idx % MOCKUP_AVATARS.length,
  }));

  const activeSeatIdx = currentTurnPlayer
    ? displayPlayers.findIndex((p) => p.id === currentTurnPlayer.id)
    : -1;

  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);
  const [showBankroll, setShowBankroll] = useState(false);
  const [inspectedPlayerId, setInspectedPlayerId] = useState(null);
  const [expandedAnimalGroup, setExpandedAnimalGroup] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  // Duel States
  const [duelTargetPlayerId, setDuelTargetPlayerId] = useState(null);
  const [duelTargetAnimal, setDuelTargetAnimal] = useState(null);
  const [duelCardCount, setDuelCardCount] = useState(1);
  const [duelOfferIndices, setDuelOfferIndices] = useState([]);

  // Duel Computed
  const isChallenger = room?.duel?.challengerId === me.id;
  const isDefender = room?.duel?.defenderId === me.id;
  const isDuelist = isChallenger || isDefender;
  
  const myAnimalsGrouped = (me.animals || []).reduce((acc, animal) => {
    acc[animal.name] = (acc[animal.name] || 0) + 1;
    return acc;
  }, {});

  const opponentTargets = displayPlayers.filter(p => !p.isMe).map(opp => {
    const oppAnimalsGrouped = (opp.animals || []).reduce((acc, animal) => {
      acc[animal.name] = (acc[animal.name] || 0) + 1;
      return acc;
    }, {});
    const sharedAnimals = Object.keys(myAnimalsGrouped).filter(type => oppAnimalsGrouped[type] > 0);
    return { ...opp, oppAnimalsGrouped, sharedAnimals };
  }).filter(opp => opp.sharedAnimals.length > 0);

  const selectedTarget = opponentTargets.find(o => o.id === duelTargetPlayerId);
  const maxDuelCards = selectedTarget && duelTargetAnimal 
    ? Math.min(myAnimalsGrouped[duelTargetAnimal], selectedTarget.oppAnimalsGrouped[duelTargetAnimal]) 
    : 1;

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

  const placeBid = () => socket.emit('place-bid');
  const passBid = () => socket.emit('pass-bid');
  const chooseAction = (action) => socket.emit('choose-action', { action });

  const handleInitiateDuel = () => {
    if (duelTargetPlayerId && duelTargetAnimal) {
      socket.emit('initiate-duel', {
        targetPlayerId: duelTargetPlayerId,
        animalName: duelTargetAnimal,
        cardCount: duelCardCount
      });
      setDuelTargetPlayerId(null);
      setDuelTargetAnimal(null);
      setDuelCardCount(1);
    }
  };

  const handleCommitDuelOffer = () => {
    const offerSubset = duelOfferIndices.map(idx => me.money[idx]);
    socket.emit('commit-duel-offer', { offerSubset });
    setDuelOfferIndices([]);
  };

  const hasRoarChallengeable = room?.activePhase === 'CHOOSE_ACTION' &&
    room?.currentRevealedCard &&
    room?.players?.some(
      (p) => p.id !== me.id &&
        Array.isArray(p.animals) &&
        p.animals.some((a) => a.name === room.currentRevealedCard.name)
    );

  const getFanStyle = (index, total, isHovered, isSelected) => {
    const mid = (total - 1) / 2;
    const spacing = 58;
    const tx = (index - mid) * spacing;
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
      case 10: return {
        bg: 'from-[#2d1c10] to-[#120b07] border-[#d4a017]/35 shadow-amber-950/50',
        text: 'text-amber-200',
      };
      case 20: return {
        bg: 'from-[#162338] to-[#09111f] border-[#60a5fa]/35 shadow-blue-950/50',
        text: 'text-sky-200',
      };
      case 50: return {
        bg: 'from-[#2f250f] to-[#120f07] border-[#eab308]/40 shadow-yellow-950/50',
        text: 'text-yellow-100',
      };
      default: return {
        bg: 'from-slate-700 to-slate-900 border-slate-600 shadow-black/40',
        text: 'text-roar-text',
      };
    }
  };

  const getAvatarGlowClass = (isTurn, idx) => {
    if (isTurn) return 'ring-4 ring-[#10b981] shadow-[0_0_25px_#10b981] animate-pulse';
    const colorRings = [
      'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
      'ring-2 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      'ring-2 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      'ring-2 ring-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      'ring-2 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    ];
    return colorRings[idx % colorRings.length];
  };

  // ── Phase indicators for card/action area
  const showChooseAction = room?.activePhase === 'CHOOSE_ACTION' && room?.currentRevealedCard && isMyTurn;
  const showWaiting = room?.activePhase === 'CHOOSE_ACTION' && room?.currentRevealedCard && !isMyTurn;

  return (
    <div className="min-h-screen h-screen w-screen flex flex-col bg-[#020308] bg-mesh font-body text-roar-text overflow-hidden select-none relative">

      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.12)_0%,transparent_75%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.03)_0%,transparent_60%)] pointer-events-none z-0" />
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

      {/* ── MAIN GAME AREA ── */}
      <main className="flex-1 w-full relative flex flex-col items-center justify-center px-4 pt-6 pb-0 z-10 min-h-0">

        {/* ── OPPONENT PLAYERS AROUND THE TABLE ── */}
        {displayPlayers.filter(p => !p.isMe).map((opp, idx, opponents) => {
          const isTurn = currentTurnPlayer?.id === opp.id;
          const avatarSrc = MOCKUP_AVATARS[opp.avatarIdx % MOCKUP_AVATARS.length];

          let positionClasses = 'relative m-2';
          const total = opponents.length;
          if (total === 1) {
            positionClasses = 'absolute top-4 left-1/2 -translate-x-1/2';
          } else if (total === 2) {
            positionClasses = idx === 0
              ? 'absolute top-1/2 left-8 -translate-y-1/2'
              : 'absolute top-1/2 right-8 -translate-y-1/2';
          } else if (total === 3) {
            if (idx === 0) positionClasses = 'absolute top-1/2 left-8 -translate-y-1/2';
            else if (idx === 1) positionClasses = 'absolute top-4 left-1/2 -translate-x-1/2';
            else positionClasses = 'absolute top-1/2 right-8 -translate-y-1/2';
          } else {
            if (idx === 0) positionClasses = 'absolute top-1/2 left-[2%] -translate-y-1/2';
            else if (idx === 1) positionClasses = 'absolute top-2 left-[25%] -translate-x-1/2';
            else if (idx === 2) positionClasses = 'absolute top-0 left-[50%] -translate-x-1/2';
            else if (idx === 3) positionClasses = 'absolute top-2 left-[75%] -translate-x-1/2';
            else positionClasses = 'absolute top-1/2 right-[2%] -translate-y-1/2';
          }

          return (
            <div
              key={opp.id}
              className={`flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200 z-30 ${positionClasses}`}
              onClick={() => handleInspectPlayer(opp.id)}
              title={`Inspect ${opp.name}'s inventory`}
            >
              {/* Turn badge */}
              <span className={`mb-1 text-[7px] font-black rounded px-1.5 py-0.5 tracking-wider uppercase whitespace-nowrap border ${isTurn
                ? 'bg-[#10b981]/20 text-[#10b981] border-emerald-500/40 animate-pulse'
                : 'bg-black/70 text-roar-muted border-white/10'}`}
              >
                {isTurn ? 'THEIR TURN' : 'WAITING'}
              </span>

              {/* Avatar with card-count badge */}
              <div className={`relative p-0.5 rounded-full transition-all duration-300 ${getAvatarGlowClass(isTurn, idx)}`}>
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0d0d18] border-2 border-black/80">
                  <img src={avatarSrc} alt={opp.name} className="w-full h-full object-cover" />
                </div>
                {/* Card count badge */}
                {opp.animalsCount > 0 && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#d4a017] border-2 border-[#020308] flex items-center justify-center z-10">
                    <span className="text-[8px] font-black text-black">{opp.animalsCount}</span>
                  </div>
                )}
              </div>

              {/* Nameplate */}
              <div className="mt-1.5 px-2.5 py-1 bg-[#050814]/95 border border-roar-border/40 rounded shadow-2xl flex flex-col items-center min-w-[80px] backdrop-blur">
                <span className="text-[10px] font-black text-roar-text truncate max-w-[76px]">{opp.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5 border-t border-white/5 pt-0.5 w-full justify-between">
                  <span className="text-[9px] text-[#22c55e] font-black">
                    ${opp.moneyCount !== undefined ? opp.moneyCount * 10 : opp.money.reduce((a, b) => a + b, 0)}
                  </span>
                  <span className="text-[9px] text-roar-gold font-black">{opp.vp} VP</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── OVAL POKER TABLE ── */}
        <div className="relative w-full max-w-4xl aspect-[2.1/1] flex items-center justify-center flex-shrink-0">

          {/* 3D Table Surface */}
          <div
            className="absolute inset-0 rounded-[50%] bg-gradient-to-b from-[#3a1b0c] to-[#1a0c05] p-[16px] shadow-[0_40px_90px_rgba(0,0,0,0.95)] z-0"
            style={{ transform: 'rotateX(38deg) scale(1.05)' }}
          >
            <div className="w-full h-full rounded-[50%] border-[4px] border-[#d4a017]/80 p-[6px] bg-black/60 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
              <div className="w-full h-full rounded-[50%] bg-gradient-to-b from-[#0b1c40] to-[#040818] relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.95)]">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d4a017_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)]" />
              </div>
            </div>
          </div>

          {/* Connector lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <line x1="22%" y1="92%" x2="26%" y2="80%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="-6%" y1="48%" x2="2%" y2="48%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="19%" y1="-10%" x2="23%" y2="8%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="81%" y1="-10%" x2="77%" y2="8%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
            <line x1="106%" y1="48%" x2="98%" y2="48%" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
          </svg>

          {/* ── 2D BILLBOARD OVERLAY (deck + revealed card) ── */}
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">

            {/* CENTRAL VOID: Deck + Revealed Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] pointer-events-auto flex items-center justify-center gap-10">

              {/* DECK */}
              <div className="relative w-24 h-36 flex-shrink-0 flex items-center justify-center">
                <div className="absolute w-20 h-[112px] bg-[#450a0a] border border-black/80 rounded-lg shadow-lg transform -translate-x-1.5 -translate-y-1.5 z-0" />
                <div className="absolute w-20 h-[112px] bg-[#6b1111] border border-black/80 rounded-lg shadow-lg transform -translate-x-0.5 -translate-y-0.5 z-10" />
                <div className="absolute w-20 h-[112px] bg-gradient-to-br from-[#6b1111] to-[#3a0808] border-2 border-[#d4a017]/50 rounded-lg shadow-xl z-20 flex flex-col justify-between p-2">
                  <div className="w-full flex justify-between">
                    <span className="text-[8px] text-roar-gold/30 font-bold">ROAR</span>
                    <span className="text-[8px] text-roar-gold/30 font-bold">🃏</span>
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-[#d4a017]/40 bg-black/40 mx-auto flex items-center justify-center shadow-inner">
                    <span className="font-display font-black text-xs text-roar-gold tracking-tight select-none">R</span>
                  </div>
                  <div className="w-full text-center">
                    <span className="text-[7.5px] font-black text-roar-gold/60 tracking-widest">{room?.deck?.length ?? 24} CARDS</span>
                  </div>
                </div>

                {/* DRAW BUTTON overlay */}
                {(room?.activePhase === 'DRAW' || (room?.activePhase === 'CHOOSE_ACTION' && !room?.currentRevealedCard)) && isMyTurn && (
                  <button
                    onClick={handleDrawCard}
                    className="absolute inset-0 w-full h-full bg-roar-gold/15 border-2 border-[#d4a017] rounded-lg z-30 animate-pulse-glow flex items-center justify-center cursor-pointer"
                  >
                    <span className="bg-gradient-to-r from-[#ca8a04] to-[#fef08a] text-[#000] font-display font-black text-[9px] px-2.5 py-1 rounded shadow-lg border border-yellow-200 tracking-wider transform hover:scale-105 active:scale-95 transition-transform">
                      DRAW
                    </span>
                  </button>
                )}
              </div>

              {/* ✅ REVEALED CARD — now properly sized, no overflow bug */}
              <div className="relative w-44 flex-shrink-0 flex items-center justify-center">
                {room?.currentRevealedCard ? (
                  <PremiumCard
                    name={room.currentRevealedCard.name}
                    vp={room.currentRevealedCard.vp}
                    className="w-44 shadow-[0_0_60px_rgba(212,160,23,0.5)] z-20 animate-scale-in"
                    isHoverable={false}
                  />
                ) : null}
              </div>
            </div>

            {/* AUCTION PANEL — stays inside table overlay, at the bottom */}
            {room?.activePhase === 'AUCTION' && room?.currentRevealedCard && (
              <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-auto bg-[#050815]/80 backdrop-blur-xl border border-roar-gold/30 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] z-25 p-4 flex flex-col gap-3">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-roar-gold/80 to-transparent shadow-[0_0_10px_#d4a017]" />
                {/* Timer bar */}
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-roar-gold to-roar-crimson transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(212,160,23,0.5)]"
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-roar-muted uppercase font-black tracking-widest">CURRENT BID</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-black text-[#22c55e] text-glow-green">${currentBid}</span>
                      <span className="text-[10px] text-roar-muted">USD</span>
                    </div>
                  </div>
                  <div className="bg-white/10 h-10 w-[1px]" />
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-[9px] text-roar-muted uppercase font-black tracking-widest">HIGHEST BIDDER</span>
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
                        <span className="text-xs font-bold text-roar-muted uppercase tracking-wider">No bids yet</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/10 h-10 w-[1px]" />
                  <div className="flex items-center justify-end flex-1">
                    {isDrawer ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-roar-gold/10 border border-roar-gold/30 rounded-lg text-roar-gold shadow-[inset_0_0_8px_rgba(212,160,23,0.15)] animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-roar-gold" />
                        <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          Your card is on the block…
                        </span>
                      </div>
                    ) : hasPassed ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-roar-crimson/10 border border-roar-crimson/30 rounded-lg text-roar-crimson">
                        <span className="w-1.5 h-1.5 rounded-full bg-roar-crimson animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Passed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={placeBid}
                          disabled={!hasEnoughCashForBid}
                          className={`font-display font-black text-[10px] px-4 py-2.5 rounded-lg uppercase tracking-wider border shadow transition-all duration-200 active:scale-95 ${hasEnoughCashForBid
                              ? 'bg-gradient-to-r from-roar-gold to-roar-gold-light hover:from-[#eab308] hover:to-[#fef08a] text-black border-yellow-200/50 shadow-glow-gold cursor-pointer'
                              : 'bg-white/5 border-white/10 text-roar-muted cursor-not-allowed opacity-50'
                            }`}
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

        {/* ── CHOOSE ACTION PANEL — below the table, like Image 2 ── */}
        {showChooseAction && (
          <div className="mt-3 flex flex-col items-center gap-3 z-30 pointer-events-auto">
            <div className="flex items-stretch justify-center gap-4">
              {/* Keep Card */}
              <button
                onClick={() => chooseAction('keep-card')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl border border-emerald-500/50 bg-[#041e12]/95 hover:bg-[#062f1c]/95 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] backdrop-blur active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-emerald-400 flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Keep Card</span>
                  <span className="text-[7px] text-emerald-500/70 font-semibold uppercase mt-0.5">Keep this card</span>
                </div>
              </button>

              {/* Trade Card */}
              <button
                onClick={() => chooseAction('initiate-trade')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl border border-[#d4a017]/50 bg-[#291708]/95 hover:bg-[#3d230b]/95 transition-all shadow-[0_4px_20px_rgba(212,160,23,0.3)] backdrop-blur active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-roar-gold flex-shrink-0">
                  <polyline points="16 3 21 8 16 13" />
                  <line x1="21" y1="8" x2="9" y2="8" />
                  <polyline points="8 21 3 16 8 11" />
                  <line x1="3" y1="16" x2="15" y2="16" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-black text-roar-gold uppercase tracking-widest">Trade Card</span>
                  <span className="text-[7px] text-roar-gold/60 font-semibold uppercase mt-0.5">Trade for new card</span>
                </div>
              </button>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 text-[#10b981]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#10b981]/70">
                <span className="text-emerald-400">18s</span> TIME LEFT
              </span>
            </div>
          </div>
        )}

        {/* ── WAITING MARQUEE — below table when it's not my turn ── */}
        {showWaiting && (
          <div className="mt-3 w-full max-w-sm z-30 overflow-hidden pointer-events-none">
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

      </main>

      {/* ── BOTTOM PRIVATE HUD ── */}
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
              <span className="text-roar-gold font-black">{me.vp || 0} VP</span>
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
              70-80% VISIBILITY MODE
            </span>
          </div>
        </div>

        {/* Fanned money cards */}
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
                <div className="absolute inset-1 pointer-events-none border border-white/5 rounded-md" />
                <span className={`relative z-10 text-2xl font-black tracking-tight ${visual.text}`}>${val}</span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* ── BOTTOM-LEFT GAME LOG ── */}
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
          <span className="text-[8px] text-roar-muted/40 uppercase font-black tracking-widest self-end">STAGE 2</span>
        </div>
      </div>

      {/* ── BOTTOM-RIGHT HIDDEN BANKROLL ── */}
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

      {/* ── DUEL TARGET SELECTION OVERLAY ── */}
      {room?.activePhase === 'DUEL_TARGET_SELECTION' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          {isMyTurn ? (
            <div className="relative w-[90%] max-w-4xl bg-[#050813]/95 border border-roar-crimson/50 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col p-6 animate-scale-in">
              <h2 className="text-2xl font-display font-black text-roar-crimson uppercase tracking-widest text-center mb-6">
                Initiate Trade Duel
              </h2>
              {opponentTargets.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {/* Select Target */}
                  <div>
                    <h3 className="text-sm font-bold text-roar-muted uppercase tracking-wider mb-3 text-center">Select Target</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {opponentTargets.map(opp => (
                        <button
                          key={opp.id}
                          onClick={() => { setDuelTargetPlayerId(opp.id); setDuelTargetAnimal(null); }}
                          className={`px-4 py-2 border rounded-xl flex items-center gap-2 transition-all ${duelTargetPlayerId === opp.id ? 'border-roar-crimson bg-roar-crimson/20' : 'border-white/10 bg-black/50 hover:border-white/30'}`}
                        >
                          <img src={MOCKUP_AVATARS[opp.avatarIdx % MOCKUP_AVATARS.length]} alt={opp.name} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-bold text-sm text-white uppercase">{opp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Animal */}
                  {selectedTarget && (
                    <div>
                      <h3 className="text-sm font-bold text-roar-muted uppercase tracking-wider mb-3 text-center">Select Animal to Duel</h3>
                      <div className="flex flex-wrap justify-center gap-4">
                        {selectedTarget.sharedAnimals.map(animal => (
                          <button
                            key={animal}
                            onClick={() => { setDuelTargetAnimal(animal); setDuelCardCount(1); }}
                            className={`px-6 py-3 border rounded-xl flex flex-col items-center gap-1 transition-all ${duelTargetAnimal === animal ? 'border-roar-gold bg-roar-gold/20' : 'border-white/10 bg-black/50 hover:border-white/30'}`}
                          >
                            <span className="font-black text-lg text-roar-gold uppercase">{animal}</span>
                            <span className="text-xs text-roar-muted">They have {selectedTarget.oppAnimalsGrouped[animal]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Select Quantity & Initiate */}
                  {selectedTarget && duelTargetAnimal && (
                    <div className="flex flex-col items-center gap-4 mt-4">
                      {maxDuelCards > 1 && (
                        <div className="flex items-center gap-3 bg-black/50 p-2 rounded-lg border border-white/10">
                          <span className="text-xs font-bold text-roar-muted uppercase">Quantity:</span>
                          <button onClick={() => setDuelCardCount(1)} className={`w-8 h-8 rounded font-bold ${duelCardCount === 1 ? 'bg-roar-gold text-black' : 'bg-white/10 text-white'}`}>1</button>
                          <button onClick={() => setDuelCardCount(2)} className={`w-8 h-8 rounded font-bold ${duelCardCount === 2 ? 'bg-roar-gold text-black' : 'bg-white/10 text-white'}`}>2</button>
                        </div>
                      )}
                      <button
                        onClick={handleInitiateDuel}
                        className="px-10 py-4 rounded-xl bg-gradient-to-r from-roar-crimson to-red-600 hover:from-red-500 hover:to-red-700 text-white font-black text-lg uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 transition-all"
                      >
                        Challenge to Duel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-roar-muted text-sm font-bold flex flex-col items-center gap-4">
                  <span>No opponents have overlapping animals. You cannot initiate a duel.</span>
                  <button onClick={() => socket.emit('pass-duel')} className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/5 uppercase font-black text-xs">Pass Turn</button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#040815]/90 border border-roar-crimson/50 rounded-lg py-3 px-6 flex items-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.4)] backdrop-blur">
              <span className="flex-shrink-0 w-3 h-3 rounded-full bg-roar-crimson animate-pulse" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-roar-crimson/80 whitespace-nowrap">
                {currentTurnPlayerName} is selecting a duel target...
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── DUEL BIDDING OVERLAY ── */}
      {room?.activePhase === 'DUEL_BIDDING' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
          {isDuelist ? (
            <div className="relative w-[90%] max-w-4xl bg-[#050813]/95 border border-roar-gold/50 rounded-2xl shadow-[0_0_50px_rgba(212,160,23,0.3)] flex flex-col p-8 items-center text-center animate-scale-in">
              <h2 className="text-3xl font-display font-black text-roar-gold uppercase tracking-[0.2em] mb-2">
                Twin Blind Bidding
              </h2>
              <p className="text-sm font-bold text-roar-muted uppercase tracking-wider mb-8">
                {room.duel.cardCount}x {room.duel.animalName} • Winner Takes All
              </p>

              {/* Status indicator */}
              <div className="flex w-full justify-between max-w-lg mb-8 bg-black/50 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-black text-white uppercase">{room.players.find(p=>p.id===room.duel.challengerId)?.name} (Challenger)</span>
                  <div className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest ${room.duel.challengerOffer ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 'bg-roar-crimson/20 text-roar-crimson border border-roar-crimson/30 animate-pulse'}`}>
                    {room.duel.challengerOffer ? 'Offer Committed' : 'Thinking...'}
                  </div>
                </div>
                <div className="text-xl font-black text-roar-muted flex items-center">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-black text-white uppercase">{room.players.find(p=>p.id===room.duel.defenderId)?.name} (Defender)</span>
                  <div className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest ${room.duel.defenderOffer ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 'bg-roar-crimson/20 text-roar-crimson border border-roar-crimson/30 animate-pulse'}`}>
                    {room.duel.defenderOffer ? 'Offer Committed' : 'Thinking...'}
                  </div>
                </div>
              </div>

              {/* My Offer Construction */}
              {((isChallenger && !room.duel.challengerOffer) || (isDefender && !room.duel.defenderOffer)) ? (
                <div className="flex flex-col items-center w-full">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Construct Your Secret Offer</h3>
                  
                  {/* Selectable Money Cards */}
                  <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    {me.money.map((val, idx) => {
                      const isSelected = duelOfferIndices.includes(idx);
                      const visual = getMoneyCardVisualDetails(val);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isSelected) {
                              setDuelOfferIndices(prev => prev.filter(i => i !== idx));
                            } else {
                              setDuelOfferIndices(prev => [...prev, idx]);
                            }
                          }}
                          className={`relative w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 select-none shadow-xl bg-gradient-to-b ${visual.bg} ${isSelected ? 'scale-110 -translate-y-4 border-white ring-2 ring-white shadow-glow-white' : 'hover:-translate-y-2'}`}
                        >
                          <div className="absolute inset-1 pointer-events-none border border-white/5 rounded-md" />
                          <span className={`relative z-10 text-xl font-black tracking-tight ${visual.text}`}>${val}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-left">
                      <span className="block text-[10px] font-black text-roar-muted uppercase tracking-widest">Total Offer</span>
                      <span className="text-3xl font-display font-black text-emerald-400 text-glow-green">
                        ${duelOfferIndices.reduce((sum, idx) => sum + me.money[idx], 0)}
                      </span>
                    </div>
                    <button
                      onClick={handleCommitDuelOffer}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all"
                    >
                      Lock In Offer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <span className="text-emerald-400 text-5xl">✓</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Offer Submitted</h3>
                  <p className="text-sm text-roar-muted">Waiting for opponent to lock in...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#040815]/90 border border-roar-gold/50 rounded-lg py-3 px-6 flex items-center gap-3 shadow-[0_0_20px_rgba(212,160,23,0.4)] backdrop-blur">
              <span className="flex-shrink-0 w-3 h-3 rounded-full bg-roar-gold animate-pulse" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-roar-gold/80 whitespace-nowrap">
                Waiting for {room.players.find(p=>p.id===room.duel?.challengerId)?.name} and {room.players.find(p=>p.id===room.duel?.defenderId)?.name} to duel...
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── INVENTORY VIEWER TRAY ── */}
      {inspectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="relative w-[90%] max-w-4xl h-[70vh] bg-[#050813]/95 border border-roar-gold/30 rounded-2xl shadow-2xl flex flex-col p-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-black text-roar-gold uppercase tracking-widest flex items-center gap-3">
                  {inspectedPlayer.id === me.id ? <>🐾 Your Animal Inventory</> : <>🐾 {inspectedPlayer.name}'s Inventory</>}
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

            <div className="flex-1 overflow-y-auto">
              {Object.keys(inspectedGroupedAnimals).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 pb-10 mt-4">
                  {Object.entries(inspectedGroupedAnimals).map(([type, animals]) => {
                    const isExpanded = expandedAnimalGroup === type;
                    return (
                      <div key={type} className="relative flex flex-col items-center">
                        <div className="mb-4 text-center z-20">
                          <span className="block text-sm font-black text-roar-text uppercase tracking-wider">{type}</span>
                          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-900/30 rounded-full border border-emerald-500/30">
                            {animals.length} COPIES
                          </span>
                        </div>
                        <div
                          className={`relative w-32 h-48 cursor-pointer transition-all duration-300 ${isExpanded ? 'w-full h-56' : ''}`}
                          onClick={() => setExpandedAnimalGroup(isExpanded ? null : type)}
                        >
                          {animals.map((animal, idx) => {
                            const xOffset = isExpanded ? (idx - (animals.length - 1) / 2) * 60 : idx * 12;
                            const yOffset = isExpanded ? 0 : idx * 12;
                            const rot = isExpanded ? (idx - (animals.length - 1) / 2) * 5 : 0;
                            return (
                              <div
                                key={animal.id || `${type}-${idx}`}
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 transition-all duration-500 hover:z-50 hover:scale-105"
                                style={{
                                  transform: `translate(calc(-50% + ${xOffset}px), ${yOffset}px) rotate(${rot}deg)`,
                                  zIndex: 20 - idx,
                                }}
                              >
                                <PremiumCard name={type} vp={animal.vp || 10} className="w-full" isHoverable={true} />
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