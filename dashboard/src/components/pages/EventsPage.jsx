import { motion } from 'framer-motion';
import { ScrollText, Filter, Download, Trash2, AlertTriangle, Heart, Zap, Users, Settings } from 'lucide-react';
import { useState } from 'react';

const eventIcons = {
  bonding: Heart,
  cooperation: Heart,
  trade: Zap,
  social: Users,
  system: Settings,
  default: ScrollText,
};

const eventColors = {
  bonding: 'text-pink-400 bg-pink-400/20 border-pink-400/30',
  cooperation: 'text-leviathan-success bg-leviathan-success/20 border-leviathan-success/30',
  trade: 'text-leviathan-warning bg-leviathan-warning/20 border-leviathan-warning/30',
  social: 'text-leviathan-primary bg-leviathan-primary/20 border-leviathan-primary/30',
  system: 'text-leviathan-accent bg-leviathan-accent/20 border-leviathan-accent/30',
  default: 'text-leviathan-text-muted bg-leviathan-surface-light border-leviathan-border',
};

const EventItem = ({ event, index }) => {
  const Icon = eventIcons[event.type] || eventIcons.default;
  const colorClass = eventColors[event.type] || eventColors.default;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="flex items-start gap-4 p-4 rounded-lg bg-leviathan-surface border border-leviathan-border hover:border-leviathan-primary/30 transition-colors"
    >
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-leviathan-text-muted">
            {new Date(event.timestamp || Date.now()).toLocaleTimeString()}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full border ${colorClass}`}>
            {event.type}
          </span>
        </div>
        <p className="text-sm text-leviathan-text">{event.message}</p>
        {event.details && (
          <p className="text-xs text-leviathan-text-muted mt-1">{event.details}</p>
        )}
      </div>
    </motion.div>
  );
};

const EventStats = ({ events }) => {
  const stats = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  const total = events.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Object.entries(stats).map(([type, count]) => (
        <div key={type} className="bg-leviathan-surface-light rounded-lg p-3">
          <p className="text-2xl font-bold text-leviathan-text">{count}</p>
          <p className="text-xs text-leviathan-text-muted capitalize">{type}</p>
          <div className="mt-2 h-1 bg-leviathan-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-leviathan-primary rounded-full"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const EventsPage = ({ events, onClearEvents }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = (event.message || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.details || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const eventTypes = ['all', ...new Set(events.map(e => e.type))];

  const exportEvents = () => {
    const data = JSON.stringify(events, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <ScrollText className="w-6 h-6 text-leviathan-primary" />
          <h1 className="text-2xl font-bold text-leviathan-text">Events</h1>
          <span className="px-3 py-1 rounded-full bg-leviathan-surface-light text-sm text-leviathan-text-muted">
            {events.length} total
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportEvents}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-leviathan-surface-light text-leviathan-text hover:bg-leviathan-primary/20 hover:text-leviathan-primary transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onClearEvents}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-leviathan-danger/20 text-leviathan-danger border border-leviathan-danger/30 hover:bg-leviathan-danger/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <EventStats events={events} />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap items-center gap-4 mb-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-leviathan-text-muted" />
          <div className="flex gap-1">
            {eventTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                  filter === type
                    ? 'bg-leviathan-primary text-leviathan-bg'
                    : 'bg-leviathan-surface-light text-leviathan-text-muted hover:text-leviathan-text'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-leviathan-surface border border-leviathan-border text-leviathan-text placeholder-leviathan-text-muted focus:border-leviathan-primary focus:outline-none"
        />
      </motion.div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filteredEvents.map((event, index) => (
          <EventItem key={index} event={event} index={index} />
        ))}
        {filteredEvents.length === 0 && (
          <div className="flex items-center justify-center h-40 text-leviathan-text-muted">
            <p>No events found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
