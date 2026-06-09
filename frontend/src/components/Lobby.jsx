import { useState, useEffect, useRef } from 'react';

/* ── Icons (inline SVG helpers) ─────────────────────────────────────────── */
const Icon = {
  Crown: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-roar-gold">
      <path d="M2 19h20v2H2v-2zm1-9l4 4 5-8 5 8 4-4v8H3v-8z" />
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-green-400">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Sword: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Spinner: () => (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  ),
};

/* ── Avatar colour palette ───────────────────────────────────────────────── */
const AVATAR_COLORS = [
  'from-roar-crimson to-red-900',
  'from-amber-500 to-yellow-700',
  'from-purple-600 to-violet-900',
  'from-blue-500 to-blue-900',
  'from-emerald-500 to-green-900',
  'from-pink-500 to-rose-900',
];
function avatarColor(idx) { return AVATAR_COLORS[idx % AVATAR_COLORS.length]; }

/* ── ErrorBanner ─────────────────────────────────────────────────────────── */
function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 mb-4
                    bg-roar-crimson/10 border border-roar-crimson/40 rounded-lg
                    text-roar-crimson text-sm animate-slide-up">
      <span>{message}</span>
      <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">✕</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  LANDING VIEW                                                              */
/* ══════════════════════════════════════════════════════════════════════════ */
function LandingView({ onCreateRoom, onJoinRoom, error, isLoading, clearError }) {
  const [name,       setName]       = useState('');
  const [roomCode,   setRoomCode]   = useState('');
  const [joinMode,   setJoinMode]   = useState(false);
  const [nameErr,    setNameErr]    = useState('');
  const [codeErr,    setCodeErr]    = useState('');
  const nameRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);
  useEffect(() => { if (joinMode) codeRef.current?.focus(); }, [joinMode]);

  const validateName = (v) => {
    if (v.trim().length < 2) { setNameErr('Name needs at least 2 characters.'); return false; }
    if (v.trim().length > 20) { setNameErr('Name cannot exceed 20 characters.');  return false; }
    setNameErr(''); return true;
  };
  const validateCode = (v) => {
    if (!/^[A-Za-z0-9]{4}$/.test(v.trim())) { setCodeErr('Enter the exact 4-character room code.'); return false; }
    setCodeErr(''); return true;
  };

  const handleCreate = () => {
    if (!validateName(name)) return;
    onCreateRoom(name.trim());
  };

  const handleJoin = () => {
    const nOk = validateName(name);
    const cOk = validateCode(roomCode);
    if (!nOk || !cOk) return;
    onJoinRoom(roomCode.toUpperCase().trim(), name.trim());
  };

  const handleKeyDown = (e, action) => { if (e.key === 'Enter') action(); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      {/* ── Logo / Title ── */}
      <div className="text-center mb-10 animate-slide-up">
        <div className="inline-block mb-4">
          <img src="/LOGO.png" alt="ROAR" className="h-20 w-auto mx-auto drop-shadow-[0_0_30px_rgba(196,30,58,0.5)]"
               onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <h1 className="font-display font-black text-7xl md:text-8xl tracking-widest
                       text-transparent bg-clip-text
                       bg-gradient-to-b from-roar-gold-light via-roar-gold to-amber-700
                       text-glow-gold select-none mb-2">
          ROAR
        </h1>
        <p className="text-roar-muted font-display text-sm tracking-[0.3em] uppercase">
          Battle · Bid · Conquer
        </p>
      </div>

      {/* ── Card panel ── */}
      <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="roar-card p-7 space-y-5">

          <ErrorBanner message={error} onDismiss={clearError} />

          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold text-roar-muted uppercase tracking-widest mb-2">
              Your Name
            </label>
            <input
              ref={nameRef}
              id="player-name-input"
              type="text"
              maxLength={20}
              placeholder="Enter your warrior name…"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(''); if (error) clearError(); }}
              onKeyDown={(e) => handleKeyDown(e, joinMode ? handleJoin : handleCreate)}
              className={`roar-input ${nameErr ? 'border-roar-crimson/60' : ''}`}
            />
            {nameErr && <p className="mt-1.5 text-xs text-roar-crimson">{nameErr}</p>}
          </div>

          {/* Room code — visible only in join mode */}
          {joinMode && (
            <div className="animate-slide-up">
              <label className="block text-xs font-semibold text-roar-muted uppercase tracking-widest mb-2">
                Room Code
              </label>
              <input
                ref={codeRef}
                id="room-code-input"
                type="text"
                maxLength={4}
                placeholder="A B C D"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                  if (codeErr) setCodeErr('');
                  if (error) clearError();
                }}
                onKeyDown={(e) => handleKeyDown(e, handleJoin)}
                className={`roar-input text-center tracking-[0.5em] font-display font-bold text-xl uppercase
                            ${codeErr ? 'border-roar-crimson/60' : ''}`}
              />
              {codeErr && <p className="mt-1.5 text-xs text-roar-crimson">{codeErr}</p>}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 pt-1">
            {!joinMode ? (
              <>
                <button
                  id="create-game-btn"
                  onClick={handleCreate}
                  disabled={isLoading}
                  className="roar-btn-primary w-full animate-pulse-glow"
                >
                  {isLoading ? <Icon.Spinner /> : <Icon.Sword />}
                  {isLoading ? 'Creating Arena…' : 'Create Game'}
                </button>
                <button
                  id="join-lobby-btn"
                  onClick={() => { clearError(); setJoinMode(true); }}
                  disabled={isLoading}
                  className="roar-btn-ghost w-full"
                >
                  <Icon.Users />
                  Join Lobby
                </button>
              </>
            ) : (
              <>
                <button
                  id="confirm-join-btn"
                  onClick={handleJoin}
                  disabled={isLoading}
                  className="roar-btn-primary w-full animate-pulse-glow"
                >
                  {isLoading ? <Icon.Spinner /> : <Icon.Users />}
                  {isLoading ? 'Joining…' : 'Join Lobby'}
                </button>
                <button
                  id="back-btn"
                  onClick={() => { setJoinMode(false); setRoomCode(''); setCodeErr(''); clearError(); }}
                  disabled={isLoading}
                  className="roar-btn-ghost w-full"
                >
                  <Icon.ArrowLeft />
                  Back
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-roar-muted text-xs mt-4 tracking-wide">
          No account needed · Real-time · Up to 6 players
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  WAITING LOBBY VIEW                                                        */
/* ══════════════════════════════════════════════════════════════════════════ */
function WaitingLobbyView({ player, room, onStartGame, onLeaveRoom, error, clearError }) {
  const [copied, setCopied] = useState(false);
  const players   = room?.players ?? [];
  const isHost    = player?.isHost;
  const canStart  = isHost && players.length >= 3;
  const needMore  = 3 - players.length;

  const copyCode = () => {
    navigator.clipboard.writeText(room?.code ?? '').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pulsing dots animation for "waiting" text
  const Dots = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
      return () => clearInterval(id);
    }, []);
    return <span className="w-6 inline-block text-left">{dots}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-lg space-y-5">

        {/* ── Header ── */}
        <div className="text-center animate-slide-up">
          <h2 className="font-display font-black text-4xl md:text-5xl
                         text-transparent bg-clip-text
                         bg-gradient-to-b from-roar-gold-light to-roar-gold
                         text-glow-gold mb-1">
            ROAR
          </h2>
          <p className="text-roar-muted text-sm tracking-widest uppercase">Waiting Arena</p>
        </div>

        {/* ── Room code badge ── */}
        <div className="roar-card p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-xs text-roar-muted uppercase tracking-widest mb-3 font-semibold">Room Code</p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-display font-black text-4xl tracking-[0.4em]
                             text-transparent bg-clip-text
                             bg-gradient-to-r from-roar-crimson to-red-400
                             text-glow-crimson">
              {room?.code ?? '????'}
            </span>
            <button
              id="copy-room-code-btn"
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                         text-xs font-semibold uppercase tracking-wider
                         border border-roar-border text-roar-muted
                         hover:border-roar-gold hover:text-roar-gold
                         transition-all duration-200 active:scale-95"
            >
              {copied ? <Icon.Check /> : <Icon.Copy />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
          <p className="text-roar-muted text-xs mt-3">
            Share this code with friends to join your arena.
          </p>
        </div>

        {/* ── Player roster ── */}
        <div className="roar-card p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-roar-muted">
              <Icon.Users />
              <span className="text-xs font-semibold uppercase tracking-widest">Players</span>
            </div>
            <span className="text-xs font-bold text-roar-text bg-roar-surface
                             px-3 py-1 rounded-full border border-roar-border">
              {players.length} / 6
            </span>
          </div>

          {/* Player list */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-thin pr-1">
            {players.map((p, idx) => {
              const isSelf = p.id === player?.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-lg
                              border transition-all duration-300
                              ${isSelf
                                ? 'border-roar-crimson/40 bg-roar-crimson/5'
                                : 'border-roar-border bg-roar-surface/50'
                              }
                              animate-scale-in`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                                   text-white font-bold text-sm font-display flex-shrink-0
                                   bg-gradient-to-br ${avatarColor(idx)}`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm truncate
                                        ${isSelf ? 'text-roar-text' : 'text-roar-text/80'}`}>
                        {p.name}
                      </span>
                      {p.isHost && (
                        <span className="flex items-center gap-1 text-roar-gold text-xs font-semibold
                                         bg-roar-gold/10 border border-roar-gold/30 px-2 py-0.5 rounded-full">
                          <Icon.Crown /> Host
                        </span>
                      )}
                      {isSelf && (
                        <span className="text-roar-muted text-xs bg-roar-surface border border-roar-border
                                         px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Connection pulse */}
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0
                                  shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
                </div>
              );
            })}

            {/* Empty slots */}
            {players.length < 6 && Array.from({ length: Math.min(6 - players.length, 3) }).map((_, i) => (
              <div key={`empty-${i}`}
                   className="flex items-center gap-3 p-3 rounded-lg
                              border border-dashed border-roar-border/40 opacity-30">
                <div className="w-9 h-9 rounded-lg bg-roar-surface/50 flex-shrink-0" />
                <span className="text-roar-muted text-sm">Waiting for player…</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        <ErrorBanner message={error} onDismiss={clearError} />

        {/* ── Status message ── */}
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.15s' }}>
          {canStart ? (
            <p className="text-emerald-400 text-sm font-semibold">
              ✦ Arena ready — you may begin the match!
            </p>
          ) : (
            <p className="text-roar-muted text-sm">
              {needMore > 0
                ? `Waiting for ${needMore} more player${needMore > 1 ? 's' : ''} to join`
                : 'Waiting'}
              <Dots />
            </p>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {isHost && (
            <button
              id="start-game-btn"
              onClick={onStartGame}
              disabled={!canStart}
              className={`roar-btn-primary w-full text-base py-4
                          ${canStart ? 'animate-pulse-glow' : 'opacity-40 cursor-not-allowed'}`}
            >
              <Icon.Sword />
              {canStart ? 'Start Game' : `Start Game (need ${needMore > 0 ? needMore : 0} more)`}
            </button>
          )}
          {!isHost && (
            <div className="flex items-center justify-center gap-2 py-4 text-roar-muted text-sm
                            border border-roar-border/30 rounded-lg">
              <Icon.Crown />
              Waiting for host to start the match…
            </div>
          )}

          <button
            id="leave-room-btn"
            onClick={onLeaveRoom}
            className="roar-btn-ghost w-full"
          >
            <Icon.LogOut />
            Leave Arena
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  EXPORT — Lobby switcher                                                   */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function Lobby(props) {
  if (props.mode === 'waiting') {
    return (
      <WaitingLobbyView
        player={props.player}
        room={props.room}
        onStartGame={props.onStartGame}
        onLeaveRoom={props.onLeaveRoom}
        error={props.error}
        clearError={props.clearError}
      />
    );
  }
  return (
    <LandingView
      onCreateRoom={props.onCreateRoom}
      onJoinRoom={props.onJoinRoom}
      error={props.error}
      isLoading={props.isLoading}
      clearError={props.clearError}
    />
  );
}
