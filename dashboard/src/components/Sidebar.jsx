import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  ScrollText, 
  Terminal,
  X,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'npcs', label: 'NPCs', icon: Users },
  { id: 'world', label: 'World', icon: Globe },
  { id: 'events', label: 'Events', icon: ScrollText },
  { id: 'console', label: 'Console', icon: Terminal },
];

const Sidebar = ({ isOpen, onClose, currentView, onViewChange }) => {
  const handleItemClick = (id) => {
    onViewChange(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 bg-leviathan-surface border-r border-leviathan-border z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-leviathan-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-leviathan-primary to-leviathan-secondary flex items-center justify-center">
                  <span className="text-leviathan-bg font-bold text-lg">L</span>
                </div>
                <div>
                  <h1 className="font-bold text-leviathan-text">Leviathan</h1>
                  <p className="text-xs text-leviathan-text-muted">Simulation Control</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-leviathan-surface-light text-leviathan-text-muted hover:text-leviathan-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-leviathan-primary/20 text-leviathan-primary border border-leviathan-primary/30' 
                        : 'text-leviathan-text-muted hover:bg-leviathan-surface-light hover:text-leviathan-text'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-leviathan-primary' : 'group-hover:text-leviathan-text'}`} />
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-leviathan-primary"
                      />
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-leviathan-border">
              <div className="text-xs text-leviathan-text-muted text-center">
                <p>Leviathan v1.0.0</p>
                <p className="mt-1">NPC Simulation Engine</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
