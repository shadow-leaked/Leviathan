import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertOctagon, RotateCcw, Zap } from 'lucide-react';

const GlobalControls = ({ onSpawnResources, onTriggerEvent, onReset }) => {
  const [eventInput, setEventInput] = useState('');
  const [resourceAmount, setResourceAmount] = useState(500);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    if (showConfirm) {
      onReset();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header flex items-center gap-2">
        <Zap className="w-4 h-4" />
        <span>Global Controls</span>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Resource Spawn */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-leviathan-text-muted">
            Spawn Resources
          </p>
          
          <div className="flex gap-2">
            <input
              type="number"
              value={resourceAmount}
              onChange={(e) => setResourceAmount(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="Amount..."
              min="0"
              step="100"
              className="flex-1 bg-leviathan-surface-light border border-leviathan-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-leviathan-primary"
            />
            <button
              onClick={() => onSpawnResources(resourceAmount)}
              disabled={resourceAmount <= 0}
              className="btn-god px-4 disabled:opacity-50"
            >
              <Package className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            {[100, 500, 1000, 5000].map(amount => (
              <button
                key={amount}
                onClick={() => setResourceAmount(amount)}
                className={`flex-1 text-xs py-1 rounded transition-colors ${
                  resourceAmount === amount 
                    ? 'bg-leviathan-primary text-white' 
                    : 'btn-ghost'
                }`}
              >
                {amount >= 1000 ? `${amount/1000}k` : amount}
              </button>
            ))}
          </div>
        </div>

        {/* Global Event */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-leviathan-text-muted">
            Trigger Global Event
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={eventInput}
              onChange={(e) => setEventInput(e.target.value)}
              placeholder="Event name..."
              className="flex-1 bg-leviathan-surface-light border border-leviathan-border rounded px-3 py-2 text-sm focus:outline-none focus:border-leviathan-primary"
            />
            <button
              onClick={() => {
                if (eventInput.trim()) {
                  onTriggerEvent(eventInput);
                  setEventInput('');
                }
              }}
              disabled={!eventInput.trim()}
              className="btn-danger px-3 disabled:opacity-50"
            >
              <AlertOctagon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onTriggerEvent('Earthquake')}
              className="btn-ghost flex-1 text-xs py-1"
            >
              Earthquake
            </button>
            <button
              onClick={() => onTriggerEvent('Plague')}
              className="btn-ghost flex-1 text-xs py-1"
            >
              Plague
            </button>
            <button
              onClick={() => onTriggerEvent('Bounty')}
              className="btn-ghost flex-1 text-xs py-1"
            >
              Bounty
            </button>
          </div>
        </div>

        <div className="h-px bg-leviathan-border" />

        {/* Reset Simulation */}
        <div>
          <p className="text-xs font-mono uppercase text-leviathan-text-muted mb-2">
            System Reset
          </p>
          
          <motion.button
            onClick={handleReset}
            whileTap={{ scale: 0.98 }}
            className={`w-full justify-center ${
              showConfirm 
                ? 'btn-danger' 
                : 'btn-ghost border border-leviathan-danger/30 text-leviathan-danger hover:bg-leviathan-danger/10'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{showConfirm ? 'CONFIRM RESET' : 'Reset Simulation'}</span>
          </motion.button>
          
          {showConfirm && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-leviathan-danger mt-2 text-center"
            >
              Click again to confirm reset
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;
