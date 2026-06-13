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

function findExactBillsSubset(moneyArray, targetAmount) {
  let bestSubset = null;
  function backtrack(index, currentSum, currentSubset) {
    if (currentSum === targetAmount) {
      bestSubset = [...currentSubset];
      return true;
    }
    if (currentSum > targetAmount || index >= moneyArray.length) {
      return false;
    }
    currentSubset.push(moneyArray[index]);
    if (backtrack(index + 1, currentSum + moneyArray[index], currentSubset)) {
      return true;
    }
    currentSubset.pop();
    if (backtrack(index + 1, currentSum, currentSubset)) {
      return true;
    }
    return false;
  }
  const sorted = [...moneyArray].sort((a, b) => b - a);
  backtrack(0, 0, []);
  return bestSubset;
}

function rebuildMoney(total) {
  const bills = [];
  let rem = total;
  while (rem >= 50) { bills.push(50); rem -= 50; }
  while (rem >= 20) { bills.push(20); rem -= 20; }
  while (rem >= 10) { bills.push(10); rem -= 10; }
  return bills;
}

function settleAuctionPayment(winner, seller, amount) {
  let subset = findExactBillsSubset(winner.money, amount);
  if (subset) {
    for (const bill of subset) {
      const idx = winner.money.indexOf(bill);
      if (idx !== -1) winner.money.splice(idx, 1);
      seller.money.push(bill);
    }
    return;
  }
  let bestSum = Infinity;
  let bestSubset = null;
  function backtrack(index, currentSum, currentSubset) {
    if (currentSum >= amount) {
      if (currentSum < bestSum) {
        bestSum = currentSum;
        bestSubset = [...currentSubset];
      }
      return;
    }
    if (index >= winner.money.length) return;
    currentSubset.push(winner.money[index]);
    backtrack(index + 1, currentSum + winner.money[index], currentSubset);
    currentSubset.pop();
    backtrack(index + 1, currentSum, currentSubset);
  }
  backtrack(0, 0, []);
  if (bestSubset) {
    for (const bill of bestSubset) {
      const idx = winner.money.indexOf(bill);
      if (idx !== -1) winner.money.splice(idx, 1);
      seller.money.push(bill);
    }
    const change = bestSum - amount;
    if (change > 0) {
      let changeSubset = findExactBillsSubset(seller.money, change);
      if (changeSubset) {
        for (const bill of changeSubset) {
          const idx = seller.money.indexOf(bill);
          if (idx !== -1) seller.money.splice(idx, 1);
          winner.money.push(bill);
        }
      } else {
        const winnerTotal = winner.money.reduce((a, b) => a + b, 0) + change;
        const sellerTotal = seller.money.reduce((a, b) => a + b, 0) - change;
        winner.money = rebuildMoney(winnerTotal);
        seller.money = rebuildMoney(sellerTotal);
      }
    }
  } else {
    const winnerTotal = winner.money.reduce((a, b) => a + b, 0) - amount;
    const sellerTotal = seller.money.reduce((a, b) => a + b, 0) + amount;
    winner.money = rebuildMoney(winnerTotal);
    seller.money = rebuildMoney(sellerTotal);
  }
}


function checkAuctionResolution(room, roomCode) {
  const eligibleOpponents = room.players.filter(
    (p) => p.id !== room.drawerId && !room.passedPlayers.includes(p.id)
  );

  const nextBid = (room.currentBid || 0) + 10;
  const stillActive = eligibleOpponents.filter((p) => {
    const cash = Array.isArray(p.money) ? p.money.reduce((s, v) => s + v, 0) : 0;
    if (cash < nextBid) {
      room.passedPlayers.push(p.id);
      addRoomLog(room, `${p.name} auto-passed (insufficient funds).`, 'system');
      return false;
    }
    return true;
  });

  const totalOpponents = room.players.filter((p) => p.id !== room.drawerId);
  const allPassed = totalOpponents.every((p) => room.passedPlayers.includes(p.id));

  const shouldResolve = allPassed || stillActive.length === 0 ||
    (stillActive.length === 1 && room.highestBidder === stillActive[0].id);

  if (shouldResolve) {
    if (!room.highestBidder) {
      addRoomLog(room, 'No bids placed — drawer keeps the card.', 'system');
    } else {
      const winner = room.players.find((p) => p.id === room.highestBidder);
      const seller = room.players.find((p) => p.id === room.drawerId);
      const card   = room.currentRevealedCard;
      const salePrice = room.currentBid;

      if (winner && seller && card) {
        seller.animals = seller.animals.filter((a) => a.id !== card.id);
        seller.vp = Math.max(0, (seller.vp || 0) - card.vp);

        if (!Array.isArray(winner.animals)) winner.animals = [];
        winner.animals.push(card);
        winner.vp = (winner.vp || 0) + card.vp;

        settleAuctionPayment(winner, seller, salePrice);

        addRoomLog(room, `${winner.name} won ${card.name} for $${salePrice}!`, 'bid');
        addRoomLog(room, `${seller.name} received $${salePrice}.`, 'system');
        console.log(`[ROAR] ✦ Room ${roomCode}: "${winner.name}" won "${card.name}" for $${salePrice}.`);
      }
    }

    room.currentRevealedCard = null;
    room.drawerId = null;
    room.activePhase = 'DRAW';
    room.currentBid = 0;
    room.highestBidder = null;
    room.passedPlayers = [];
    room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
    console.log(`[ROAR] ✦ Room ${roomCode}: Auction resolved.`);
    broadcastRoom(roomCode);
    return true;
  }

  broadcastRoom(roomCode);
  return false;
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
    room.drawerId = null;       // socket.id of the player who drew the current card
    room.currentBid = 0;
    room.highestBidder = null;  // socket.id of current highest bidder
    room.passedPlayers = [];    // socket.ids of opponents who passed this auction

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

    // ── FREE DRAW: immediately add card to drawer's inventory ──────────────
    if (!Array.isArray(currentPlayer.animals)) currentPlayer.animals = [];
    currentPlayer.animals.push(card);
    currentPlayer.vp = (currentPlayer.vp || 0) + card.vp;

    room.currentRevealedCard = card;
    room.drawerId = socket.id;
    room.activePhase = 'CHOOSE_ACTION';

    addRoomLog(room, `${currentPlayer.name} drew ${card.name} (${card.vp} VP)`, 'draw');
    console.log(`[ROAR] ✦ Room ${roomCode}: "${currentPlayer.name}" drew "${card.name}" — awaiting Keep / Trade`);
    broadcastRoom(roomCode);
  });

  // ── choose-action ────────────────────────────────────────────────────────────
  // Actions: 'keep-card' | 'initiate-trade'
  socket.on('choose-action', ({ action } = {}) => {
    const roomCode = socket.data.roomCode;
    const room = roomCode && rooms[roomCode];
    if (!room) return;

    if (room.status !== 'PLAYING') {
      socket.emit('roar-error', { message: 'The match is not active.' });
      return;
    }
    if (room.activePhase !== 'CHOOSE_ACTION') {
      socket.emit('roar-error', { message: 'No card is pending a choice.' });
      return;
    }

    const currentPlayer = room.players[room.currentTurnIndex];
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      socket.emit('roar-error', { message: 'Only the active player can choose.' });
      return;
    }

    if (action === 'keep-card') {
      // ── KEEP: card already sits in drawer's inventory; just clear table & advance
      const keptCardName = room.currentRevealedCard?.name ?? 'the card';
      const nextIdx = (room.currentTurnIndex + 1) % room.players.length;
      const nextPlayerName = room.players[nextIdx]?.name ?? 'next player';

      room.currentRevealedCard = null;
      room.drawerId = null;
      room.activePhase = 'DRAW';
      room.currentTurnIndex = nextIdx;

      addRoomLog(room, `${currentPlayer.name} kept ${keptCardName}.`, 'system');
      addRoomLog(room, `Turn passes to ${nextPlayerName}.`, 'system');
      console.log(`[ROAR] ✦ Room ${roomCode}: "${currentPlayer.name}" kept "${keptCardName}".`);
      broadcastRoom(roomCode);

    } else if (action === 'initiate-trade') {
      // ── TRADE: open the card for opponent bidding (card stays in drawer inventory
      //    until auction resolves — if a winner emerges the card transfers to them)
      room.activePhase = 'AUCTION';
      room.currentBid = 0;
      room.highestBidder = null;
      room.passedPlayers = [];

      addRoomLog(room, `${currentPlayer.name} put ${room.currentRevealedCard.name} up for auction!`, 'bid');
      console.log(`[ROAR] ✦ Room ${roomCode}: "${currentPlayer.name}" initiated trade auction.`);
      broadcastRoom(roomCode);

    } else {
      socket.emit('roar-error', { message: 'Invalid action. Use keep-card or initiate-trade.' });
    }
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
    // Drawer cannot bid on their own card
    if (socket.id === room.drawerId) {
      socket.emit('roar-error', { message: 'You cannot bid on your own card.' });
      return;
    }
    // Already passed
    if (room.passedPlayers.includes(socket.id)) {
      socket.emit('roar-error', { message: 'You have already passed this auction.' });
      return;
    }

    const nextBid = (typeof room.currentBid === 'number' ? room.currentBid : 0) + 10;
    const bidderRecord = room.players.find((p) => p.id === socket.id);
    if (!bidderRecord) return;

    const bidderTotalCash = Array.isArray(bidderRecord.money)
      ? bidderRecord.money.reduce((s, v) => s + v, 0)
      : 0;

    if (nextBid > bidderTotalCash) {
      socket.emit('roar-error', { message: 'Insufficient cash for that bid.' });
      return;
    }

    room.currentBid = nextBid;
    room.highestBidder = socket.id;
    addRoomLog(room, `${bidderRecord.name} bids $${nextBid}`, 'bid');
    console.log(`[ROAR] ✦ Room ${roomCode}: "${bidderRecord.name}" bids $${nextBid}`);
    
    // Check if the new bid immediately auto-passes everyone else and resolves the auction
    checkAuctionResolution(room, roomCode);
  });

  // ── pass-bid ──────────────────────────────────────────────────────────────
  socket.on('pass-bid', () => {
    const roomCode = socket.data.roomCode;
    const room = roomCode && rooms[roomCode];
    if (!room) return;

    if (room.status !== 'PLAYING') return;
    if (room.activePhase !== 'AUCTION') {
      socket.emit('roar-error', { message: 'No active auction.' });
      return;
    }
    if (socket.id === room.drawerId) {
      socket.emit('roar-error', { message: 'The seller cannot pass.' });
      return;
    }
    if (room.passedPlayers.includes(socket.id)) return; // already passed, ignore

    const passer = room.players.find((p) => p.id === socket.id);
    if (!passer) return;

    room.passedPlayers.push(socket.id);
    addRoomLog(room, `${passer.name} passed.`, 'system');
    console.log(`[ROAR] ✦ Room ${roomCode}: "${passer.name}" passed.`);

    // Check resolution
    checkAuctionResolution(room, roomCode);
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
