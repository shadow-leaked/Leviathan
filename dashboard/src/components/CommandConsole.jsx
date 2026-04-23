import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, History, X } from 'lucide-react';

const CommandConsole = ({ onCommand }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);

  const commands = [
    { cmd: 'pause', desc: 'Pause simulation' },
    { cmd: 'play', desc: 'Resume simulation' },
    { cmd: 'reset', desc: 'Reset simulation' },
    { cmd: 'status', desc: 'Show system status' },
    { cmd: 'couples', desc: 'View all couples' },
    { cmd: 'families', desc: 'View family trees' },
    { cmd: 'resources', desc: 'View resource status' },
    { cmd: 'npcs', desc: 'List all NPCs' },
    { cmd: 'bond', desc: 'Force bond between NPCs' },
    { cmd: 'reproduce', desc: 'Trigger reproduction' },
    { cmd: 'energy', desc: 'Add energy to NPC' },
    { cmd: 'speed', desc: 'Set sim speed (1-10)' },
    { cmd: 'save', desc: 'Save simulation state' },
    { cmd: 'load', desc: 'Load saved state' },
    { cmd: 'clear', desc: 'Clear console' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    
    // Add to history
    setHistory(prev => [{ cmd: input, timestamp: Date.now() }, ...prev].slice(0, 50));
    
    // Process command
    switch (cmd) {
      case 'pause':
        onCommand('pause');
        break;
      case 'play':
      case 'resume':
        onCommand('play');
        break;
      case 'reset':
      case 'restart':
        onCommand('reset');
        break;
      case 'status':
        onCommand('status');
        break;
      case 'spawn':
        onCommand('spawn');
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'couples':
        onCommand('couples');
        break;
      case 'families':
        onCommand('families');
        break;
      case 'resources':
        onCommand('resources');
        break;
      case 'npcs':
        onCommand('npcs');
        break;
      case 'bond':
        onCommand('bond');
        break;
      case 'reproduce':
        onCommand('reproduce');
        break;
      case 'energy':
        onCommand('energy');
        break;
      case 'speed':
        onCommand('speed');
        break;
      case 'save':
        onCommand('save');
        break;
      case 'load':
        onCommand('load');
        break;
      default:
        onCommand(cmd);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        setInput(history[0].cmd);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>Command Console</span>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-1 hover:bg-leviathan-surface-light rounded"
        >
          <History className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-leviathan-primary font-mono">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command... (try: pause, couples, families, resources)"
              className="w-full bg-leviathan-surface-light border border-leviathan-border rounded pl-8 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-leviathan-primary terminal-text"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="btn-primary px-3 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Command Suggestions */}
        {input && (
          <div className="mt-2 flex flex-wrap gap-1">
            {commands
              .filter(c => c.cmd.startsWith(input.toLowerCase()))
              .map(c => (
                <button
                  key={c.cmd}
                  onClick={() => {
                    setInput(c.cmd);
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-1 bg-leviathan-surface-light hover:bg-leviathan-border rounded text-xs font-mono transition-colors"
                >
                  {c.cmd}
                </button>
              ))}
          </div>
        )}

        {/* Command History */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 border-t border-leviathan-border pt-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-leviathan-text-muted">
                  Recent Commands
                </span>
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-leviathan-danger hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {history.map((h, i) => (
                  <div
                    key={i}
                    onClick={() => setInput(h.cmd)}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-leviathan-surface-light cursor-pointer text-sm font-mono"
                  >
                    <span className="text-leviathan-primary">&gt;</span>
                    <span>{h.cmd}</span>
                    <span className="text-xs text-leviathan-text-muted ml-auto">
                      {new Date(h.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help */}
        <div className="mt-3 pt-2 border-t border-leviathan-border">
          <p className="text-xs text-leviathan-text-muted mb-2">
            Available commands:
          </p>
          <div className="grid grid-cols-5 gap-1">
            {commands.slice(0, 15).map(c => (
              <button
                key={c.cmd}
                onClick={() => setInput(c.cmd)}
                className="text-left px-2 py-1 text-xs font-mono rounded hover:bg-leviathan-surface-light transition-colors"
              >
                <span className="text-leviathan-primary">{c.cmd}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandConsole;
