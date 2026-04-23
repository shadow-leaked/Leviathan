import { motion } from 'framer-motion';
import { Terminal, Send, History, ChevronRight, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ConsolePage = ({ onCommand, events }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const commands = [
    { cmd: 'help', desc: 'Show available commands' },
    { cmd: 'status', desc: 'Show simulation status' },
    { cmd: 'play', desc: 'Resume simulation' },
    { cmd: 'pause', desc: 'Pause simulation' },
    { cmd: 'reset', desc: 'Reset simulation' },
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
    { cmd: 'spawn', desc: 'Spawn resources' },
    { cmd: 'energizeall', desc: 'Energize all entities' },
    { cmd: 'clear', desc: 'Clear console' },
  ];

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newEntry = {
      type: 'input',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setHistory(prev => [...prev, newEntry]);
    
    // Execute command
    if (input === 'clear') {
      setHistory([]);
    } else if (input === 'help') {
      const helpText = commands.map(c => `  ${c.cmd.padEnd(10)} - ${c.desc}`).join('\n');
      setHistory(prev => [...prev, { 
        type: 'output', 
        content: `Available commands:\n${helpText}`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } else {
      onCommand(input);
    }

    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputs = history.filter(h => h.type === 'input').map(h => h.content);
      if (historyIndex < inputs.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(inputs[inputs.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const inputs = history.filter(h => h.type === 'input').map(h => h.content);
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(inputs[inputs.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setHistoryIndex(-1);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-leviathan-primary" />
          <h1 className="text-2xl font-bold text-leviathan-text">Command Console</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-leviathan-surface-light text-leviathan-text-muted hover:text-leviathan-text transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </motion.div>

      {/* Quick Commands */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        {commands.slice(0, 12).map(({ cmd }) => (
          <button
            key={cmd}
            onClick={() => {
              setInput(cmd);
              inputRef.current?.focus();
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-leviathan-surface border border-leviathan-border text-leviathan-text-muted hover:border-leviathan-primary hover:text-leviathan-primary transition-colors"
          >
            {cmd}
          </button>
        ))}
      </motion.div>

      {/* Console Output */}
      <div 
        ref={outputRef}
        className="flex-1 bg-leviathan-bg border border-leviathan-border rounded-lg p-4 overflow-y-auto font-mono text-sm space-y-2 mb-4"
      >
        {history.length === 0 && (
          <div className="text-leviathan-text-muted text-center py-8">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Command console ready. Type 'help' for available commands.</p>
          </div>
        )}
        {history.map((entry, idx) => (
          <div key={idx} className={entry.type === 'input' ? 'text-leviathan-primary' : 'text-leviathan-text'}>
            <span className="text-leviathan-text-muted">[{entry.timestamp}]</span>
            {' '}
            {entry.type === 'input' && <ChevronRight className="inline w-4 h-4" />}
            <span className="whitespace-pre-wrap">{entry.content}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-leviathan-surface border border-leviathan-border text-leviathan-primary">
          <ChevronRight className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 px-4 py-2 rounded-lg bg-leviathan-surface border border-leviathan-border text-leviathan-text placeholder-leviathan-text-muted focus:border-leviathan-primary focus:outline-none font-mono"
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 rounded-lg bg-leviathan-primary text-leviathan-bg font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </motion.form>
    </div>
  );
};

export default ConsolePage;
