const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors    = require('cors');

// ─── App Bootstrap ────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ROAR server is live 🃏' }));

// ─── In-Memory State ──────────────────────────────────────────────────────────
const rooms = {};

// ─── Utilities ────────────────────────────────────────────────────────────────
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars

function generateRoomCode() {
  let code;
  do {
    code = Array.from({ length: 4 }, () =>
      CHARSET[Math.floor(Math.random() * CHARSET.length)]
    ).join('');
  } while (rooms[code]);
  return code;
}

function sanitizeName(raw) {
  return typeof raw === 'string' ? raw.trim().slice(0, 20) : '';
}

function broadcastRoom(roomCode) {
  io.to(roomCode).emit('room-updated', { room: rooms[roomCode] });
}

// ─── Socket.io Events ─────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[ROAR] ✦ Connected  → ${socket.id}`);

  // ── create-room ─────────────────────────────────────────────────────────────
  socket.on('create-room', ({ playerName } = {}) => {
    const name = sanitizeName(playerName);
    if (name.length < 2) {
      socket.emit('roar-error', { message: 'Name must be at least 2 characters.' });
      return;
    }

    const roomCode = generateRoomCode();
    const player   = { id: socket.id, name, isHost: true };

    rooms[roomCode] = {
      code:      roomCode,
      host:      socket.id,
      players:   [player],
      status:    'waiting',
      createdAt: Date.now(),
    };

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    socket.emit('room-created', { roomCode, player, room: rooms[roomCode] });
    console.log(`[ROAR] ✦ Room ${roomCode} created by "${name}"`);
  });

  // ── join-room ────────────────────────────────────────────────────────────────
  socket.on('join-room', ({ roomCode, playerName } = {}) => {
    const code = typeof roomCode === 'string' ? roomCode.toUpperCase().trim() : '';
    const name = sanitizeName(playerName);

    if (name.length < 2) {
      socket.emit('roar-error', { message: 'Name must be at least 2 characters.' });
      return;
    }
    if (!/^[A-Z0-9]{4}$/.test(code)) {
      socket.emit('roar-error', { message: 'Room code must be exactly 4 characters.' });
      return;
    }

    const room = rooms[code];
    if (!room) {
      socket.emit('roar-error', { message: 'Room not found. Check the code and try again.' });
      return;
    }
    if (room.status !== 'waiting') {
      socket.emit('roar-error', { message: 'This match has already started.' });
      return;
    }
    if (room.players.length >= 6) {
      socket.emit('roar-error', { message: 'Arena is full (max 6 players).' });
      return;
    }
    if (room.players.some((p) => p.id === socket.id)) {
      socket.emit('roar-error', { message: 'You are already in this room.' });
      return;
    }

    const player = { id: socket.id, name, isHost: false };
    room.players.push(player);
    socket.join(code);
    socket.data.roomCode = code;

    socket.emit('room-joined', { roomCode: code, player, room });
    broadcastRoom(code);
    console.log(`[ROAR] ✦ "${name}" joined room ${code} (${room.players.length}/6)`);
  });

  // ── start-game ───────────────────────────────────────────────────────────────
  socket.on('start-game', () => {
    const roomCode = socket.data.roomCode;
    const room     = roomCode && rooms[roomCode];
    if (!room) return;

    if (room.host !== socket.id) {
      socket.emit('roar-error', { message: 'Only the host can start the match.' });
      return;
    }
    if (room.players.length < 3) {
      socket.emit('roar-error', { message: 'Need at least 3 players to start.' });
      return;
    }

    room.status = 'in-progress';
    io.to(roomCode).emit('game-started', { room });
    console.log(`[ROAR] ✦ Match started in room ${roomCode} with ${room.players.length} players`);
  });

  // ── disconnect ───────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    const room     = roomCode && rooms[roomCode];
    if (!room) {
      console.log(`[ROAR] ✦ Disconnected → ${socket.id} (no active room)`);
      return;
    }

    room.players = room.players.filter((p) => p.id !== socket.id);
    console.log(`[ROAR] ✦ "${socket.id}" left room ${roomCode} (${room.players.length} remaining)`);

    if (room.players.length === 0) {
      delete rooms[roomCode];
      console.log(`[ROAR] ✦ Room ${roomCode} dissolved (empty)`);
      return;
    }

    // Re-assign host if the host disconnected
    if (room.host === socket.id) {
      room.players[0].isHost = true;
      room.host = room.players[0].id;
      console.log(`[ROAR] ✦ New host in ${roomCode}: "${room.players[0].name}"`);
    }

    broadcastRoom(roomCode);
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🃏  ROAR Server  →  http://localhost:${PORT}\n`);
});
