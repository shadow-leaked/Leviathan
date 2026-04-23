"""Society simulation engine with population dynamics.

Developer: Aribam Aditya Sharma
"""

import random
from typing import Dict, List, Any

from leviathan.society.npc_social import SocialNPC, Gender, Personality, Vitals
from leviathan.society.social_actions import SocialActionExecutor, SocialActionType
from leviathan.society.social_decision import SocialDecisionEngine


class SocietyEngine:
    """Manages social simulation with reproduction and population."""
    
    def __init__(self, 
                 base_resource_regen: float = 50.0,
                 max_population_cap: int = 100):
        self.base_resource_regen = base_resource_regen
        self.max_population_cap = max_population_cap
        
        self.npcs: Dict[str, SocialNPC] = {}
        self.tick = 0
        
        # Resources (scaled by population)
        self.global_resources = 500.0
        self.max_resources = 1000.0
        
        # Tracking
        self.births = 0
        self.couples_formed = 0
        
        # Event log
        self.events: List[Dict] = []
    
    def get_population_factor(self) -> float:
        """Calculate population pressure factor."""
        population = len(self.npcs)
        if population == 0:
            return 1.0
        
        # More people = higher pressure on resources per capita
        # At 50 NPCs, factor = 1.5
        # At 100 NPCs, factor = 2.0
        return 1.0 + (population / 100.0)
    
    def get_resource_per_capita(self) -> float:
        """Calculate resources available per NPC."""
        population = max(1, len(self.npcs))
        return self.global_resources / population
    
    def initialize_population(self, count: int = 15):
        """Create initial population."""
        print(f"[SOCIETY] Initializing population of {count} NPCs...")
        
        # Ensure roughly equal gender split
        males = count // 2
        females = count - males
        
        genders = [Gender.MALE] * males + [Gender.FEMALE] * females
        random.shuffle(genders)
        
        # Names
        male_names = ["Kael", "Vorn", "Rex", "Thane", "Jor", "Bram", "Cael", "Dorn", "Erik", "Fenn"]
        female_names = ["Lira", "Mira", "Sera", "Tara", "Yara", "Nia", "Oria", "Pia", "Ria", "Zara"]
        
        name_idx = 0
        for i, gender in enumerate(genders):
            npc_id = f"founder_{i:02d}"
            
            if gender == Gender.MALE:
                name = male_names[name_idx % len(male_names)]
                name_idx += 1
            else:
                name = female_names[name_idx % len(female_names)]
                name_idx += 1
            
            # Random personality with variation
            personality = Personality(
                sociability=random.uniform(0.3, 0.8),
                altruism=random.uniform(0.2, 0.7),
                loyalty=random.uniform(0.3, 0.9),
                attractiveness=random.uniform(0.3, 0.8),
                nurturing=random.uniform(0.2, 0.7),
                fertility=random.uniform(0.3, 0.7),
                caution=random.uniform(0.2, 0.8),
                efficiency=random.uniform(0.3, 0.9)
            )
            
            # Random starting age (20-60)
            age = random.randint(20, 60)
            
            npc = SocialNPC(
                npc_id=npc_id,
                name=name,
                gender=gender,
                personality=personality,
                vitals=Vitals(
                    energy=random.uniform(60, 90),
                    age=age
                ),
                x=random.randint(0, 40),
                y=random.randint(0, 40)
            )
            
            self.npcs[npc_id] = npc
            print(f"  - {name} ({gender.value}), age {age}")
        
        print(f"[SOCIETY] Population initialized: {len(self.npcs)} NPCs")
    
    def run_tick(self) -> Dict[str, Any]:
        """Run one simulation tick."""
        self.tick += 1
        
        # Calculate population pressure
        pop_factor = self.get_population_factor()
        
        # Resource dynamics
        self._update_resources()
        
        # Clear events
        self.events = []
        
        # Create action executor for this tick
        executor = SocialActionExecutor(self.npcs, self.tick)
        
        # Decision and action phase for all NPCs
        decisions = []
        for npc in self.npcs.values():
            if not npc.can_act():
                # Still tick for state updates
                npc.tick(self.tick, pop_factor)
                continue
            
            # Make decision
            engine = SocialDecisionEngine(npc, self.npcs, pop_factor)
            action_type, target_id, meta = engine.decide()
            
            decisions.append((npc, action_type, target_id, meta))
        
        # Execute actions
        for npc, action_type, target_id, meta in decisions:
            result = executor.execute(npc, action_type, target_id)
            
            if result.get('success'):
                self.events.append(result)
                
                # Track special events
                if result['action'] == 'propose_partner':
                    self.couples_formed += 1
                elif result['action'] == 'reproduce':
                    self.births += 1
        
        # Tick all NPCs (energy decay, aging)
        for npc in list(self.npcs.values()):
            npc.tick(self.tick, pop_factor)
        
        # Cleanup: remove NPCs that have been WEAKENED too long?
        # Actually, let's keep them - they can recover
        
        return self._get_tick_summary()
    
    def _update_resources(self):
        """Update global resources based on population and regeneration."""
        population = len(self.npcs)
        
        # Base regeneration
        regen = self.base_resource_regen
        
        # More efficient gatherers = better regeneration
        total_efficiency = sum(n.personality.efficiency for n in self.npcs.values())
        efficiency_bonus = total_efficiency * 2.0
        
        # Population pressure reduces effective resources
        consumption = population * 1.5
        
        net_change = regen + efficiency_bonus - consumption
        
        self.global_resources += net_change
        self.global_resources = max(0.0, min(self.max_resources, self.global_resources))
    
    def _get_tick_summary(self) -> Dict[str, Any]:
        """Get summary of current tick."""
        active = sum(1 for n in self.npcs.values() if n.get_state().value == 'active')
        recovering = sum(1 for n in self.npcs.values() if n.get_state().value == 'recovering')
        
        coupled = sum(1 for n in self.npcs.values() if n.partner_id is not None) // 2
        
        return {
            'tick': self.tick,
            'population': len(self.npcs),
            'active': active,
            'recovering': recovering,
            'couples': coupled,
            'resources': round(self.global_resources, 0),
            'resource_per_capita': round(self.get_resource_per_capita(), 1),
            'events': len(self.events),
            'births_total': self.births,
            'couples_formed_total': self.couples_formed
        }
    
    def get_detailed_status(self) -> Dict:
        """Get detailed simulation status."""
        return {
            'tick': self.tick,
            'population': {
                'total': len(self.npcs),
                'males': sum(1 for n in self.npcs.values() if n.gender.value == 'male'),
                'females': sum(1 for n in self.npcs.values() if n.gender.value == 'female'),
                'active': sum(1 for n in self.npcs.values() if n.can_act())
            },
            'families': {
                'couples': sum(1 for n in self.npcs.values() if n.partner_id is not None) // 2,
                'children': sum(1 for n in self.npcs.values() if n.parents is not None),
                'births': self.births
            },
            'resources': {
                'global': round(self.global_resources, 1),
                'per_capita': round(self.get_resource_per_capita(), 1),
                'pressure_factor': round(self.get_population_factor(), 2)
            },
            'recent_events': self.events[-5:] if self.events else []
        }
    
    def print_status(self):
        """Print current status to console."""
        status = self.get_detailed_status()
        
        print(f"\n[Tick {status['tick']:4d}] " + "="*50)
        print(f"Population: {status['population']['total']} total " +
              f"({status['population']['males']}M/{status['population']['females']}F) " +
              f"| {status['population']['active']} active")
        print(f"Families: {status['families']['couples']} couples | {status['families']['children']} children | {status['families']['births']} births")
        print(f"Resources: {status['resources']['global']} total | {status['resources']['per_capita']}/capita (pressure: {status['resources']['pressure_factor']})")
        
        if status['recent_events']:
            print("Recent events:")
            for evt in status['recent_events']:
                action = evt.get('action', 'unknown')
                if action == 'talk':
                    print(f"  💬 {evt.get('speaker')} talked to {evt.get('target')}")
                elif action == 'gift':
                    print(f"  🎁 {evt.get('giver')} gifted {evt.get('target')} ({evt.get('amount')} energy)")
                elif action == 'bond':
                    print(f"  💕 {evt.get('npc')} bonded with {evt.get('target')} ({evt.get('type')})")
                elif action == 'propose_partner':
                    print(f"  💍 {evt.get('npc1')} + {evt.get('npc2')} formed couple!")
                elif action == 'reproduce':
                    print(f"  👶 {evt.get('mother')} + {evt.get('father')} had {evt.get('child')}!")
                elif action == 'help':
                    print(f"  💚 {evt.get('helper')} helped {evt.get('target')} recover")
                elif action == 'gather_food':
                    print(f"  🌾 {evt.get('npc')} gathered {evt.get('energy_gained')} energy")
        
        print()
    
    def to_dict(self) -> Dict:
        """Serialize society state."""
        return {
            'tick': self.tick,
            'npcs': {npc_id: npc.to_dict() for npc_id, npc in self.npcs.items()},
            'resources': self.global_resources,
            'statistics': {
                'births': self.births,
                'couples_formed': self.couples_formed
            }
        }
