"""Social NPC with energy, states, age, and reproduction.

Developer: Aribam Aditya Sharma
"""

import random
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Set
from enum import Enum

from leviathan.core.memory import MemorySystem, MemoryEntry, EventType
from leviathan.society.relationships import SocialRelationshipManager


class State(Enum):
    """NPC activity states."""
    ACTIVE = "active"
    WEAKENED = "weakened"      # Energy <= 0, can only recover
    RECOVERING = "recovering"  # Gaining energy back


class Gender(Enum):
    """NPC gender."""
    MALE = "male"
    FEMALE = "female"


@dataclass
class Personality:
    """Personality traits (0.0 to 1.0)."""
    # Social traits
    sociability: float = 0.5   # Desire to interact
    altruism: float = 0.5      # Willingness to help
    loyalty: float = 0.5       # Commitment to partners/friends
    # Reproduction traits
    attractiveness: float = 0.5  # Physical/social appeal
    nurturing: float = 0.5       # Care for offspring
    fertility: float = 0.5       # Base reproduction chance
    # Survival traits
    caution: float = 0.5       # Risk aversion
    efficiency: float = 0.5    # Resource gathering skill
    
    def __post_init__(self):
        for attr in ['sociability', 'altruism', 'loyalty', 'attractiveness', 
                     'nurturing', 'fertility', 'caution', 'efficiency']:
            setattr(self, attr, max(0.0, min(1.0, getattr(self, attr))))


@dataclass
class Vitals:
    """Physical state of NPC."""
    energy: float = 80.0       # 0-100, core resource for all actions
    age: int = 0               # Ticks lived
    
    def __post_init__(self):
        self.energy = max(0.0, min(100.0, self.energy))


@dataclass
class Drives:
    """Motivational drives (0.0 to 1.0 urgency)."""
    survival: float = 0.3      # Energy acquisition
    social: float = 0.3        # Interaction desire
    bonding: float = 0.2       # Forming relationships
    reproduction: float = 0.2  # Desire to have offspring
    
    def update(self, state: Vitals, personality: Personality, has_partner: bool):
        """Recalculate drives based on state."""
        # Survival: high when energy low
        self.survival = 1.0 - (state.energy / 100.0)
        self.survival *= (1.0 + personality.caution) / 2.0
        
        # Social: driven by sociability and energy
        self.social = personality.sociability * (state.energy / 100.0)
        
        # Bonding: increases with age until mature, then stable
        maturity_factor = min(1.0, state.age / 50.0)  # Mature at 50 ticks
        self.bonding = personality.loyalty * maturity_factor
        
        # Reproduction: peaks in middle age, requires partner
        if has_partner:
            # Prime reproduction age: 30-100 ticks
            age_factor = 1.0 - abs(state.age - 65) / 100.0
            age_factor = max(0.0, min(1.0, age_factor))
            self.reproduction = personality.fertility * age_factor * (state.energy / 100.0)
        else:
            self.reproduction = personality.fertility * 0.3  # Seek partner


class SocialNPC:
    """NPC designed for social simulation."""
    
    def __init__(
        self,
        npc_id: str,
        name: str,
        gender: Optional[Gender] = None,
        personality: Optional[Personality] = None,
        vitals: Optional[Vitals] = None,
        x: int = 0,
        y: int = 0,
        parents: Optional[tuple] = None
    ):
        self.id = npc_id
        self.name = name
        self.gender = gender or random.choice([Gender.MALE, Gender.FEMALE])
        self.personality = personality or Personality()
        self.vitals = vitals or Vitals()
        
        self.x = x
        self.y = y
        self.parents = parents  # (father_id, mother_id) or None
        
        # State
        self.state = State.ACTIVE
        
        # Social
        self.partner_id: Optional[str] = None
        self.children: List[str] = []
        self.relationships = SocialRelationshipManager()
        
        # Memory
        self.memory = MemorySystem(npc_id)
        
        # Tracking
        self.drives = Drives()
        self.drives.update(self.vitals, self.personality, False)
        
        self.last_action: Optional[str] = None
        self.last_action_target: Optional[str] = None
    
    def get_state(self) -> State:
        """Update and return current state."""
        if self.vitals.energy <= 0:
            self.state = State.WEAKENED
        elif self.vitals.energy < 20:
            self.state = State.RECOVERING
        elif self.state == State.RECOVERING and self.vitals.energy > 50:
            self.state = State.ACTIVE
        elif self.state == State.WEAKENED and self.vitals.energy > 10:
            self.state = State.RECOVERING
        
        return self.state
    
    def can_act(self) -> bool:
        """Check if NPC can perform actions."""
        return self.get_state() == State.ACTIVE
    
    def consume_energy(self, amount: float) -> bool:
        """Consume energy for action. Returns False if insufficient."""
        if self.vitals.energy < amount:
            return False
        self.vitals.energy -= amount
        return True
    
    def gain_energy(self, amount: float):
        """Gain energy (from food/rest)."""
        self.vitals.energy = min(100.0, self.vitals.energy + amount)
    
    
    def tick(self, current_tick: int, population_factor: float = 1.0):
        """Advance NPC by one tick."""
        # Age
        self.vitals.age += 1
        
        # Base energy decay (higher with population pressure)
        base_decay = 2.0 * population_factor
        self.vitals.energy -= base_decay
        
        
        # Energy floor at 0 (don't go negative, just weakened)
        self.vitals.energy = max(0.0, self.vitals.energy)
        
        # Update drives
        has_partner = self.partner_id is not None
        self.drives.update(self.vitals, self.personality, has_partner)
        
        # Update state
        self.get_state()
        
        # Decay memories
        self.memory.decay_all(float(current_tick))
        
        # Decay relationships slightly
        self.relationships.decay_relationships(decay_rate=0.005)
    
    def form_couple(self, partner_id: str, tick: int = 0) -> bool:
        """Form a couple/partnership."""
        if self.partner_id is not None:
            return False
        
        self.partner_id = partner_id
        
        # Record in memory
        entry = MemoryEntry(
            timestamp=float(tick),
            event_type=EventType.ALLIANCE_FORMED,  # Reuse for now
            target_id=partner_id,
            details={'type': 'couple_formed'},
            emotional_intensity=0.8
        )
        self.memory.add_memory(entry, float(tick))
        
        # Strong relationship boost
        self.relationships.update_relationship(
            partner_id,
            attraction_delta=0.4,
            trust_delta=0.5,
            affinity_delta=0.3,
            tick=tick
        )
        
        return True
    
    def break_couple(self, tick: int = 0):
        """Break partnership."""
        if self.partner_id is None:
            return
        
        old_partner = self.partner_id
        self.partner_id = None
        
        entry = MemoryEntry(
            timestamp=float(tick),
            event_type=EventType.ALLIANCE_BROKEN,
            target_id=old_partner,
            details={'type': 'couple_broken'},
            emotional_intensity=0.7
        )
        self.memory.add_memory(entry, float(tick))
        
        # Relationship strain
        self.relationships.update_relationship(
            old_partner,
            trust_delta=-0.4,
            attraction_delta=-0.3,
            tick=tick
        )
    
    def add_child(self, child_id: str, tick: int = 0):
        """Record child birth."""
        self.children.append(child_id)
        
        entry = MemoryEntry(
            timestamp=float(tick),
            event_type=EventType.OMEN,  # Reuse for now
            target_id=None,
            details={'event': 'child_born', 'child_id': child_id},
            emotional_intensity=0.9
        )
        self.memory.add_memory(entry, float(tick))
    
    def is_fertile(self) -> bool:
        """Check if NPC can reproduce."""
        if self.partner_id is None:
            return False
        if self.vitals.energy < 50:
            return False
        if self.vitals.age < 20 or self.vitals.age > 150:
            return False
        return True
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize NPC state."""
        return {
            'id': self.id,
            'name': self.name,
            'gender': self.gender.value,
            'age': self.vitals.age,
            'state': self.get_state().value,
            'vitals': {
                'energy': self.vitals.energy
            },
            'partner': self.partner_id,
            'children': self.children,
            'parents': self.parents,
            'position': {'x': self.x, 'y': self.y},
            'last_action': self.last_action,
            'can_act': self.can_act()
        }
    
    @staticmethod
    def create_offspring(
        father: 'SocialNPC',
        mother: 'SocialNPC',
        child_id: str,
        child_name: str,
        tick: int = 0
    ) -> 'SocialNPC':
        """Create child with inherited traits."""
        # Determine gender
        gender = random.choice([Gender.MALE, Gender.FEMALE])
        
        # Inherit traits with mutation
        def inherit_trait(p1, p2, mutation=0.1):
            base = (p1 + p2) / 2
            noise = random.uniform(-mutation, mutation)
            return max(0.0, min(1.0, base + noise))
        
        f, m = father.personality, mother.personality
        
        personality = Personality(
            sociability=inherit_trait(f.sociability, m.sociability),
            altruism=inherit_trait(f.altruism, m.altruism),
            loyalty=inherit_trait(f.loyalty, m.loyalty),
            attractiveness=inherit_trait(f.attractiveness, m.attractiveness),
            nurturing=inherit_trait(f.nurturing, m.nurturing),
            fertility=inherit_trait(f.fertility, m.fertility),
            caution=inherit_trait(f.caution, m.caution),
            efficiency=inherit_trait(f.efficiency, m.efficiency)
        )
        
        # Position near parents
        x = (father.x + mother.x) // 2 + random.randint(-2, 2)
        y = (father.y + mother.y) // 2 + random.randint(-2, 2)
        
        child = SocialNPC(
            npc_id=child_id,
            name=child_name,
            gender=gender,
            personality=personality,
            vitals=Vitals(energy=60.0, age=0),
            x=x,
            y=y,
            parents=(father.id, mother.id)
        )
        
        return child
