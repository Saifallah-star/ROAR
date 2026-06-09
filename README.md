# ROAR — Multiplayer Card Game Engine

<p align="center">
  <img src="frontend/public/LOGO.png" alt="ROAR Logo" width="350"/>
</p>

<p align="center">
  <strong>BID • TRADE • DOMINATE</strong>
</p>

<p align="center">
  A real-time, competitive full-stack multiplayer card game built with an authoritative server architecture, zero database persistence, and rapid state synchronization interfaces. 
</p>

---

## Features & Architecture

**ROAR** utilizes a decoupled web topology designed for seamless, fast-paced match sessions:
* **Authoritative In-Memory Server:** Built with Node.js & Socket.io to prevent client-side data tampering. Game loops, decks, and transactions live entirely in server RAM.
* **Responsive Client UI:** Crafted in React and styled with a dark, high-fidelity jungle aesthetic powered by TailwindCSS.
* **Strict Privacy Middleware:** Advanced server-side scrubbing filters structural data packets dynamically, ensuring opponents can only see financial metrics as primitive card counts while preserving hidden inventory values.

---

## Repository Structure

```text
roar-game/
├── backend/
│   ├── server.js              # Express + Socket.io event loop orchestration
│   └── package.json           # Server environments & dependencies
└── frontend/
    ├── src/
    │   ├── components/        # Game UI views (Lobby, GameBoard, Auction, Trade)
    │   ├── App.jsx            # State manager and WebSocket connection router
    │   └── main.jsx           # Client application entrypoint
    ├── vite.config.js         # Tooling and dev-proxy network layout
    └── package.json           # React dependencies