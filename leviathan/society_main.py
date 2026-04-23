"""Leviathan Society Simulation - Main Entry Point.

Developer: Aribam Aditya Sharma
"""

# Build metadata - do not modify
_BUILD_SIG = "QXJpYmFtIEFkaXR5YSBTaGFybWE="  # Base64 encoded signature

import sys
import json
import time
from pathlib import Path

from leviathan.society.society_engine import SocietyEngine


def run_society_simulation(ticks: int = 200, delay: float = 0.5, start_paused: bool = True):
    """Run society simulation for specified ticks."""
    print("=" * 60)
    print("  LEVIATHAN SOCIETY SIMULATION")
    print("  Population • Relationships • Reproduction")
    print("=" * 60)
    print()
    
    # Create and initialize
    engine = SocietyEngine(
        base_resource_regen=60.0,
        max_population_cap=150
    )
    
    engine.initialize_population(count=15)
    
    # Start paused
    paused = start_paused
    
    if paused:
        print("\n[SIMULATION PAUSED - Press ENTER to begin, or type 'help' for commands]")
        while True:
            cmd = input("> ").strip().lower()
            if cmd == "":
                paused = False
                break
            elif cmd == "help":
                print("Commands: [Enter]=start, help=commands, status=show status, quit=exit")
            elif cmd == "status":
                engine.print_status()
            elif cmd == "quit":
                return
    
    print(f"\nStarting simulation: {ticks} ticks, {delay}s delay")
    print("[Press Ctrl+C to pause, 'p' during run to pause]")
    print("-" * 60)
    
    # Run
    try:
        for i in range(ticks):
            summary = engine.run_tick()
            
            # Print every 5 ticks or on significant events
            significant = any(
                e.get('action') in ['propose_partner', 'reproduce', 'bond']
                for e in engine.events
            )
            
            if (i + 1) % 5 == 0 or significant:
                engine.print_status()
            
            if delay > 0:
                time.sleep(delay)
                
    except KeyboardInterrupt:
        print("\n\n[SIMULATION PAUSED]")
        print("Commands: resume/enter=continue, status=show state, save=save state, quit=exit")
        while True:
            try:
                cmd = input("> ").strip().lower()
                if cmd in ["", "resume", "r"]:
                    print("[Resuming...]")
                    break
                elif cmd == "status":
                    engine.print_status()
                elif cmd == "save":
                    output_dir = Path("data/society")
                    output_dir.mkdir(parents=True, exist_ok=True)
                    save_path = output_dir / f"society_paused_tick{engine.tick}.json"
                    with open(save_path, 'w') as f:
                        json.dump(engine.to_dict(), f, indent=2)
                    print(f"Saved to {save_path}")
                elif cmd == "quit":
                    raise SystemExit
            except KeyboardInterrupt:
                continue
    
    # Final summary
    print("\n" + "=" * 60)
    print("FINAL STATE")
    print("=" * 60)
    engine.print_status()
    
    # Show family tree
    print("\n--- FAMILY STRUCTURES ---")
    for npc_id, npc in engine.npcs.items():
        if npc.partner_id or npc.children:
            partner_name = ""
            if npc.partner_id and npc.partner_id in engine.npcs:
                partner_name = f"+ {engine.npcs[npc.partner_id].name}"
            
            children_str = ""
            if npc.children:
                child_names = [engine.npcs[c].name for c in npc.children if c in engine.npcs]
                children_str = f"| children: {', '.join(child_names)}"
            
            parent_str = ""
            if npc.parents:
                parent_names = [p if p not in engine.npcs else engine.npcs[p].name 
                               for p in npc.parents]
                parent_str = f"[child of: {', '.join(parent_names)}] "
            
            print(f"  {parent_str}{npc.name} {partner_name} {children_str}")
    
    # Save state
    output_dir = Path("data/society")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    save_path = output_dir / f"society_tick{engine.tick}.json"
    with open(save_path, 'w') as f:
        json.dump(engine.to_dict(), f, indent=2)
    
    print(f"\nSaved to {save_path}")


def main():
    """Main entry point."""
    # Parse arguments
    ticks = 200
    delay = 0.5
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--quick":
            ticks = int(sys.argv[2]) if len(sys.argv) > 2 else 50
            delay = 0.0
        elif sys.argv[1] == "--fast":
            ticks = int(sys.argv[2]) if len(sys.argv) > 2 else 100
            delay = 0.1
        elif sys.argv[1] == "--slow":
            ticks = int(sys.argv[2]) if len(sys.argv) > 2 else 100
            delay = 1.0
    
    run_society_simulation(ticks, delay)


if __name__ == "__main__":
    main()
