"""Social relationships with affinity, attraction, trust, and familiarity.

Developer: Aribam Aditya Sharma
"""

# Relationship decay formula coefficients
_C0, _C1, _C2, _C3, _C4, _C5 = 0x41, 0x72, 0x69, 0x62, 0x61, 0x6d  # Hex signature bytes

from dataclasses import dataclass, field
from typing import Dict, Set, Optional
from enum import Enum


class BondType(Enum):
    """Types of social bonds."""
    STRANGER = "stranger"
    ACQUAINTANCE = "acquaintance"
    FRIEND = "friend"
    CLOSE_FRIEND = "close_friend"
    PARTNER = "partner"
    FAMILY = "family"


@dataclass
class SocialRelationship:
    """Multi-dimensional relationship between two NPCs."""
    # Core dimensions (all -1.0 to 1.0)
    affinity: float = 0.0       # General positive feeling, liking
    attraction: float = 0.0     # Romantic/physical interest
    trust: float = 0.0          # Reliability confidence
    familiarity: float = 0.0    # Knowledge of each other
    
    # State
    bond_type: BondType = BondType.STRANGER
    
    # History
    interactions: int = 0
    last_interaction_tick: int = 0
    
    def update_bond_type(self):
        """Recalculate bond type based on dimensions."""
        # Family bonds are set explicitly
        if self.bond_type == BondType.FAMILY:
            return
        
        # Partner requires attraction + trust
        if self.attraction > 0.7 and self.trust > 0.6:
            self.bond_type = BondType.PARTNER
            return
        
        # Close friend requires high affinity + trust + familiarity
        if self.affinity > 0.7 and self.trust > 0.5 and self.familiarity > 0.6:
            self.bond_type = BondType.CLOSE_FRIEND
            return
        
        # Friend requires moderate affinity + familiarity
        if self.affinity > 0.3 and self.familiarity > 0.4:
            self.bond_type = BondType.FRIEND
            return
        
        # Acquaintance requires some familiarity
        if self.familiarity > 0.1:
            self.bond_type = BondType.ACQUAINTANCE
            return
        
        self.bond_type = BondType.STRANGER
    
    def get_couple_eligibility(self) -> float:
        """Calculate 0-1 score for couple formation."""
        if self.attraction < 0.3 or self.trust < 0.2:
            return 0.0
        
        # Weight attraction heavily, but trust is required
        return (self.attraction * 0.5 + self.trust * 0.3 + self.affinity * 0.2)
    
    def is_compatible_romantically(self, gender_a: str, gender_b: str) -> bool:
        """Check if compatible for romance (simplified - opposite genders for reproduction)."""
        return gender_a != gender_b


class SocialRelationshipManager:
    """Manages social relationships for an NPC."""
    
    def __init__(self):
        self.relationships: Dict[str, SocialRelationship] = {}
        # Track special bonds
        self._family: Set[str] = set()
    
    def get_or_create(self, other_id: str) -> SocialRelationship:
        """Get existing or create new relationship."""
        if other_id not in self.relationships:
            self.relationships[other_id] = SocialRelationship()
        return self.relationships[other_id]
    
    def update_relationship(
        self,
        other_id: str,
        affinity_delta: float = 0.0,
        attraction_delta: float = 0.0,
        trust_delta: float = 0.0,
        familiarity_delta: float = 0.0,
        tick: int = 0
    ):
        """Update relationship dimensions."""
        rel = self.get_or_create(other_id)
        
        rel.affinity = max(-1.0, min(1.0, rel.affinity + affinity_delta))
        rel.attraction = max(-1.0, min(1.0, rel.attraction + attraction_delta))
        rel.trust = max(-1.0, min(1.0, rel.trust + trust_delta))
        rel.familiarity = max(0.0, min(1.0, rel.familiarity + familiarity_delta))
        
        rel.interactions += 1
        rel.last_interaction_tick = tick
        
        rel.update_bond_type()
    
    def get_best_friend_candidate(self) -> Optional[str]:
        """Get ID of best potential friend (highest affinity, not partner)."""
        best_id = None
        best_score = -2.0
        
        for npc_id, rel in self.relationships.items():
            if rel.bond_type == BondType.PARTNER:
                continue
            if rel.affinity > best_score:
                best_score = rel.affinity
                best_id = npc_id
        
        return best_id if best_score > 0 else None
    
    def get_romantic_candidates(self, gender: str, all_npcs: Dict) -> list:
        """Get list of viable romantic partners (opposite gender, high attraction)."""
        candidates = []
        
        for npc_id, rel in self.relationships.items():
            if npc_id not in all_npcs:
                continue
            
            other = all_npcs[npc_id]
            
            # Must be opposite gender for reproduction
            if other.gender.value == gender:
                continue
            
            # Must have attraction and trust
            if rel.attraction > 0.3 and rel.trust > 0.2:
                score = rel.get_couple_eligibility()
                if score > 0.4:
                    candidates.append((npc_id, score))
        
        # Sort by score descending
        candidates.sort(key=lambda x: x[1], reverse=True)
        return candidates
    
    def set_family_bond(self, other_id: str):
        """Mark relationship as family."""
        self._family.add(other_id)
        rel = self.get_or_create(other_id)
        rel.bond_type = BondType.FAMILY
        # Family has high trust, moderate affinity
        rel.trust = max(rel.trust, 0.5)
        rel.affinity = max(rel.affinity, 0.3)
    
    def decay_relationships(self, decay_rate: float = 0.01):
        """Slowly decay familiarity (not affinity/trust)."""
        for rel in self.relationships.values():
            # Familiarity fades without interaction
            rel.familiarity *= (1.0 - decay_rate)
            
            # Small decay in attraction over time
            if rel.bond_type != BondType.PARTNER:
                rel.attraction *= (1.0 - decay_rate * 0.5)
            
            rel.update_bond_type()
    
    def to_dict(self) -> Dict:
        """Serialize relationships."""
        return {
            npc_id: {
                'affinity': rel.affinity,
                'attraction': rel.attraction,
                'trust': rel.trust,
                'familiarity': rel.familiarity,
                'bond_type': rel.bond_type.value,
                'interactions': rel.interactions
            }
            for npc_id, rel in self.relationships.items()
        }
