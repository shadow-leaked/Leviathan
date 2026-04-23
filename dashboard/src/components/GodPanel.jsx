import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Heart, Info, Users, AlertTriangle, Sparkles } from 'lucide-react';

const GodPanel = ({ 
  selectedNpc, 
  onGiveFood, 
  onGiveEnergy, 
  onHeal, 
  onForceRelationship,
  onTriggerEvent,
  onInjectIntel,
  npcs
}) => {
  const [customEvent, setCustomEvent] = useState('');

  const GodButton = ({ icon: Icon, label, onClick, disabled, variant = 'primary' }) => {
    const variants = {
      primary: 'btn-god',
      danger: 'btn-danger',
      ghost: 'btn-ghost',
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${variants[variant]} w-full justify-center text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="panel">
      <div className="panel-header flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-leviathan-accent" />
        <span>God Mode</span>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Selected NPC Actions */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-leviathan-text-muted">
            Target: {selectedNpc ? selectedNpc.name : 'None selected'}
          </p>
          
          <GodButton
            icon={Zap}
            label="Give Food"
            onClick={() => selectedNpc && onGiveFood(selectedNpc.id)}
            disabled={!selectedNpc}
          />
          
          <GodButton
            icon={Heart}
            label="Restore Energy"
            onClick={() => selectedNpc && onGiveEnergy(selectedNpc.id)}
            disabled={!selectedNpc}
          />
          
          <GodButton
            icon={Sparkles}
            label="Energize Entity"
            onClick={() => selectedNpc && onHeal(selectedNpc.id)}
            disabled={!selectedNpc}
            variant="ghost"
          />
        </div>

        <div className="h-px bg-leviathan-border" />

        {/* Knowledge Sharing */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-leviathan-text-muted">
            Knowledge Exchange
          </p>
          
          <GodButton
            icon={Info}
            label="Share Knowledge"
            onClick={() => selectedNpc && onInjectIntel && onInjectIntel(selectedNpc.id)}
            disabled={!selectedNpc || !onInjectIntel}
            variant="ghost"
          />
        </div>

        <div className="h-px bg-leviathan-border" />

        {/* Relationship Control */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-leviathan-text-muted">
            Social Engineering
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <GodButton
              icon={Users}
              label="Force Ally"
              onClick={() => onForceRelationship('ally')}
              variant="primary"
            />
            
            <GodButton
              icon={AlertTriangle}
              label="Force Break"
              onClick={() => onForceRelationship('break')}
              variant="danger"
            />
          </div>
        </div>

        <div className="h-px bg-leviathan-border" />

        {/* Custom Event */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase text-leviathan-text-muted">
            Custom Event
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              placeholder="Event name..."
              className="flex-1 bg-leviathan-surface-light border border-leviathan-border rounded px-3 py-2 text-sm focus:outline-none focus:border-leviathan-primary"
            />
            <button
              onClick={() => {
                if (customEvent.trim()) {
                  onTriggerEvent(customEvent);
                  setCustomEvent('');
                }
              }}
              disabled={!customEvent.trim()}
              className="btn-god px-3"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodPanel;
