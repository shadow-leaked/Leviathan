import { motion } from 'framer-motion';
import { User, MapPin, Brain, Target, Activity } from 'lucide-react';

const NPCInspector = ({ npc }) => {
  if (!npc) {
    return (
      <div className="panel h-full flex items-center justify-center">
        <div className="text-center text-leviathan-text-muted">
          <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-mono text-sm">SELECT AN ENTITY</p>
          <p className="text-xs mt-1">Click on an NPC to inspect</p>
        </div>
      </div>
    );
  }

  const StatBar = ({ label, value, color }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-leviathan-text-muted uppercase tracking-wider">{label}</span>
        <span className="font-mono">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${color}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );

  const DriveBar = ({ label, value }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-leviathan-text-muted capitalize">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-20 progress-bar">
          <div 
            className="progress-fill bg-leviathan-secondary"
            style={{ width: `${value * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono w-8 text-right">{(value * 100).toFixed(0)}</span>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="panel h-full overflow-y-auto"
    >
      <div className="panel-header">
        Entity Profile: {npc.name}
      </div>
      
      <div className="p-4 space-y-4">
        {/* Header Info */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{npc.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-leviathan-text-muted">
              <span className="px-2 py-0.5 bg-leviathan-surface-light rounded">{npc.archetype}</span>
              <span className="px-2 py-0.5 bg-leviathan-surface-light rounded">{npc.gender}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded text-xs font-mono uppercase ${
            npc.state === 'active' ? 'bg-leviathan-success/20 text-leviathan-success' :
            npc.state === 'weakened' ? 'bg-leviathan-warning/20 text-leviathan-warning' :
            'bg-leviathan-danger/20 text-leviathan-danger'
          }`}>
            {npc.state}
          </div>
        </div>

        {/* Position */}
        <div className="flex items-center gap-2 text-sm text-leviathan-text-muted">
          <MapPin className="w-4 h-4" />
          <span className="font-mono">Position: ({npc.position.x}, {npc.position.y})</span>
        </div>

        {/* Vitals */}
        <div className="bg-leviathan-surface-light rounded-lg p-3 space-y-3">
          <h4 className="text-xs font-mono uppercase text-leviathan-text-muted flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Vitals
          </h4>
          
          
          <StatBar 
            label="Energy" 
            value={npc.energy / npc.maxEnergy} 
            color="bg-leviathan-accent"
          />
        </div>

        {/* Traits */}
        <div className="bg-leviathan-surface-light rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-mono uppercase text-leviathan-text-muted flex items-center gap-2">
            <Brain className="w-3 h-3" />
            Traits
          </h4>
          
          <StatBar label="Altruism" value={npc.traits.altruism} color="bg-green-500" />
          <StatBar label="Paranoia" value={npc.traits.paranoia} color="bg-purple-500" />
          <StatBar label="Intelligence" value={npc.traits.intelligence} color="bg-blue-500" />
          <StatBar label="Charisma" value={npc.traits.charisma} color="bg-pink-500" />
        </div>

        {/* Drives */}
        <div className="bg-leviathan-surface-light rounded-lg p-3">
          <h4 className="text-xs font-mono uppercase text-leviathan-text-muted flex items-center gap-2 mb-2">
            <Target className="w-3 h-3" />
            Drives
          </h4>
          
          <DriveBar label="Survival" value={npc.drives.survival} />
          <DriveBar label="Wealth" value={npc.drives.wealth} />
          <DriveBar label="Social" value={npc.drives.social} />
        </div>

        {/* Relationships */}
        <div className="bg-leviathan-surface-light rounded-lg p-3">
          <h4 className="text-xs font-mono uppercase text-leviathan-text-muted mb-2">
            Relationships
          </h4>
          {npc.relationships.length === 0 ? (
            <p className="text-sm text-leviathan-text-muted italic">No active relationships</p>
          ) : (
            <div className="space-y-1">
              {npc.relationships.map((rel, i) => (
                <div key={i} className="text-sm flex items-center justify-between">
                  <span>{rel.target}</span>
                  <span className={`text-xs ${rel.type === 'ally' ? 'text-leviathan-success' : 'text-leviathan-danger'}`}>
                    {rel.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NPCInspector;
