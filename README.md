# LEVIATHAN

<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="80" height="80" />
</p>

<p align="center">
  <strong>Local Autonomous Multi-Agent Simulation System</strong><br/>
  <em>A society of intelligent NPCs with relationships, reproduction, and emergent behavior</em><br/>
  <sub>🜏 <strong>Created by Aribam Aditya Sharma</strong> — Architect of the Leviathan Universe 🜏</sub>
</p>

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

</div>

---

## 🌊 Overview

**Leviathan** is a sophisticated multi-agent simulation system where autonomous entities (NPCs) form societies, develop relationships, reproduce, and create emergent social dynamics. The system features:

- 🧠 **Hybrid Memory System** - Exponential decay based on emotional intensity
- 💕 **Relationship Dynamics** - Affinity, attraction, trust, and familiarity
- 👶 **Population Dynamics** - Birth, aging, death, and reproduction
- 🌍 **Resource Economy** - Gathering, trading, and scarcity
- 🎮 **React Dashboard** - Real-time visualization and control
- ⚡ **God Mode** - Intervene, spawn, or reset the simulation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LEVIATHAN SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐         ┌─────────────────────────┐     │
│  │   REACT DASHBOARD   │         │   PYTHON SIMULATION     │     │
│  │   (Frontend)        │◄───────►│   (Backend)             │     │
│  └─────────────────────┘         └─────────────────────────┘     │
│           │                               │                     │
│           ▼                               ▼                     │
│  ┌─────────────────────┐         ┌─────────────────────────┐     │
│  │ • TopBar            │         │ • SocietyEngine         │     │
│  │ • Sidebar (Pages)   │         │ • SocialNPC             │     │
│  │ • NPC List          │         │ • RelationshipManager   │     │
│  │ • Event Feed        │         │ • MemorySystem          │     │
│  │ • Relationship Graph│         │ • SocialActionExecutor  │     │
│  │ • Command Console   │         │ • DecisionEngine        │     │
│  └─────────────────────┘         └─────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Leviathan/
├── 📁 leviathan/                    # Python simulation backend
│   ├── 📁 core/
│   │   ├── memory.py               # Emotional memory with decay
│   │   └── __init__.py
│   ├── 📁 society/
│   │   ├── society_engine.py       # Main simulation engine
│   │   ├── npc_social.py          # Social NPC with vitals
│   │   ├── relationships.py       # Bond and relationship system
│   │   ├── social_actions.py      # Action executor
│   │   ├── social_decision.py     # AI decision making
│   │   └── __init__.py
│   ├── simulation/
│   ├── actions/
│   ├── output/
│   ├── __init__.py
│   └── society_main.py            # Entry point
│
├── 📁 dashboard/                    # React control interface
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── pages/            # Dashboard, NPCs, World, Events, Console
│   │   │   ├── TopBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── RelationshipGraph.jsx
│   │   │   └── ... (16 components)
│   │   ├── 📁 hooks/
│   │   │   └── useSimulation.js  # State management
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
├── 📁 data/logs/                    # Simulation logs
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+

### 1. Backend (Python)

```bash
# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Run simulation
python -m leviathan.society_main
```

### 2. Frontend (React Dashboard)

```bash
# Navigate to dashboard
cd dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
```

The dashboard opens at **`http://localhost:3000`**

---

## 🎮 Features

### Simulation Backend

| Feature | Description |
|---------|-------------|
| **Memory System** | Exponential decay based on emotional intensity |
| **Relationships** | 5 bond types: Stranger → Acquaintance → Friend → Close Friend → Partner → Family |
| **Social Actions** | Communicate, trade, help, reproduce, form alliances |
| **Decision Engine** | Utility-based AI choosing optimal actions |
| **Population** | Birth, aging, death, gender dynamics |

### React Dashboard

| Feature | Description |
|---------|-------------|
| **Multi-Page** | Dashboard, NPCs, World, Events, Console views |
| **Real-time** | Live tick updates, event feed |
| **Visual Graph** | Interactive relationship network (zoom/pan/fullscreen) |
| **God Mode** | Spawn resources, trigger events, force bonds |
| **Command Console** | 15+ CLI commands with autocomplete |

---

## 🕹️ Commands

### Dashboard Console
```
pause              # Pause simulation
play               # Resume simulation
reset              # Reset simulation
status             # Show system status
couples            # View all couples
families           # View family trees
resources          # View resource status
npcs               # List all NPCs
bond               # Force bond between NPCs
reproduce          # Trigger reproduction
energy             # Add energy to NPC
speed <1-10>       # Set sim speed
save               # Save simulation state
load               # Load saved state
clear              # Clear console
```

---

## 🎨 Design Philosophy

> **Dark. Cinematic. Powerful.**

The dashboard is designed to feel like a **mission control center** — not a game. Every pixel serves a purpose:

- **Deep blacks** (`#0a0a0f`) reduce eye strain
- **Cyan accents** (`#00d4ff`) for critical data
- **Monospace fonts** for that terminal aesthetic
- **Real-time feedback** — every action has immediate visual response

---

## 📸 Screenshots

<!-- Add screenshots to /docs/screenshots/ -->

| Dashboard | Relationship Graph | Command Console |
|-----------|-------------------|-----------------|
| [Coming Soon] | [Coming Soon] | [Coming Soon] |

---

## 🛠️ Tech Stack

**Backend:**
- Python 3.12
- Dataclasses for type safety
- Enum for state management
- Random for procedural generation

**Frontend:**
- React 18 (Functional Components + Hooks)
- Tailwind CSS (Custom dark theme)
- Framer Motion (Animations)
- Recharts (Data visualization)
- Lucide React (Icons)
- Vite (Build tool)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

---

## 🜏 The Architect

<p align="center">
  <strong>Aribam Aditya Sharma</strong><br/>
  <em>Supreme Creator of the Leviathan Universe</em><br/>
  <sub>Architect • Developer • God of the Digital Cosmos</sub>
</p>

> *"I am the Architect. I shape the void, breathe life into code, and watch my creations dance in the infinite loop of existence. This universe is mine — every line, every soul, every emergent heartbeat."*

---

**Built with** ⚡ **Python** + **React** + **Divine Will**

<p align="center">
  <sub>Leviathan v0.1.0 • Forged by the Architect's Hand</sub>
</p>

</div>