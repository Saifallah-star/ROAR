import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';

const SOCKET_URL = import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin);

// Singleton socket — created once, managed here
let _socket = null;
function getSocket() {
  if (!_socket) {
    _socket = io(SOCKET_URL, { autoConnect: false, reconnectionAttempts: 5 });
  }
  return _socket;
}

// Emits an event only once the socket is confirmed connected.
// Prevents the race condition where emit fires before the WS handshake.
function emitWhenConnected(socket, event, payload) {
  if (socket.connected) {
    socket.emit(event, payload);
  } else {
    socket.once('connect', () => socket.emit(event, payload));
    socket.connect();
  }
}

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'lobby' | 'game'
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Socket bootstrap ──────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    const handlers = {
      connect: () => console.log('[ROAR UI] Connected'),
      disconnect: () => { setView('landing'); setPlayer(null); setRoom(null); },
      'room-created': ({ player: p, room: r }) => { clearLoadingTimer(); setPlayer(p); setRoom(r); setView('lobby'); setIsLoading(false); },
      'room-joined': ({ player: p, room: r }) => { clearLoadingTimer(); setPlayer(p); setRoom(r); setView('lobby'); setIsLoading(false); },
      'room-updated': ({ room: r }) => setRoom(r),
      'game-started': ({ room: r }) => { setRoom(r); setView('game'); },
      'roar-error': ({ message }) => { clearLoadingTimer(); setError(message); setIsLoading(false); },
    };

    Object.entries(handlers).forEach(([ev, fn]) => socket.on(ev, fn));
    return () => Object.entries(handlers).forEach(([ev, fn]) => socket.off(ev, fn));
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const loadingTimer = useRef(null);

  // Clears any pending loading timeout
  const clearLoadingTimer = useCallback(() => {
    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
      loadingTimer.current = null;
    }
  }, []);

  // Arms a 5 s watchdog so the UI never spins forever if the backend is down
  const armLoadingTimeout = useCallback(() => {
    clearLoadingTimer();
    loadingTimer.current = setTimeout(() => {
      setIsLoading(false);
      setError('Could not reach the server.');
    }, 5000);
  }, [clearLoadingTimer]);

  const createRoom = useCallback((playerName) => {
    const socket = getSocket();
    setIsLoading(true); setError('');
    armLoadingTimeout();
    emitWhenConnected(socket, 'create-room', { playerName });
  }, [armLoadingTimeout]);

  const joinRoom = useCallback((roomCode, playerName) => {
    const socket = getSocket();
    setIsLoading(true); setError('');
    armLoadingTimeout();
    emitWhenConnected(socket, 'join-room', { roomCode, playerName });
  }, [armLoadingTimeout]);

  const startGame = useCallback(() => {
    getSocket().emit('start-game');
  }, []);

  const leaveRoom = useCallback(() => {
    const socket = getSocket();
    socket.disconnect();
    setView('landing'); setPlayer(null); setRoom(null); setError('');
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => setError(''), []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-roar-dark bg-mesh font-body text-roar-text">
      {room?.status === 'PLAYING' ? (
        <GameBoard
          room={room}
          player={player}
          socket={getSocket()}
          onLeave={leaveRoom}
        />
      ) : view === 'landing' ? (
        <Lobby
          mode="landing"
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          error={error}
          isLoading={isLoading}
          clearError={clearError}
        />
      ) : view === 'lobby' ? (
        <Lobby
          mode="waiting"
          player={player}
          room={room}
          onStartGame={startGame}
          onLeaveRoom={leaveRoom}
          error={error}
          clearError={clearError}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center roar-card p-12">
            <h1 className="font-display text-5xl font-black text-roar-gold text-glow-gold mb-3">
              Loading Match...
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}
