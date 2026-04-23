import { Play, Pause, RotateCcw, Zap, Activity, Users, Clock, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const TopBar = ({ 
  isRunning, 
  tick, 
  npcCount, 
  speed, 
  onPlay, 
  onPause, 
  onRestart, 
  onSpeedChange,
  onMenuToggle
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-leviathan-surface border-b border-leviathan-border flex items-center justify-between px-6"
    >
      {/* Logo & Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-leviathan-surface-light text-leviathan-text-muted hover:text-leviathan-text transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="h-8 w-px bg-leviathan-border" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-leviathan-primary to-leviathan-secondary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-leviathan-bg" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider">LEVIATHAN</h1>
            <p className="text-xs text-leviathan-text-muted font-mono">AUTONOMOUS SIMULATION</p>
          </div>
        </div>
        
        <div className="h-8 w-px bg-leviathan-border" />
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-leviathan-success animate-pulse' : 'bg-leviathan-warning'}`} />
          <span className={`status-badge ${isRunning ? 'status-running' : 'status-paused'}`}>
            {isRunning ? 'RUNNING' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-leviathan-primary" />
          <div>
            <p className="stat-value text-sm">{tick.toLocaleString()}</p>
            <p className="stat-label">Ticks</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-leviathan-secondary" />
          <div>
            <p className="stat-value text-sm">{npcCount}</p>
            <p className="stat-label">Entities</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Speed Control */}
        <div className="flex items-center gap-2 bg-leviathan-surface-light rounded-lg p-1">
          {[1, 2, 5].map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-3 py-1 rounded text-sm font-mono transition-all ${
                speed === s 
                  ? 'bg-leviathan-primary text-leviathan-bg' 
                  : 'text-leviathan-text-muted hover:text-leviathan-text'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-leviathan-border" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button onClick={onPause} className="btn-ghost">
              <Pause className="w-4 h-4" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button onClick={onPlay} className="btn-primary">
              <Play className="w-4 h-4" />
              <span>RESUME</span>
            </button>
          )}
          
          <button onClick={onRestart} className="btn-ghost text-leviathan-danger hover:text-leviathan-danger">
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;
