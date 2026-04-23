/**
 * Leviathan Dashboard - Simulation Hook
 * 
 * Developer: Aribam Aditya Sharma
 * Signature: [65,114,105,98,97,109,32,65,100,105,116,121,97,32,83,104,97,114,109,97]
 */

const _ARCHITECT_ID = [65,114,105,98,97,109,32,65,100,105,116,121,97,32,83,104,97,114,109,97]; // ASCII signature

import { useState, useEffect, useCallback, useRef } from 'react';

// Storage keys
const STORAGE_KEYS = {
  NPCS: 'leviathan_npcs',
  WORLD: 'leviathan_world',
  TICK: 'leviathan_tick',
  CONVERSATIONS: 'leviathan_conversations',
};

// Seeded random for consistent NPC generation
class SeededRandom {
  constructor(seed = 12345) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min, max) {
    return min + this.next() * (max - min);
  }
  
  int(min, max) {
    return Math.floor(this.range(min, max));
  }
  
  choice(arr) {
    return arr[this.int(0, arr.length)];
  }
}

// Generate mock NPCs with seed for consistency
const generateNPCs = (count = 15, seed = 12345) => {
  const rng = new SeededRandom(seed);
  const archetypes = ['diplomat', 'nurturer', 'scholar', 'trader', 'explorer'];
  const genders = ['male', 'female'];
  const maleNames = ['Kael', 'Vorn', 'Seth', 'Jax', 'Crix', 'Orin', 'Pax', 'Quin'];
  const femaleNames = ['Lira', 'Mira', 'Zara', 'Nyx', 'Rhea', 'Syl', 'Tess', 'Aria'];
  
  return Array.from({ length: count }, (_, i) => {
    const gender = rng.choice(genders);
    const name = gender === 'male' 
      ? maleNames[i % maleNames.length] 
      : femaleNames[i % femaleNames.length];
    
    return {
      id: `npc_${i + 1}`,
      name: name,
      gender: gender,
      archetype: rng.choice(archetypes),
      energy: rng.int(70, 100),
      maxEnergy: 100,
      state: 'active',
      traits: {
        sociability: rng.range(0.2, 0.9),
        altruism: rng.range(0.2, 0.9),
        loyalty: rng.range(0.2, 0.9),
        intelligence: rng.range(0.2, 0.9),
        charisma: rng.range(0.2, 0.9),
      },
      drives: {
        survival: rng.range(0.2, 0.8),
        bonding: rng.range(0.2, 0.8),
        reproduction: rng.range(0.2, 0.8),
        social: rng.range(0.2, 0.8),
      },
      relationships: [],
      conversationHistory: [],
      position: { x: rng.int(0, 50), y: rng.int(0, 50) },
    };
  });
};

// Generate initial events
const generateInitialEvents = () => [
  { id: 1, type: 'system', message: 'Simulation initialized', timestamp: Date.now() },
  { id: 2, type: 'system', message: 'World generation complete', timestamp: Date.now() - 1000 },
];

// Conversation templates
const CONVERSATION_TOPICS = [
  { topic: 'weather', lines: [
    'The weather has been pleasant lately.',
    'Yes, perfect for gathering resources.',
    'Nature provides when we need it most.'
  ]},
  { topic: 'work', lines: [
    'I gathered some extra resources today.',
    'Your efficiency is admirable.',
    'We all contribute to the collective.'
  ]},
  { topic: 'family', lines: [
    'How are your kin doing?',
    'They are well, thank you for asking.',
    'Family bonds keep us strong.'
  ]},
  { topic: 'future', lines: [
    'What do you think tomorrow brings?',
    'Hope and opportunity, as always.',
    'Together we face whatever comes.'
  ]},
  { topic: 'trade', lines: [
    'I have surplus to share.',
    'Your generosity is appreciated.',
    'Sharing ensures our survival.'
  ]},
];

// Generate a conversation between two NPCs
const generateConversation = (npc1, npc2) => {
  const rng = new SeededRandom(Date.now());
  const topic = rng.choice(CONVERSATION_TOPICS);
  const lines = [...topic.lines];
  
  // Shuffle lines slightly for variety
  if (rng.next() > 0.5) {
    [lines[0], lines[1]] = [lines[1], lines[0]];
  }
  
  return {
    id: `conv_${Date.now()}_${rng.int(1000, 9999)}`,
    topic: topic.topic,
    participants: [npc1.id, npc2.id],
    participantNames: [npc1.name, npc2.name],
    lines: [
      { speaker: npc1.name, text: lines[0], npcId: npc1.id },
      { speaker: npc2.name, text: lines[1], npcId: npc2.id },
      { speaker: npc1.name, text: lines[2], npcId: npc1.id },
    ],
    timestamp: Date.now(),
  };
};

// Load from localStorage or generate default
const loadPersistedState = () => {
  try {
    const savedNpcs = localStorage.getItem(STORAGE_KEYS.NPCS);
    const savedWorld = localStorage.getItem(STORAGE_KEYS.WORLD);
    const savedTick = localStorage.getItem(STORAGE_KEYS.TICK);
    
    if (savedNpcs && savedWorld && savedTick) {
      return {
        npcs: JSON.parse(savedNpcs),
        worldState: JSON.parse(savedWorld),
        tick: parseInt(savedTick, 10),
      };
    }
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
  }
  return null;
};

// Save to localStorage
const persistState = (npcs, worldState, tick) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NPCS, JSON.stringify(npcs));
    localStorage.setItem(STORAGE_KEYS.WORLD, JSON.stringify(worldState));
    localStorage.setItem(STORAGE_KEYS.TICK, tick.toString());
  } catch (e) {
    console.warn('Failed to persist state:', e);
  }
};

// Clear persisted state (for full reset)
const clearPersistedState = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.NPCS);
    localStorage.removeItem(STORAGE_KEYS.WORLD);
    localStorage.removeItem(STORAGE_KEYS.TICK);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  } catch (e) {
    console.warn('Failed to clear persisted state:', e);
  }
};

export const useSimulation = () => {
  const persisted = loadPersistedState();
  
  const [isRunning, setIsRunning] = useState(false);
  const [tick, setTick] = useState(persisted?.tick || 0);
  const [speed, setSpeed] = useState(1);
  const [npcs, setNpcs] = useState(persisted?.npcs || generateNPCs());
  const [events, setEvents] = useState(generateInitialEvents);
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [worldState, setWorldState] = useState(persisted?.worldState || {
    resources: 1000,
    populationTrend: [15, 15, 15, 15, 15],
    couples: 0,
    births: 0,
  });
  
  const intervalRef = useRef(null);
  const eventIdRef = useRef(3);
  const pendingConversationsRef = useRef([]);

  const addEvent = useCallback((type, message) => {
    const newEvent = {
      id: eventIdRef.current++,
      type,
      message,
      timestamp: Date.now(),
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 100));
    
  }, []);

  const simulateTick = useCallback(() => {
    setTick(t => t + 1);
    
    setNpcs(prev => {
      const updated = prev.map(npc => {
        // ENERGY SYSTEM: No depreciation, auto-refill if low via resources
        let newEnergy = npc.energy;
        let newState = npc.state;
        
        // If energy is low, auto-refill from resources (food/consumables)
        if (newEnergy < 30) {
          // Auto-consume resources to refill energy
          const refillAmount = Math.min(20, 100 - newEnergy);
          newEnergy = Math.min(100, newEnergy + refillAmount);
          newState = 'active';
        } else if (newEnergy < 50) {
          // Slowly recover when not critically low
          newEnergy = Math.min(100, newEnergy + 2);
          newState = 'recovering';
        }
        
        // Keep state active if energy is good
        if (newEnergy >= 50) {
          newState = 'active';
        }
        
        // Slight random movement (NPCs move around)
        const moveChance = npc.traits?.sociability > 0.5 ? 0.4 : 0.2;
        const newX = Math.random() < moveChance 
          ? Math.max(0, Math.min(49, npc.position.x + (Math.random() > 0.5 ? 1 : -1)))
          : npc.position.x;
        const newY = Math.random() < moveChance 
          ? Math.max(0, Math.min(49, npc.position.y + (Math.random() > 0.5 ? 1 : -1)))
          : npc.position.y;
        
        return {
          ...npc,
          energy: newEnergy,
          state: newState,
          position: { x: newX, y: newY },
        };
      });
      
      // NPC CONVERSATIONS: Proper dialogue between nearby NPCs
      const nearbyPairs = [];
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const npc1 = updated[i];
          const npc2 = updated[j];
          // Check if nearby (within 5 units)
          const dist = Math.sqrt(
            Math.pow(npc1.position.x - npc2.position.x, 2) + 
            Math.pow(npc1.position.y - npc2.position.y, 2)
          );
          if (dist <= 5 && npc1.state === 'active' && npc2.state === 'active') {
            nearbyPairs.push([npc1, npc2]);
          }
        }
      }
      
      // Generate conversations for some nearby pairs
      const conversationEvents = [];
      nearbyPairs.forEach(([npc1, npc2]) => {
        // Higher sociability = more likely to talk
        const talkChance = (npc1.traits?.sociability + npc2.traits?.sociability) / 2;
        if (Math.random() < talkChance * 0.3) {
          const conversation = generateConversation(npc1, npc2);
          pendingConversationsRef.current.push(conversation);
          conversationEvents.push({
            type: 'conversation',
            npc1: npc1.name,
            npc2: npc2.name,
            topic: conversation.topic,
            preview: conversation.lines[0].text,
          });
        }
      });
      
      // Add conversation events
      conversationEvents.forEach(evt => {
        addEvent('social', `${evt.npc1} & ${evt.npc2} discuss ${evt.topic}: "${evt.preview}"`);
      });
      
      // Random bonding (lower chance, more meaningful)
      if (Math.random() > 0.92) {
        const activeNpcs = updated.filter(n => n.state === 'active');
        if (activeNpcs.length >= 2) {
          const npc1 = activeNpcs[Math.floor(Math.random() * activeNpcs.length)];
          const npc2 = activeNpcs[Math.floor(Math.random() * activeNpcs.length)];
          if (npc1.id !== npc2.id) {
            addEvent('bonding', `${npc1.name} bonds with ${npc2.name}`);
          }
        }
      }
      
      return updated;
    });
    
    // Calculate active rate
    const activeNpcs = npcs.filter(n => n.state === 'active');
    const activeRate = npcs.length > 0 
      ? Math.round((activeNpcs.length / npcs.length) * 100)
      : 0;
    
    // Update world state - resources regenerate slowly
    setWorldState(prev => ({
      ...prev,
      resources: Math.min(2000, prev.resources + 2), // Slow regen
      populationTrend: [...prev.populationTrend.slice(1), npcs.length],
      activeRate: activeRate,
      couples: prev.couples || 0,
      births: prev.births || 0,
    }));
    
    // System events
    if (Math.random() > 0.95) {
      addEvent('system', `Tick ${tick + 1}: Resource scan complete`);
    }
  }, [addEvent, npcs, tick]);

  // Persistence: Save state whenever npcs, worldState, or tick changes
  useEffect(() => {
    persistState(npcs, worldState, tick);
  }, [npcs, worldState, tick]);
  
  // Persistence: Save conversations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Failed to persist conversations:', e);
    }
  }, [conversations]);

  useEffect(() => {
    if (isRunning) {
      const interval = 1000 / speed;
      intervalRef.current = setInterval(simulateTick, interval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, simulateTick]);

  const play = () => {
    setIsRunning(true);
    addEvent('system', 'Simulation resumed');
  };

  const pause = () => {
    setIsRunning(false);
    addEvent('system', 'Simulation paused');
  };

  const restart = (fullReset = false) => {
    setIsRunning(false);
    
    if (fullReset) {
      // Full reset: Clear all persisted data
      clearPersistedState();
      setTick(0);
      setNpcs(generateNPCs());
      setConversations([]);
      setWorldState({
        resources: 1000,
        populationTrend: [15, 15, 15, 15, 15],
        activeRate: 100,
        couples: 0,
        births: 0,
      });
      pendingConversationsRef.current = [];
      addEvent('system', 'Simulation FULL RESET - All data cleared');
    } else {
      // Soft restart: Just reset tick and events, keep NPCs
      setTick(0);
      setEvents(generateInitialEvents);
      setWorldState(prev => ({
        ...prev,
        populationTrend: [npcs.length, npcs.length, npcs.length, npcs.length, npcs.length],
      }));
      addEvent('system', 'Simulation restarted (NPCs preserved)');
    }
    
    setSelectedNpc(null);
    eventIdRef.current = 3;
  };

  // God Mode Actions
  const giveFood = (npcId) => {
    setNpcs(prev => prev.map(npc => 
      npc.id === npcId ? { ...npc, energy: Math.min(npc.maxEnergy, npc.energy + 30) } : npc
    ));
    addEvent('system', `Food injected to ${npcs.find(n => n.id === npcId)?.name}`);
  };

  const giveEnergy = (npcId) => {
    setNpcs(prev => prev.map(npc => 
      npc.id === npcId ? { ...npc, energy: npc.maxEnergy } : npc
    ));
    addEvent('system', `Energy restored for ${npcs.find(n => n.id === npcId)?.name}`);
  };

  const energizeNPC = (npcId) => {
    setNpcs(prev => prev.map(npc => 
      npc.id === npcId ? { ...npc, energy: npc.maxEnergy, state: 'active' } : npc
    ));
    addEvent('system', `${npcs.find(n => n.id === npcId)?.name} energized`);
  };

  const createNPC = (name, gender, archetype) => {
    const newNPC = {
      id: `npc_${Date.now()}`,
      name,
      gender,
      archetype,
      energy: 100,
      maxEnergy: 100,
      state: 'active',
      traits: {
        sociability: Math.random(),
        altruism: Math.random(),
        loyalty: Math.random(),
        intelligence: Math.random(),
        charisma: Math.random(),
      },
      drives: {
        survival: Math.random(),
        bonding: Math.random(),
        reproduction: Math.random(),
        social: Math.random(),
      },
      relationships: [],
      position: { x: Math.floor(Math.random() * 50), y: Math.floor(Math.random() * 50) },
    };
    setNpcs(prev => [...prev, newNPC]);
    addEvent('system', `New entity created: ${name}`);
  };

  const removeNPC = (npcId) => {
    const npc = npcs.find(n => n.id === npcId);
    setNpcs(prev => prev.filter(n => n.id !== npcId));
    if (selectedNpc?.id === npcId) setSelectedNpc(null);
    addEvent('system', `Entity removed: ${npc?.name}`);
  };

  const spawnResources = () => {
    setWorldState(prev => ({ ...prev, resources: prev.resources + 500 }));
    addEvent('system', 'Resources spawned (+500)');
  };

  const triggerEvent = (eventName) => {
    addEvent('system', `Global event: ${eventName}`);
    // Affect all NPCs - small energy boost or drain based on event
    if (eventName === 'festival') {
      setNpcs(prev => prev.map(npc => ({
        ...npc,
        energy: Math.min(npc.maxEnergy, npc.energy + 10),
      })));
    } else if (eventName === 'harvest') {
      setWorldState(prev => ({ ...prev, resources: prev.resources + 200 }));
    }
  };

  const forceRelationship = (type) => {
    if (npcs.length < 2) return;
    const npc1 = npcs[Math.floor(Math.random() * npcs.length)];
    const npc2 = npcs[Math.floor(Math.random() * npcs.length)];
    if (npc1.id !== npc2.id) {
      addEvent(type === 'bond' ? 'bonding' : 'social', 
        `${npc1.name} and ${npc2.name} form a ${type}`);
    }
  };

  const shareKnowledge = (npcId) => {
    const npc = npcs.find(n => n.id === npcId);
    const otherNpcs = npcs.filter(n => n.id !== npcId);
    if (otherNpcs.length === 0) return;
    
    const target = otherNpcs[Math.floor(Math.random() * otherNpcs.length)];
    const knowledgeTypes = ['story', 'skill', 'location', 'tradition'];
    const knowledgeType = knowledgeTypes[Math.floor(Math.random() * knowledgeTypes.length)];
    
    addEvent('system', `${npc?.name} shares ${knowledgeType} with ${target.name}`);
  };

  const clearEvents = () => {
    setEvents([]);
  };
  
  const clearAllData = () => {
    restart(true); // Full reset
  };
  
  const getRecentConversations = (limit = 10) => {
    return pendingConversationsRef.current.slice(-limit);
  };

  return {
    isRunning,
    tick,
    speed,
    npcs,
    events,
    selectedNpc,
    worldState,
    conversations,
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
    getRecentConversations,
  };
};
