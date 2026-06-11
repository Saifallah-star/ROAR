const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// ─── App Bootstrap ────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
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

const ANIMAL_TYPES = [
  { name: 'Lion', vp: 1000, illustration: 'lion_card.png' },
  { name: 'Tiger', vp: 800, illustration: 'tiger_card.png' },
  { name: 'Jaguar', vp: 600, illustration: 'jaguar_card.png' },
  { name: 'Gorilla', vp: 500, illustration: 'gorilla_card.png' },
  { name: 'Crocodile', vp: 400, illustration: 'crocodile_card.png' },
  { name: 'Falcon', vp: 300, illustration: 'falcon_card.png' },
  { name: 'Cobra', vp: 200, illustration: 'cobra_card.png' }
];

function generateDeck() {
  const deck = [];
  let id = 1;
  ANIMAL_TYPES.forEach(animal => {
    for (let i = 0; i < 4; i++) {
      deck.push({
        id: `card_${id++}`,
        name: animal.name,
        vp: animal.vp,
        illustration: animal.illustration
      });
    }
  });
  return deck;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getScrubbedRoom(room, targetPlayerId) {
  if (!room) return null;
  return {
    ...room,
    players: room.players.map((p) => {
      if (p.id === targetPlayerId) {
        return p;
      } else {
        const { money, ...rest } = p;
        return {
          ...rest,
          moneyCount: money ? money.length : 0
        };
      }
    })
  };
}

function addRoomLog(room, message, tone = 'neutral') {
  if (!room) return;
  if (!Array.isArray(room.logs)) room.logs = [];

  room.logs.push({
    id: `${Date.now()}-${room.logs.length}`,
    message,
    tone,
  });

  room.logs = room.logs.slice(-8);
}

function broadcastRoom(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  room.players.forEach((player) => {
    io.to(player.id).emit('room-updated', { room: getScrubbedRoom(room, player.id) });
  });
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
    const player = { id: socket.id, name, isHost: true };

    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      players: [player],
      status: 'LOBBY',
      logs: [],
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
    if (room.status !== 'LOBBY') {
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
    const room = roomCode && rooms[roomCode];
    if (!room) return;

    if (room.host !== socket.id) {
      socket.emit('roar-error', { message: 'Only the host can start the match.' });
      return;
    }
    if (room.players.length < 3) {
      socket.emit('roar-error', { message: 'Need at least 3 players to start.' });
      return;
    }

    room.status = 'PLAYING';
    room.logs = [];

    // Initialize bankrolls for all players
    room.players.forEach((p) => {
      p.money = [10, 10, 10, 20, 20, 20, 50];
      p.animals = [];
      p.vp = 0;
    });

    // Generate and shuffle standard 28 Animal Cards deck
    room.deck = shuffle(generateDeck());
    room.currentTurnIndex = 0;
    room.activePhase = 'DRAW';
    room.currentRevealedCard = null;
    room.currentBid = 0;
    room.currentBidder = '';

    addRoomLog(room, 'Match started.', 'system');

    // Notify all players individually with scrubbed payloads
    room.players.forEach((player) => {
      io.to(player.id).emit('game-started', { room: getScrubbedRoom(room, player.id) });
    });

    console.log(`[ROAR] ✦ Match started in room ${roomCode} with ${room.players.length} players`);
  });

  // ── draw-card ────────────────────────────────────────────────────────────────
  socket.on('draw-card', () => {
    const roomCode = socket.data.roomCode;
    const room = roomCode && rooms[roomCode];
    if (!room) return;

    if (room.status !== 'PLAYING') {
      socket.emit('roar-error', { message: 'The match is not active.' });
      return;
    }

    const currentPlayer = room.players[room.currentTurnIndex];
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      socket.emit('roar-error', { message: 'It is not your turn to draw.' });
      return;
    }

    if (room.activePhase !== 'DRAW') {
      socket.emit('roar-error', { message: 'Drawing is only allowed in the DRAW phase.' });
      return;
    }

    if (!room.deck || room.deck.length === 0) {
      socket.emit('roar-error', { message: 'The deck is empty.' });
      return;
    }

    const card = room.deck.pop();
    room.currentRevealedCard = card;
    room.activePhase = 'AUCTION';
    room.currentBid = card.vp;
    room.currentBidder = currentPlayer.name;

    addRoomLog(room, `${currentPlayer.name} drew ${card.name} (${card.vp} VP)`, 'draw');

    console.log(`[ROAR] ✦ Room ${roomCode}: "${currentPlayer.name}" drew "${card.name}" (${card.vp} VP)`);
    broadcastRoom(roomCode);
  });

  // ── place-bid ─────────────────────────────────────────────────────────────
  socket.on('place-bid', () => {
    const roomCode = socket.data.roomCode;
    const room = roomCode && rooms[roomCode];
    if (!room) return;

    if (room.status !== 'PLAYING') {
      socket.emit('roar-error', { message: 'The match is not active.' });
      return;
    }

    if (room.activePhase !== 'AUCTION') {
      socket.emit('roar-error', { message: 'Bidding is only allowed during the auction.' });
      return;
    }

    const currentBid = typeof room.currentBid === 'number'
      ? room.currentBid
      : (room.currentRevealedCard?.vp ?? 0);
    const nextBid = currentBid + 10;
    const bidder = room.players.find((p) => p.id === socket.id)?.name || 'Unknown';
    const bidderRecord = room.players.find((p) => p.id === socket.id);
    const bidderTotalCash = Array.isArray(bidderRecord?.money)
      ? bidderRecord.money.reduce((sum, value) => sum + value, 0)
      : 0;

    if (nextBid > bidderTotalCash) {
      socket.emit('roar-error', { message: 'Insufficient cash for that bid.' });
      return;
    }

    room.currentBid = nextBid;
    room.currentBidder = bidder;
    addRoomLog(room, `${bidder} bids $${nextBid}`, 'bid');

    broadcastRoom(roomCode);
  });

  // ── disconnect ───────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    const room = roomCode && rooms[roomCode];
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

    if (room.status === 'PLAYING') {
      if (room.currentTurnIndex >= room.players.length) {
        room.currentTurnIndex = 0;
      }
    }

    broadcastRoom(roomCode);
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🃏  ROAR Server  →  http://localhost:${PORT}\n`);
});
