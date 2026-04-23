import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, ChevronDown } from 'lucide-react';

const NPCManager = ({ selectedNpc, onCreate, onDelete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'neutral',
    archetype: 'survivor',
  });

  const archetypes = ['aggressive', 'diplomat', 'paranoid', 'trader', 'survivor'];
  const genders = ['male', 'female', 'neutral'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onCreate(formData.name, formData.gender, formData.archetype);
      setFormData({ name: '', gender: 'neutral', archetype: 'survivor' });
      setIsCreating(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          <span>Entity Management</span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Create NPC Form */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="btn-god w-full justify-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Entity</span>
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <div>
              <label className="text-xs font-mono uppercase text-leviathan-text-muted block mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Entity name..."
                className="w-full bg-leviathan-surface-light border border-leviathan-border rounded px-3 py-2 text-sm focus:outline-none focus:border-leviathan-primary"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase text-leviathan-text-muted block mb-1">
                  Gender
                </label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-leviathan-surface-light border border-leviathan-border rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:border-leviathan-primary"
                  >
                    {genders.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-leviathan-text-muted" />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-leviathan-text-muted block mb-1">
                  Archetype
                </label>
                <div className="relative">
                  <select
                    value={formData.archetype}
                    onChange={(e) => setFormData({ ...formData, archetype: e.target.value })}
                    className="w-full bg-leviathan-surface-light border border-leviathan-border rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:border-leviathan-primary"
                  >
                    {archetypes.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-leviathan-text-muted" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim()}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </motion.form>
        )}

        <div className="h-px bg-leviathan-border" />

        {/* Delete Selected */}
        <div>
          <p className="text-xs font-mono uppercase text-leviathan-text-muted mb-2">
            Selected: {selectedNpc ? selectedNpc.name : 'None'}
          </p>
          
          <button
            onClick={() => selectedNpc && onDelete(selectedNpc.id)}
            disabled={!selectedNpc}
            className="btn-danger w-full justify-center disabled:opacity-50"
          >
            <UserMinus className="w-4 h-4" />
            <span>Delete Entity</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NPCManager;
