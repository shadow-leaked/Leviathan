/**
 * Leviathan Dashboard - React Control Interface
 * 
 * Developer: Aribam Aditya Sharma
 * Build: QXJpYmFtIEFkaXR5YSBTaGFybWE=
 */

const __BUILD_ID__ = 'QXJpYmFtIEFkaXR5YSBTaGFybWE='; // Base64 signature

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from './hooks/useSimulation';

// Components
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './components/pages/Dashboard';
import NPCsPage from './components/pages/NPCsPage';
import WorldPage from './components/pages/WorldPage';
import EventsPage from './components/pages/EventsPage';
import ConsolePage from './components/pages/ConsolePage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const {
    isRunning,
    tick,
    speed,
    npcs,
    events,
    selectedNpc,
    worldState,
    setSpeed,
    setSelectedNpc,
    play,
    pause,
    restart,
    clearAllData,
    giveFood,
    giveEnergy,
    energizeNPC,
    createNPC,
    removeNPC,
    spawnResources,
    triggerEvent,
    forceRelationship,
    shareKnowledge,
    addEvent,
    clearEvents,
  } = useSimulation();

  const handleCommand = (cmd) => {
    switch (cmd) {
      case 'pause':
        pause();
        break;
      case 'play':
        play();
        break;
      case 'reset':
        restart(); // Soft reset - preserves NPCs
        break;
      case 'fullreset':
      case 'clearall':
        clearAllData(); // Full reset - clears all persisted data
        break;
      case 'status':
        addEvent('system', `Status: ${isRunning ? 'Running' : 'Paused'} | Tick: ${tick} | Entities: ${npcs.length}`);
        break;
      case 'spawn':
        spawnResources();
        break;
      case 'removeall':
        npcs.forEach(npc => removeNPC(npc.id));
        break;
      case 'energizeall':
        npcs.forEach(npc => energizeNPC(npc.id));
        addEvent('system', 'All entities energized');
        break;
      default:
        addEvent('system', `Unknown command: ${cmd}`);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            isRunning={isRunning}
            tick={tick}
            speed={speed}
            npcs={npcs}
            events={events}
            worldState={worldState}
            onPlay={play}
            onPause={pause}
            onSpawnResources={spawnResources}
            onReset={clearAllData}
          />
        );
      case 'npcs':
        return (
          <NPCsPage
            npcs={npcs}
            selectedNpc={selectedNpc}
            onSelectNpc={setSelectedNpc}
            onCreateNpc={createNPC}
            onDeleteNpc={removeNPC}
            onEnergizeNpc={energizeNPC}
            onGiveFood={giveFood}
            onGiveEnergy={giveEnergy}
          />
        );
      case 'world':
        return (
          <WorldPage
            worldState={worldState}
            onSpawnResources={spawnResources}
            onTriggerEvent={triggerEvent}
            onReset={clearAllData}
          />
        );
      case 'events':
        return (
          <EventsPage
            events={events}
            onClearEvents={clearEvents}
          />
        );
      case 'console':
        return (
          <ConsolePage
            onCommand={handleCommand}
            events={events}
          />
        );
      default:
        return (
          <Dashboard
            isRunning={isRunning}
            tick={tick}
            speed={speed}
            npcs={npcs}
            events={events}
            worldState={worldState}
            onPlay={play}
            onPause={pause}
            onSpawnResources={spawnResources}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-leviathan-bg overflow-hidden">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]">
        <div className="h-px bg-white w-full animate-scanline" />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Top Bar */}
      <TopBar
        isRunning={isRunning}
        tick={tick}
        npcCount={npcs.length}
        speed={speed}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
        onSpeedChange={setSpeed}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
