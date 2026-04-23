"""Social actions for society simulation.

Developer: Aribam Aditya Sharma
"""

import random
from typing import Dict, List, Optional, Any
from enum import Enum

from leviathan.society.npc_social import SocialNPC, State, Gender
from leviathan.society.relationships import BondType
from leviathan.core.memory import MemoryEntry, EventType


class SocialActionType(Enum):
    """Social action types."""
    TALK = "talk"
    GIFT = "gift"
    HELP = "help"
    BOND = "bond"
    PROPOSE_PARTNER = "propose_partner"
    REPRODUCE = "reproduce"
    GATHER_FOOD = "gather_food"
    REST = "rest"


class SocialActionExecutor:
    """Executes social actions."""
    
    def __init__(self, all_npcs: Dict[str, SocialNPC], tick: int = 0):
        self.all_npcs = all_npcs
        self.tick = tick
        self.events: List[Dict] = []
        self.next_child_id = 1
    
    def execute(
        self,
        npc: SocialNPC,
        action_type: SocialActionType,
        target_id: Optional[str]
    ) -> Dict[str, Any]:
        """Execute a social action."""
        npc.last_action = action_type.value
        npc.last_action_target = target_id
        
        # Check if can act
        if not npc.can_act():
            return {'success': False, 'reason': 'weakened', 'action': action_type.value}
        
        if action_type == SocialActionType.TALK:
            return self._talk(npc, target_id)
        elif action_type == SocialActionType.GIFT:
            return self._gift(npc, target_id)
        elif action_type == SocialActionType.HELP:
            return self._help(npc, target_id)
        elif action_type == SocialActionType.BOND:
            return self._bond(npc, target_id)
        elif action_type == SocialActionType.PROPOSE_PARTNER:
            return self._propose_partner(npc, target_id)
        elif action_type == SocialActionType.REPRODUCE:
            return self._reproduce(npc)
        elif action_type == SocialActionType.GATHER_FOOD:
            return self._gather_food(npc)
        elif action_type == SocialActionType.REST:
            return self._rest(npc)
        else:
            return {'success': False, 'reason': 'unknown_action'}
    
    def _talk(self, speaker: SocialNPC, target_id: str) -> Dict[str, Any]:
        """Talk to another NPC - increases familiarity."""
        if not target_id or target_id not in self.all_npcs:
            return {'success': False, 'reason': 'invalid_target'}
        
        target = self.all_npcs[target_id]
        
        # Cost
        if not speaker.consume_energy(3.0):
            return {'success': False, 'reason': 'insufficient_energy'}
        
        # Increase familiarity for both
        speaker.relationships.update_relationship(
            target_id, familiarity_delta=0.15, tick=self.tick
        )
        target.relationships.update_relationship(
            speaker.id, familiarity_delta=0.12, tick=self.tick
        )
        
        # Small affinity boost
        speaker.relationships.update_relationship(
            target_id, affinity_delta=0.03, tick=self.tick
        )
        
        # Record
        entry = MemoryEntry(
            timestamp=float(self.tick),
            event_type=EventType.COMMUNICATE,
            target_id=target_id,
            details={'type': 'talk'},
            emotional_intensity=0.2
        )
        speaker.memory.add_memory(entry, float(self.tick))
        
        result = {
            'success': True,
            'action': 'talk',
            'speaker': speaker.id,
            'target': target_id,
            'familiarity_gain': 0.15
        }
        self.events.append(result)
        return result
    
    def _gift(self, giver: SocialNPC, target_id: str) -> Dict[str, Any]:
        """Give gift to increase affinity."""
        if not target_id or target_id not in self.all_npcs:
            return {'success': False, 'reason': 'invalid_target'}
        
        target = self.all_npcs[target_id]
        
        # Cost
        if not giver.consume_energy(5.0):
            return {'success': False, 'reason': 'insufficient_energy'}
        
        # Must have resources to gift
        if giver.vitals.energy < 30:
            return {'success': False, 'reason': 'insufficient_resources'}
        
        # Transfer energy (gift is food/energy)
        gift_amount = min(10.0, giver.vitals.energy * 0.2)
        giver.vitals.energy -= gift_amount
        target.gain_energy(gift_amount)
        
        # Large affinity boost
        giver.relationships.update_relationship(
            target_id, affinity_delta=0.25, trust_delta=0.1, tick=self.tick
        )
        target.relationships.update_relationship(
            giver.id, affinity_delta=0.15, trust_delta=0.05, tick=self.tick
        )
        
        # Record
        entry = MemoryEntry(
            timestamp=float(self.tick),
            event_type=EventType.HELP,
            target_id=target_id,
            details={'type': 'gift', 'amount': gift_amount},
            emotional_intensity=0.4
        )
        giver.memory.add_memory(entry, float(self.tick))
        
        result = {
            'success': True,
            'action': 'gift',
            'giver': giver.id,
            'target': target_id,
            'amount': round(gift_amount, 1)
        }
        self.events.append(result)
        return result
    
    def _help(self, helper: SocialNPC, target_id: str) -> Dict[str, Any]:
        """Help a weakened NPC recover."""
        if not target_id or target_id not in self.all_npcs:
            return {'success': False, 'reason': 'invalid_target'}
        
        target = self.all_npcs[target_id]
        
        # Must be weakened to need help
        if target.get_state() not in [State.WEAKENED, State.RECOVERING]:
            return {'success': False, 'reason': 'target_not_in_need'}
        
        # Cost
        if not helper.consume_energy(8.0):
            return {'success': False, 'reason': 'insufficient_energy'}
        
        # Give energy to target
        help_amount = 15.0
        target.gain_energy(help_amount)
        
        # Strong trust boost
        helper.relationships.update_relationship(
            target_id, trust_delta=0.3, affinity_delta=0.15, tick=self.tick
        )
        target.relationships.update_relationship(
            helper.id, trust_delta=0.25, affinity_delta=0.1, tick=self.tick
        )
        
        # Record
        entry = MemoryEntry(
            timestamp=float(self.tick),
            event_type=EventType.HELP,
            target_id=target_id,
            details={'type': 'help_recover', 'energy_given': help_amount},
            emotional_intensity=0.5
        )
        helper.memory.add_memory(entry, float(self.tick))
        
        result = {
            'success': True,
            'action': 'help',
            'helper': helper.id,
            'target': target_id,
            'energy_given': help_amount
        }
        self.events.append(result)
        return result
    
    def _bond(self, npc: SocialNPC, target_id: str) -> Dict[str, Any]:
        """Deepen emotional bond - increases attraction and affinity."""
        if not target_id or target_id not in self.all_npcs:
            return {'success': False, 'reason': 'invalid_target'}
        
        target = self.all_npcs[target_id]
        
        # Must be opposite gender for romantic bonding
        if npc.gender == target.gender:
            # Same gender = friendship bond only
            npc.relationships.update_relationship(
                target_id, affinity_delta=0.2, familiarity_delta=0.1, tick=self.tick
            )
            action_type = 'friendship_bond'
        else:
            # Opposite gender = romantic attraction possible
            npc.relationships.update_relationship(
                target_id,
                attraction_delta=0.25,
                affinity_delta=0.15,
                tick=self.tick
            )
            action_type = 'romantic_bond'
        
        # Cost
        if not npc.consume_energy(6.0):
            return {'success': False, 'reason': 'insufficient_energy'}
        
        # Reciprocal (target also feels something)
        target.relationships.update_relationship(
            npc.id,
            attraction_delta=0.15 if action_type == 'romantic_bond' else 0.0,
            affinity_delta=0.1,
            tick=self.tick
        )
        
        # Record
        entry = MemoryEntry(
            timestamp=float(self.tick),
            event_type=EventType.COMMUNICATE,
            target_id=target_id,
            details={'type': action_type},
            emotional_intensity=0.5
        )
        npc.memory.add_memory(entry, float(self.tick))
        
        result = {
            'success': True,
            'action': 'bond',
            'type': action_type,
            'npc': npc.id,
            'target': target_id
        }
        self.events.append(result)
        return result
    
    def _propose_partner(self, npc: SocialNPC, target_id: str) -> Dict[str, Any]:
        """Propose forming a couple/partnership."""
        if not target_id or target_id not in self.all_npcs:
            return {'success': False, 'reason': 'invalid_target'}
        
        target = self.all_npcs[target_id]
        
        # Must be opposite gender
        if npc.gender == target.gender:
            return {'success': False, 'reason': 'same_gender'}
        
        # Check if either already has partner
        if npc.partner_id is not None:
            return {'success': False, 'reason': 'already_has_partner'}
        if target.partner_id is not None:
            return {'success': False, 'reason': 'target_has_partner'}
        
        # Check relationship eligibility
        rel = npc.relationships.get_or_create(target_id)
        eligibility = rel.get_couple_eligibility()
        
        if eligibility < 0.5:
            return {'success': False, 'reason': 'insufficient_bond', 'eligibility': eligibility}
        
        # Target must also feel attraction
        target_rel = target.relationships.get_or_create(npc.id)
        if target_rel.attraction < 0.3:
            return {'success': False, 'reason': 'rejected'}
        
        # Cost
        if not npc.consume_energy(10.0):
            return {'success': False, 'reason': 'insufficient_energy'}
        
        # Form mutual partnership
        npc.form_couple(target_id, self.tick)
        target.form_couple(npc.id, self.tick)
        
        result = {
            'success': True,
            'action': 'propose_partner',
            'npc1': npc.id,
            'npc2': target_id,
            'eligibility': round(eligibility, 2)
        }
        self.events.append(result)
        return result
    
    def _reproduce(self, npc: SocialNPC) -> Dict[str, Any]:
        """Reproduce with partner."""
        if npc.partner_id is None:
            return {'success': False, 'reason': 'no_partner'}
        
        if npc.partner_id not in self.all_npcs:
            return {'success': False, 'reason': 'partner_missing'}
        
        partner = self.all_npcs[npc.partner_id]
        
        # Check fertility conditions
        if not npc.is_fertile() or not partner.is_fertile():
            return {'success': False, 'reason': 'not_fertile'}
        
        # Only females can initiate reproduction (simplification)
        if npc.gender != Gender.FEMALE:
            return {'success': False, 'reason': 'male_cannot_initiate'}
        
        # High energy cost
        cost = 25.0
        if not npc.consume_energy(cost) or not partner.consume_energy(cost * 0.8):
            return {'success': False, 'reason': 'insufficient_energy'}
        
        # Create offspring
        child_id = f"child_{self.next_child_id:03d}"
        self.next_child_id += 1
        
        child_name = f"Child{self.next_child_id - 1}"
        
        child = SocialNPC.create_offspring(
            father=partner if partner.gender == Gender.MALE else npc,
            mother=npc if npc.gender == Gender.FEMALE else partner,
            child_id=child_id,
            child_name=child_name,
            tick=self.tick
        )
        
        # Add to world
        self.all_npcs[child_id] = child
        
        # Record children
        npc.add_child(child_id, self.tick)
        partner.add_child(child_id, self.tick)
        
        # Set family bonds
        for existing_child_id in npc.children:
            if existing_child_id in self.all_npcs:
                child.relationships.set_family_bond(existing_child_id)
                self.all_npcs[existing_child_id].relationships.set_family_bond(child_id)
        
        result = {
            'success': True,
            'action': 'reproduce',
            'mother': npc.id if npc.gender == Gender.FEMALE else partner.id,
            'father': partner.id if npc.gender == Gender.FEMALE else npc.id,
            'child': child_id,
            'child_name': child_name
        }
        self.events.append(result)
        return result
    
    def _gather_food(self, npc: SocialNPC) -> Dict[str, Any]:
        """Gather food/energy from environment."""
        # Cost (effort)
        if not npc.consume_energy(5.0):
            return {'success': False, 'reason': 'insufficient_energy'}
        
        # Gain based on efficiency
        base_gain = 15.0
        efficiency_bonus = npc.personality.efficiency * 10.0
        total_gain = base_gain + efficiency_bonus
        
        npc.gain_energy(total_gain)
        
        result = {
            'success': True,
            'action': 'gather_food',
            'npc': npc.id,
            'energy_gained': round(total_gain, 1),
            'new_energy': round(npc.vitals.energy, 1)
        }
        self.events.append(result)
        return result
    
    def _rest(self, npc: SocialNPC) -> Dict[str, Any]:
        """Rest to recover energy."""
        # No energy cost for rest
        energy_gain = 8.0
        
        npc.gain_energy(energy_gain)
        
        result = {
            'success': True,
            'action': 'rest',
            'npc': npc.id,
            'energy_gained': energy_gain
        }
        self.events.append(result)
        return result
    
    def get_events(self) -> List[Dict]:
        """Get all events from this execution."""
        return self.events
    
    def clear_events(self):
        """Clear event log."""
        self.events = []
