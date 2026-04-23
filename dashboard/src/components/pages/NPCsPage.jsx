import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Plus, Trash2, Zap, Utensils, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const NPCCard = ({ npc, isSelected, onSelect, onRemove, onEnergize }) => {
  const energyPercent = npc.energy || 0;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => onSelect(npc)}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'bg-leviathan-primary/10 border-leviathan-primary' 
          : 'bg-leviathan-surface border-leviathan-border hover:border-leviathan-primary/30'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-leviathan-primary/20 text-leviathan-primary">
            {npc.name?.charAt(0) || '?'}
          </div>
          <div>
            <h4 className="font-medium text-leviathan-text">{npc.name || 'Unknown'}</h4>
            <p className="text-xs text-leviathan-text-muted font-mono">ID: {npc.id?.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEnergize(npc.id); }}
            className="p-1.5 rounded hover:bg-leviathan-surface-light text-leviathan-accent"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(npc.id); }}
            className="p-1.5 rounded hover:bg-leviathan-surface-light text-leviathan-text-muted"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-leviathan-accent" />
          <div className="flex-1 h-1.5 bg-leviathan-surface-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-leviathan-accent rounded-full transition-all"
              style={{ width: `${energyPercent}%` }}
            />
          </div>
          <span className="text-xs text-leviathan-text-muted w-8 text-right">{energyPercent}%</span>
        </div>
        <div className="flex items-center justify-between text-xs text-leviathan-text-muted">
          <span>State: <span className="text-leviathan-text">{npc.state || 'active'}</span></span>
          <span>Archetype: <span className="text-leviathan-text">{npc.archetype || 'unknown'}</span></span>
        </div>
      </div>
      
      {/* Traits */}
      {npc.traits && Object.keys(npc.traits).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {Object.entries(npc.traits).slice(0, 3).map(([key, val], idx) => (
            <span 
              key={idx}
              className="px-2 py-0.5 text-xs rounded-full bg-leviathan-surface-light text-leviathan-text-muted"
            >
              {key}: {(val * 100).toFixed(0)}%
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const NPCInspector = ({ npc }) => {
  if (!npc) return (
    <div className="h-full flex items-center justify-center text-leviathan-text-muted">
      <p>Select an entity to view details</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl bg-leviathan-primary/20 text-leviathan-primary">
          {npc.name?.charAt(0) || '?'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-leviathan-text">{npc.name || 'Unknown'}</h3>
          <p className="text-sm text-leviathan-text-muted font-mono">{npc.id}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-leviathan-success/20 text-leviathan-success">
            Active
          </span>
        </div>
      </div>

      <div className="bg-leviathan-surface-light rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-leviathan-accent">{npc.energy || 0}%</p>
        <p className="text-xs text-leviathan-text-muted">Energy</p>
      </div>

      {npc.traits && Object.keys(npc.traits).length > 0 && (
        <div>
          <h4 className="text-sm font-mono uppercase text-leviathan-text-muted mb-2">Traits</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(npc.traits).map(([key, val], idx) => (
              <span 
                key={idx}
                className="px-3 py-1 text-sm rounded-full bg-leviathan-surface-light text-leviathan-text border border-leviathan-border"
              >
                {key}: {(val * 100).toFixed(0)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {npc.drives && Object.keys(npc.drives).length > 0 && (
        <div>
          <h4 className="text-sm font-mono uppercase text-leviathan-text-muted mb-2">Drives</h4>
          <div className="space-y-2">
            {Object.entries(npc.drives).map(([key, val], idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-leviathan-text-muted capitalize">{key}</span>
                <span className="text-leviathan-text">{(val * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CreateNPCModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [archetype, setArchetype] = useState('diplomat');

  const archetypes = ['diplomat', 'nurturer', 'scholar', 'trader', 'explorer'];
  const genders = ['male', 'female'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), gender, archetype);
      onClose();
      setName('');
      setGender('male');
      setArchetype('diplomat');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-leviathan-surface border border-leviathan-border rounded-lg p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-leviathan-text">Create New NPC</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-leviathan-surface-light text-leviathan-text-muted hover:text-leviathan-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-leviathan-text-muted mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter NPC name..."
                className="w-full px-4 py-2 rounded-lg bg-leviathan-bg border border-leviathan-border text-leviathan-text placeholder-leviathan-text-muted focus:border-leviathan-primary focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-leviathan-text-muted mb-2">
                Gender
              </label>
              <div className="flex gap-2">
                {genders.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 px-4 py-2 rounded-lg capitalize transition-colors ${
                      gender === g
                        ? 'bg-leviathan-primary text-leviathan-bg'
                        : 'bg-leviathan-surface-light text-leviathan-text hover:bg-leviathan-surface'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-leviathan-text-muted mb-2">
                Archetype
              </label>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-leviathan-bg border border-leviathan-border text-leviathan-text focus:border-leviathan-primary focus:outline-none"
              >
                {archetypes.map((a) => (
                  <option key={a} value={a} className="capitalize">
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-leviathan-surface-light text-leviathan-text hover:bg-leviathan-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-leviathan-primary text-leviathan-bg font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const NPCsPage = ({ 
  npcs, 
  selectedNpc, 
  onSelectNpc, 
  onCreateNpc, 
  onDeleteNpc,
  onEnergizeNpc,
  onGiveFood,
  onGiveEnergy
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredNPCs = npcs.filter(npc => {
    const matchesSearch = (npc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (npc.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalCount = npcs.length;

  return (
    <div className="h-full flex">
      {/* NPC List */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-leviathan-primary" />
            <h1 className="text-2xl font-bold text-leviathan-text">Entities</h1>
            <span className="px-3 py-1 rounded-full bg-leviathan-surface-light text-sm text-leviathan-text-muted">
              {totalCount} total
            </span>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-leviathan-primary text-leviathan-bg font-medium hover:bg-cyan-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Entity
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-leviathan-text-muted" />
            <input
              type="text"
              placeholder="Search NPCs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-leviathan-surface border border-leviathan-border text-leviathan-text placeholder-leviathan-text-muted focus:border-leviathan-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-leviathan-text-muted" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-leviathan-surface border border-leviathan-border text-leviathan-text focus:border-leviathan-primary focus:outline-none"
            >
              <option value="all">All</option>
            </select>
          </div>
        </motion.div>

        {/* NPC Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
          {filteredNPCs.map((npc, idx) => (
            <NPCCard
              key={npc.id}
              npc={npc}
              isSelected={selectedNpc?.id === npc.id}
              onSelect={onSelectNpc}
              onRemove={onDeleteNpc}
              onEnergize={onEnergizeNpc}
            />
          ))}
          {filteredNPCs.length === 0 && (
            <div className="col-span-full flex items-center justify-center h-40 text-leviathan-text-muted">
              <p>No entities found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create NPC Modal */}
      <CreateNPCModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreateNpc}
      />

      {/* Inspector Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 border-l border-leviathan-border bg-leviathan-surface/50 p-6 overflow-y-auto"
      >
        <h2 className="text-lg font-bold text-leviathan-text mb-4">Inspector</h2>
        <NPCInspector npc={selectedNpc} />
        
        {selectedNpc && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-mono uppercase text-leviathan-text-muted mb-2">Actions</h4>
            <button
              onClick={() => onGiveFood(selectedNpc.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-leviathan-surface-light hover:bg-leviathan-surface text-leviathan-text transition-colors"
            >
              <Utensils className="w-4 h-4 text-leviathan-success" />
              Give Food
            </button>
            <button
              onClick={() => onGiveEnergy(selectedNpc.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-leviathan-surface-light hover:bg-leviathan-surface text-leviathan-text transition-colors"
            >
              <Zap className="w-4 h-4 text-leviathan-warning" />
              Give Energy
            </button>
            <button
              onClick={() => onEnergizeNpc(selectedNpc.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-leviathan-surface-light hover:bg-leviathan-surface text-leviathan-text transition-colors"
            >
              <Sparkles className="w-4 h-4 text-leviathan-accent" />
              Energize
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NPCsPage;
