<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-00d4ff?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

</div>

<h1 align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="40" height="40" style="filter: invert(48%) sepia(97%) saturate(1939%) hue-rotate(165deg) brightness(101%) contrast(101%);" />
  <br/>
  LEVIATHAN DASHBOARD
</h1>

<p align="center">
  <strong>A high-end, production-grade React control interface for autonomous simulation systems</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-commands">Commands</a>
</p>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎮 **Real-time Control**
- ⏯️ Play / Pause / Restart
- ⚡ Speed control (1x → 5x)
- 📊 Live tick counter
- 🔴 Status indicators

</td>
<td width="50%">

### 👥 **Entity Management**
- 📋 Scrollable entity list
- 🔍 Deep inspection panel
- ➕ Create new entities
- ❌ Remove entities

</td>
</tr>
<tr>
<td width="50%">

### 🌐 **World Monitoring**
- 📈 Population trends (Recharts)
- 🏭 Resource tracking
- 💑 Couple & birth counters
- 📉 Activity rate metrics

</td>
<td width="50%">

### 🕸️ **Social Visualization**
- 🕸️ Interactive relationship graph
- 🔍 Zoom (0.3x → 3x) + Pan
- 🖱️ Hover tooltips
- ⛶ Fullscreen mode

</td>
</tr>
<tr>
<td width="50%">

### ⚡ **God Mode Panel**
- 🍖 Give food
- ⚡ Give energy
- 💉 Inject intel
- 🔗 Force bonds
- 🎭 Trigger events

</td>
<td width="50%">

### 🖥️ **Command Console**
- 📝 15+ CLI commands
- ⬆️ Command history (↑/↓)
- 🔮 Autocomplete (Tab)
- 🎨 Terminal aesthetics

</td>
</tr>
</table>

---

## 🎬 Demo

### Layout Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ☰  LEVIATHAN    ● RUNNING    Tick: 12,847    Entities: 24    [1x] [⏯] [↻] │
├────────┬────────────────────────────────────────────┬────────┬──────────────┤
│        │                                            │        │              │
│  👥    │     🖥️  LIVE EVENT FEED                   │  🌍    │   🛠️ TOOLS   │
│ ENTITY │                                            │ WORLD  │              │
│ LIST   │  [14:32:12] bonding: Kael bonds with Lira  │ STATE  │ ┌──────────┐ │
│        │  [14:32:09] social: Vorn interacts with Nyx│        │ │Resources │ │
│ ■ Kael │  [14:32:04] system: Resources spawned      │ 📈     │ │  1,247   │ │
│ ■ Lira │  [14:31:58] social: Pax shares knowledge   │ Chart  │ └──────────┘ │
│ ■ Vorn │                                            │        │ ┌──────────┐ │
│ ■ Nyx  │  🕸️ RELATIONSHIP GRAPH                    │        │ │ Couples  │ │
│ ■ Pax  │                                            │        │ │    8     │ │
│ ■ Jax  │       ●─────●                              │        │ └──────────┘ │
│ ■ Mira │      /│\    /│\                            │        │ ┌──────────┐ │
│ ■ Seth │     ●─●─●──●─●─●                           │        │ │ Births   │ │
│ ■ Zara │        │      │                            │        │ │   12     │ │
│ ■ Crix │       ●──────●                              │        │ └──────────┘ │
│ ■ Quin │                                            │        │              │
│ ■ Rhea │  [Zoom: 100%] [🖱️ Pan] [⛶ Fullscreen]     │        │              │
│ ■ Syl  │                                            │        │              │
├────────┴────────────────────────────────────────────┴────────┴──────────────┤
│  📊 DASHBOARD │ 👥 ENTITIES │ 🌍 WORLD │ 📅 EVENTS │ 💻 CONSOLE           │
├─────────────────────────────────────────────────────────────────────────────┤
│  >_  Enter command... (try: couples, families, resources, pause, spawn)    │
│  [status] [couples] [families] [resources] [npcs] [bond] [clear] ...         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at **`http://localhost:3000`**

### Build for Production

```bash
npm run build
```

---

## 🏗️ Architecture

### Project Structure

```
dashboard/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 TopBar.jsx           # Status bar with controls
│   │   ├── 📄 Sidebar.jsx          # Navigation sidebar
│   │   ├── 📄 NPCList.jsx          # Entity roster
│   │   ├── 📄 NPCInspector.jsx     # Entity deep-dive
│   │   ├── 📄 GodPanel.jsx         # Intervention controls
│   │   ├── 📄 EventFeed.jsx        # Terminal log
│   │   ├── 📄 RelationshipGraph.jsx # Canvas network viz
│   │   ├── 📄 WorldPanel.jsx       # Global metrics
│   │   ├── 📄 NPCManager.jsx       # CRUD operations
│   │   ├── 📄 GlobalControls.jsx   # World interventions
│   │   ├── 📄 CommandConsole.jsx   # CLI interface
│   │   └── 📁 pages/
│   │       ├── 📄 Dashboard.jsx    # Main overview
│   │       ├── 📄 NPCsPage.jsx     # Entity management
│   │       ├── 📄 WorldPage.jsx    # World controls
│   │       ├── 📄 EventsPage.jsx   # Event log
│   │       └── 📄 ConsolePage.jsx  # Full terminal
│   ├── 📁 hooks/
│   │   └── 📄 useSimulation.js   # State management
│   ├── 📄 App.jsx                 # Root component
│   ├── 📄 index.css               # Tailwind + custom styles
│   └── 📄 main.jsx                # Entry point
├── 📄 tailwind.config.js          # Theme configuration
├── 📄 vite.config.js              # Build configuration
└── 📄 package.json                # Dependencies
```

### State Management Flow

```
┌─────────────────┐
│   useSimulation │
│     (Hook)      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌────────┐
│  NPCs │ │ Events │
└───┬───┘ └───┬────┘
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│WorldState│ │Selected  │
│         │ │   NPC     │
└─────────┘ └──────────┘
```

---

## 🎯 Commands

### Navigation Commands
| Command | Description | Page |
|---------|-------------|------|
| `pause` | Pause simulation | Any |
| `play` | Resume simulation | Any |
| `reset` | Restart simulation | Any |
| `status` | Show system status | Any |

### Entity Commands
| Command | Description | Shortcut |
|---------|-------------|----------|
| `npcs` | List all entities | Global |
| `couples` | View all couples | Global |
| `families` | View family trees | Global |
| `bond` | Force bond between entities | Global |
| `reproduce` | Trigger reproduction | Global |
| `energizeall` | Energize all entities | Global |
| `removeall` | Remove all entities | Global |

### World Commands
| Command | Description | Args |
|---------|-------------|------|
| `resources` | View resource status | - |
| `spawn` | Spawn resources | amount |
| `speed` | Set sim speed | 1-10 |
| `save` | Save simulation state | - |
| `load` | Load saved state | - |

### Console Commands
| Command | Description |
|---------|-------------|
| `clear` | Clear console history |

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--leviathan-bg` | `#0a0a0f` | Background |
| `--leviathan-surface` | `#12121a` | Panels |
| `--leviathan-surface-light` | `#1a1a27` | Inputs |
| `--leviathan-primary` | `#00d4ff` | Primary accent |
| `--leviathan-secondary` | `#7c3aed` | Secondary accent |
| `--leviathan-accent` | `#a855f7` | Highlights |
| `--leviathan-success` | `#22c55e` | Success states |
| `--leviathan-warning` | `#eab308` | Warnings |
| `--leviathan-danger` | `#ef4444` | Errors |

### Typography

- **Primary**: `JetBrains Mono` (monospace)
- **Weights**: 400, 500, 600, 700
- **Sizes**: 10px (labels), 14px (body), 16px (headers)

### Animations

| Animation | Duration | Easing |
|-----------|----------|--------|
| `fadeIn` | 300ms | ease-out |
| `scanline` | 3s | linear (infinite) |
| `panelSlide` | 200ms | ease-in-out |

---

## 🧩 Component API

### TopBar
```jsx
<TopBar
  isRunning={boolean}
  tick={number}
  npcCount={number}
  speed={number}
  onPlay={() => {}}
  onPause={() => {}}
  onRestart={() => {}}
  onSpeedChange={(speed) => {}}
  onMenuToggle={() => {}}
/>
```

### Sidebar
```jsx
<Sidebar
  isOpen={boolean}
  onClose={() => {}}
  currentView={string}
  onViewChange={(view) => {}}
/>
```

### RelationshipGraph
```jsx
<RelationshipGraph
  npcs={Array}
  // Features: Zoom, Pan, Hover tooltips, Fullscreen
/>
```

---

## 📱 Responsive Behavior

The dashboard is optimized for **desktop/tablet** use with a minimum resolution of **1280x720**.

| Breakpoint | Layout |
|------------|--------|
| ≥1440px | Full 3-panel layout |
| 1280-1439px | Condensed panels |
| <1280px | Sidebar navigation recommended |

---

## 🛠️ Customization

### Theme Configuration

Edit `tailwind.config.js`:

```javascript
colors: {
  leviathan: {
    bg: '#0a0a0f',
    surface: '#12121a',
    // ... add custom colors
  }
}
```

### Custom Scrollbars

```css
.scrollbar-visible::-webkit-scrollbar {
  width: 8px;
}
.scrollbar-visible::-webkit-scrollbar-thumb {
  background: #3a3a4a;
  border-radius: 4px;
}
```

---

## 📸 Screenshots

> **Note**: Add screenshots to `/docs/screenshots/` and reference them here.

| Dashboard | Entity View | World View |
|-----------|-------------|------------|
| [Screenshot] | [Screenshot] | [Screenshot] |

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

**Built with** ⚡ **React** + **Tailwind** + **Framer Motion**

<p align="center">
  <sub>Leviathan Dashboard v1.0.0</sub>
</p>

</div>
