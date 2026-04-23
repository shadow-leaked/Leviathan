import { motion } from 'framer-motion';
import { User, Zap } from 'lucide-react';

const NPCList = ({ npcs, selectedNpc, onSelect }) => {
  const getStateColor = (state) => {
    switch (state) {
      case 'active': return 'bg-leviathan-success';
      case 'recovering': return 'bg-leviathan-warning';
      default: return 'bg-leviathan-text-muted';
    }
  };

  const getStateIcon = (state) => {
    return null;
  };

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Active Entities</span>
        <span className="text-xs bg-leviathan-surface px-2 py-0.5 rounded">
          {npcs.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {npcs.map((npc, index) => (
          <motion.button
            key={npc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => onSelect(npc)}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selectedNpc?.id === npc.id 
                ? 'bg-leviathan-primary/10 border border-leviathan-primary/30' 
                : 'bg-leviathan-surface-light hover:bg-leviathan-surface-light/80 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-leviathan-text-muted" />
                <span className="font-medium text-sm">{npc.name}</span>
                {getStateIcon(npc.state)}
              </div>
              <div className={`w-2 h-2 rounded-full ${getStateColor(npc.state)}`} />
            </div>
            
            {/* Energy Bar */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-leviathan-accent" />
                <div className="flex-1 progress-bar">
                  <div 
                    className="progress-fill bg-leviathan-accent"
                    style={{ width: `${(npc.energy / npc.maxEnergy) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono w-8 text-right">{npc.energy}</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2 text-xs text-leviathan-text-muted">
              <span className="px-1.5 py-0.5 bg-leviathan-surface rounded">{npc.archetype}</span>
              <span className="px-1.5 py-0.5 bg-leviathan-surface rounded">{npc.gender}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default NPCList;
