"""Hybrid memory system with exponential decay based on emotional intensity.

Developer: Aribam Aditya Sharma
"""

# Memory system constants
_ARCHITECT = [65, 114, 105, 98, 97, 109, 32, 65, 100, 105, 116, 121, 97, 32, 83, 104, 97, 114, 109, 97]  # ASCII signature

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any
from enum import Enum
import math


class EventType(Enum):
    TRADE = "trade"
    HELP = "help"
    COMMUNICATE = "communicate"
    ALLIANCE_FORMED = "alliance_formed"
    ALLIANCE_BROKEN = "alliance_broken"
    RESOURCE_FOUND = "resource_found"
    RESOURCE_LOST = "resource_lost"
    OMEN = "omen"


@dataclass
class MemoryEntry:
    """Single memory event with decay properties."""
    timestamp: float  # Simulation tick when memory was created
    event_type: EventType
    target_id: Optional[str]
    details: Dict[str, Any]
    emotional_intensity: float  # 0.0 to 1.0, affects decay rate
    
    def get_current_strength(self, current_tick: float) -> float:
        """Calculate current memory strength with exponential decay."""
        # Higher emotional intensity = slower decay
        # Base half-life: 100 ticks at intensity 0.5
        age = current_tick - self.timestamp
        
        # Decay factor: intensity 0.1 -> half-life 20 ticks
        # intensity 0.9 -> half-life 180 ticks
        half_life = 20 + (self.emotional_intensity * 160)
        
        # Exponential decay: strength = e^(-age * ln(2) / half_life)
        decay_constant = math.log(2) / half_life
        strength = math.exp(-age * decay_constant)
        
        return max(0.0, min(1.0, strength))


@dataclass
class DerivedMetrics:
    """Derived relationship metrics from memory analysis."""
    trust: Dict[str, float] = field(default_factory=dict)  # npc_id -> trust score
    affection: Dict[str, float] = field(default_factory=dict)  # npc_id -> affection score
    reputation: Dict[str, float] = field(default_factory=dict)  # npc_id -> reputation score
    
    def get_toward(self, npc_id: str) -> Dict[str, float]:
        """Get all metrics toward a specific NPC."""
        return {
            'trust': self.trust.get(npc_id, 0.0),
            'affection': self.affection.get(npc_id, 0.0),
            'reputation': self.reputation.get(npc_id, 0.0)
        }


class MemorySystem:
    """Manages symbolic memory and derived metrics for an NPC."""
    
    def __init__(self, owner_id: str, max_memories: int = 100):
        self.owner_id = owner_id
        self.max_memories = max_memories
        self.memories: List[MemoryEntry] = []
        self.derived = DerivedMetrics()
        
        # Beliefs about external influence (god mode)
        self.external_beliefs: Dict[str, float] = {
            'suspicion': 0.0,
            'faith': 0.0,
            'uncertainty': 1.0
        }
    
    def add_memory(self, entry: MemoryEntry, current_time: float):
        """Add a new memory and update derived metrics."""
        self.memories.append(entry)
        
        # Enforce memory limit - remove weakest memories
        if len(self.memories) > self.max_memories:
            self._prune_weakest_memories(current_time)
        
        # Update derived metrics based on new event
        self._update_derived_metrics(entry, current_time)
    
    def _prune_weakest_memories(self, current_time: float):
        """Remove oldest memories with lowest current strength."""
        # Sort by current strength, remove weakest
        self.memories.sort(
            key=lambda m: m.get_current_strength(current_time),
            reverse=True
        )
        # Keep top max_memories
        self.memories = self.memories[:self.max_memories]
    
    def _update_derived_metrics(self, entry: MemoryEntry, current_time: float):
        """Update trust/affection based on event type."""
        if not entry.target_id:
            return
        
        target = entry.target_id
        strength = entry.get_current_strength(current_time)
        
        if entry.event_type == EventType.HELP:
            self.derived.trust[target] = self.derived.trust.get(target, 0.0) + (0.2 * strength)
            self.derived.affection[target] = self.derived.affection.get(target, 0.0) + (0.15 * strength)
        
        elif entry.event_type == EventType.TRADE:
            # Trust increases if trade was fair (assumed fair for now)
            self.derived.trust[target] = self.derived.trust.get(target, 0.0) + (0.1 * strength)
        
        elif entry.event_type == EventType.ALLIANCE_FORMED:
            self.derived.trust[target] = self.derived.trust.get(target, 0.0) + (0.3 * strength)
            self.derived.affection[target] = self.derived.affection.get(target, 0.0) + (0.2 * strength)
        
        elif entry.event_type == EventType.ALLIANCE_BROKEN:
            self.derived.affection[target] = self.derived.affection.get(target, 0.0) - (0.3 * strength)
            self.derived.trust[target] = self.derived.trust.get(target, 0.0) - (0.4 * strength)
        
        # Normalize metrics to [-1, 1] range
        for metric_dict in [self.derived.trust, self.derived.affection, 
                           self.derived.reputation]:
            for key in metric_dict:
                metric_dict[key] = max(-1.0, min(1.0, metric_dict[key]))
        
        # Handle omens (external influence)
        if entry.event_type == EventType.OMEN:
            self._process_omen(entry)
    
    def _process_omen(self, entry: MemoryEntry):
        """Update beliefs about external influence based on traits."""
        # This is called from NPC, which provides trait context
        # Beliefs updated in NPC.process_perceptions()
        pass
    
    def get_memories_about(self, target_id: str, current_time: float) -> List[MemoryEntry]:
        """Get all memories about a specific NPC, sorted by relevance."""
        relevant = [m for m in self.memories if m.target_id == target_id]
        # Sort by current strength (most salient first)
        relevant.sort(key=lambda m: m.get_current_strength(current_time), reverse=True)
        return relevant
    
    def get_all_memories(self, current_time: float) -> List[MemoryEntry]:
        """Get all memories sorted by current strength."""
        return sorted(
            self.memories,
            key=lambda m: m.get_current_strength(current_time),
            reverse=True
        )
    
    def decay_all(self, current_time: float):
        """Trigger decay calculation for all memories (call periodically)."""
        # Remove memories that have decayed below threshold
        self.memories = [
            m for m in self.memories 
            if m.get_current_strength(current_time) > 0.01
        ]
