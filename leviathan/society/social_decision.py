"""Decision engine for social behaviors.

Developer: Aribam Aditya Sharma
"""

import random
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass

from leviathan.society.npc_social import SocialNPC, State
from leviathan.society.relationships import SocialRelationshipManager, BondType
from leviathan.society.social_actions import SocialActionType


@dataclass
class ScoredAction:
    """Action with score."""
    action_type: SocialActionType
    target_id: Optional[str]
    score: float
    reasoning: str


class SocialDecisionEngine:
    """Makes decisions based on social drives and relationships."""
    
    def __init__(self, npc: SocialNPC, all_npcs: Dict[str, SocialNPC], population_factor: float = 1.0):
        self.npc = npc
        self.all_npcs = all_npcs
        self.population_factor = population_factor
    
    def decide(self) -> Tuple[SocialActionType, Optional[str], Dict]:
        """Choose action based on drives and state."""
        # Can't act if weakened
        if self.npc.get_state() in [State.WEAKENED, State.RECOVERING]:
            # Only gather or rest
            return SocialActionType.REST, None, {'reason': 'recovering'}
        
        scored_actions: List[ScoredAction] = []
        
        # Score all possible actions
        
        # 1. SURVIVAL ACTIONS (highest priority if energy low)
        if self.npc.vitals.energy < 30:
            score = self._score_survival()
            scored_actions.append(ScoredAction(
                SocialActionType.GATHER_FOOD, None, score, 'low_energy'
            ))
            scored_actions.append(ScoredAction(
                SocialActionType.REST, None, score * 0.8, 'recover'
            ))
        
        # 2. SOCIAL ACTIONS (based on drives)
        for other_id, other in self.all_npcs.items():
            if other_id == self.npc.id:
                continue
            if not other.can_act():
                continue
            
            rel = self.npc.relationships.get_or_create(other_id)
            
            # TALK - increases familiarity
            score_talk = self._score_talk(other_id, rel)
            scored_actions.append(ScoredAction(
                SocialActionType.TALK, other_id, score_talk, 'social'
            ))
            
            # GIFT - if affinity exists
            if rel.affinity > 0.2:
                score_gift = self._score_gift(other_id, rel)
                scored_actions.append(ScoredAction(
                    SocialActionType.GIFT, other_id, score_gift, 'bonding'
                ))
            
            # BOND - deepen relationship
            if rel.familiarity > 0.3 and rel.attraction > 0.2:
                score_bond = self._score_bond(other_id, rel)
                scored_actions.append(ScoredAction(
                    SocialActionType.BOND, other_id, score_bond, 'attraction'
                ))
            
            # HELP - if other is weakened
            if other.get_state() in [State.WEAKENED, State.RECOVERING]:
                score_help = self._score_help(other_id, rel)
                scored_actions.append(ScoredAction(
                    SocialActionType.HELP, other_id, score_help, 'altruism'
                ))
            
            # PROPOSE PARTNERSHIP
            if (self.npc.partner_id is None and 
                other.partner_id is None and
                self.npc.gender != other.gender):
                score_propose = self._score_propose(other_id, rel)
                if score_propose > 0:
                    scored_actions.append(ScoredAction(
                        SocialActionType.PROPOSE_PARTNER, other_id, score_propose, 'reproduction'
                    ))
        
        # 3. REPRODUCTION (if has partner)
        if self.npc.partner_id is not None and self.npc.gender.value == 'female':
            score_reproduce = self._score_reproduce()
            scored_actions.append(ScoredAction(
                SocialActionType.REPRODUCE, None, score_reproduce, 'family'
            ))
        
        # 4. REST (default if nothing urgent)
        scored_actions.append(ScoredAction(
            SocialActionType.REST, None, 0.1, 'default'
        ))
        
        # Select best action
        if not scored_actions:
            return SocialActionType.REST, None, {'reason': 'no_options'}
        
        # Sort by score
        scored_actions.sort(key=lambda x: x.score, reverse=True)
        
        # Add small randomness
        for sa in scored_actions:
            sa.score += random.uniform(-0.05, 0.05)
        
        scored_actions.sort(key=lambda x: x.score, reverse=True)
        
        best = scored_actions[0]
        
        # If score is too low, just rest
        if best.score < 0.1:
            return SocialActionType.REST, None, {'reason': 'low_scores'}
        
        return best.action_type, best.target_id, {
            'score': round(best.score, 3),
            'reason': best.reasoning,
            'alternatives': [
                {'action': a.action_type.value, 'target': a.target_id, 'score': round(a.score, 2)}
                for a in scored_actions[:3]
            ]
        }
    
    def _score_survival(self) -> float:
        """Score survival actions."""
        # High when energy is very low
        urgency = 1.0 - (self.npc.vitals.energy / 100.0)
        return urgency * 2.0  # High priority
    
    def _score_talk(self, target_id: str, rel) -> float:
        """Score talking to someone."""
        # Based on sociability and existing familiarity
        base = self.npc.personality.sociability * 0.3
        
        # Prefer people we don't know well yet
        novelty = 1.0 - rel.familiarity
        
        # Prefer opposite gender if seeking partner
        other = self.all_npcs.get(target_id)
        gender_bonus = 0.0
        if other and self.npc.partner_id is None:
            if self.npc.gender != other.gender:
                gender_bonus = self.npc.drives.bonding * 0.2
        
        score = base + (novelty * 0.2) + gender_bonus
        
        # Reduce if low energy
        if self.npc.vitals.energy < 40:
            score *= 0.5
        
        return score
    
    def _score_gift(self, target_id: str, rel) -> float:
        """Score giving a gift."""
        # Requires altruism and affinity
        base = self.npc.personality.altruism * 0.2
        
        # Stronger with existing positive relationship
        affinity_boost = rel.affinity * 0.3
        
        # Must have resources
        if self.npc.vitals.energy < 50:
            return 0.0
        
        # Don't gift to strangers
        if rel.familiarity < 0.2:
            return 0.0
        
        return base + affinity_boost
    
    def _score_help(self, target_id: str, rel) -> float:
        """Score helping someone recover."""
        # Strong altruism component
        base = self.npc.personality.altruism * 0.4
        
        # Family/partner bonus
        if rel.bond_type in [BondType.PARTNER, BondType.FAMILY, BondType.CLOSE_FRIEND]:
            base += 0.3
        elif rel.affinity > 0.3:
            base += 0.2
        
        # Must have energy to help
        if self.npc.vitals.energy < 40:
            base *= 0.5
        
        return base
    
    def _score_bond(self, target_id: str, rel) -> float:
        """Score bonding/romantic action."""
        # Requires attraction
        if rel.attraction < 0.2:
            return 0.0
        
        # Higher if seeking partner
        seeking_bonus = 0.3 if self.npc.partner_id is None else 0.0
        
        # Personality component
        base = self.npc.personality.sociability * 0.2
        base += self.npc.drives.bonding * 0.3
        
        # Familiarity requirement
        if rel.familiarity < 0.2:
            base *= 0.3
        
        return base + seeking_bonus + (rel.attraction * 0.2)
    
    def _score_propose(self, target_id: str, rel) -> float:
        """Score proposing partnership."""
        # Must have strong bond
        eligibility = rel.get_couple_eligibility()
        
        if eligibility < 0.4:
            return 0.0
        
        # Drive to reproduce
        reproduction_urge = self.npc.drives.reproduction
        
        # Loyalty (commitment)
        commitment = self.npc.personality.loyalty * 0.2
        
        score = (eligibility * 0.4) + (reproduction_urge * 0.3) + commitment
        
        # Must be mature
        if self.npc.vitals.age < 30:
            score *= 0.5
        
        return score
    
    def _score_reproduce(self) -> float:
        """Score reproduction action."""
        # Check all conditions
        if not self.npc.is_fertile():
            return 0.0
        
        # Drive to reproduce
        base = self.npc.drives.reproduction * 0.5
        
        # Partner nurturing bonus (family oriented)
        base += self.npc.personality.nurturing * 0.2
        
        # Population pressure (scarcity)
        # Higher population = lower reproduction urge
        base /= self.population_factor
        
        # Energy sufficiency
        if self.npc.vitals.energy < 70:
            base *= 0.5
        
        return base
