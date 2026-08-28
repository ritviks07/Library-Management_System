# 📚 Library Management System

A modern, interactive Full-Stack (PERN) **Library Management System** featuring a 3D bookshelf experience, showcase grid view, catalog table ledger, interactive hardcover reader, live book spine previews, soundscapes, and full CRUD operations.

---

## ✨ Key Features

- **Multi-View Catalog System**:
  - 📚 **3D Realistic Bookshelf**: Dynamic floating walnut shelves with 3D spine lift animations, ribbons, and real-time availability badges.
  - 🎴 **Showcase Grid View**: Modern 3D cover cards with ratings, genre tags, synopses, and quick actions.
  - 📋 **Catalog Table Ledger**: Fast data table for sorting, batch management, and status filtering.
- **📖 Interactive 3D Hardcover Reader**:
  - Dual-page editorial spread with realistic casing, circulation progress bar, and keyboard shortcuts (`←` / `→` arrow keys, `Esc`).
- **🎨 Live 3D Spine Customizer**:
  - Add & edit books with instant live 3D spine color rendering and star rating picker.
- **📊 Real-time Analytics & Ledger**:
  - Live KPI metrics, shelf availability percentage bars, and genre distribution charts.
- **🔊 Procedural Acoustic Soundscape**:
  - Realistic page flips, book thuds, and wax stamp sound effects via Web Audio API.
- **⚡ Resilient Database Tier**:
  - Seamless PostgreSQL connection with built-in zero-friction in-memory fallback mode.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Vanilla CSS Glassmorphism
- **Backend**: Node.js, Express, REST API, PostgreSQL (`pg` pool) / Resilient Fallback Engine

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ritviks07/Library-Management_System.git
cd Library-Management_System
```

### 2. Install dependencies
```bash
npm run install:all
```
*(Or install inside `client` and `server` separately with `npm install`)*

### 3. Configure Environment
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```

### 4. Start the Application

**Run Backend API Server (Port 5000):**
```bash
cd server
npm start
```

**Run Frontend Dev Server (Port 5173):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!
