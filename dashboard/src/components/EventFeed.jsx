import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, MessageCircle, Settings, HeartHandshake } from 'lucide-react';

const EventFeed = ({ events }) => {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [events]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'social': return <MessageCircle className="w-4 h-4" />;
      case 'bonding': return <HeartHandshake className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  const getEventColors = (type) => {
    switch (type) {
      case 'bonding': 
        return 'text-pink-400 border-l-pink-500/30 bg-pink-500/5';
      case 'social': 
        return 'text-blue-400 border-l-blue-500/30 bg-blue-500/5';
      case 'system': 
        return 'text-gray-400 border-l-gray-500/30 bg-gray-500/5';
      default: 
        return 'text-leviathan-text border-l-leviathan-border bg-leviathan-surface-light/30';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>Event Stream</span>
        </div>
        <span className="text-xs text-leviathan-text-muted">
          {events.length} events
        </span>
      </div>
      
      <div 
        ref={feedRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-sm"
      >
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-2 rounded border-l-2 ${getEventColors(event.type)}`}
            >
              <div className="flex items-start gap-2">
                <span className="opacity-50 mt-0.5">
                  {getEventIcon(event.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs opacity-50 mb-1">
                    <span>{formatTime(event.timestamp)}</span>
                    <span className="uppercase">[{event.type}]</span>
                  </div>
                  <p className="break-words">{event.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {events.length === 0 && (
          <div className="text-center text-leviathan-text-muted py-8">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No events recorded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFeed;
