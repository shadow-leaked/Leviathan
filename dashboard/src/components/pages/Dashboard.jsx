import { motion } from 'framer-motion';
import { Activity, Users, Globe, HeartHandshake, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const StatCard = ({ icon: Icon, label, value, subtext, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-leviathan-surface border border-leviathan-border rounded-lg p-4 hover:border-leviathan-primary/30 transition-colors"
  >
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs text-leviathan-text-muted font-mono">{subtext}</span>
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold text-leviathan-text">{value}</p>
      <p className="text-sm text-leviathan-text-muted">{label}</p>
    </div>
  </motion.div>
);

const MiniChart = ({ data, dataKey, color }) => (
  <div className="h-16 mt-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const RecentEvents = ({ events }) => (
  <div className="bg-leviathan-surface border border-leviathan-border rounded-lg overflow-hidden">
    <div className="px-4 py-3 bg-leviathan-surface-light border-b border-leviathan-border">
      <h3 className="font-mono text-sm uppercase text-leviathan-text-muted">Recent Events</h3>
    </div>
    <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
      {events.slice(0, 5).map((event, idx) => (
        <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-leviathan-surface-light text-sm">
          <span className="text-xs text-leviathan-text-muted font-mono">{event.time}</span>
          <span className={`w-2 h-2 rounded-full ${
            event.type === 'bonding' ? 'bg-pink-400' :
            event.type === 'social' ? 'bg-leviathan-success' :
            event.type === 'system' ? 'bg-leviathan-accent' :
            'bg-leviathan-primary'
          }`} />
          <span className="text-leviathan-text truncate">{event.message}</span>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-center text-leviathan-text-muted py-4 text-sm">No recent events</p>
      )}
    </div>
  </div>
);

const QuickActions = ({ onPlay, onPause, onSpawn, onReset, isRunning }) => (
  <div className="bg-leviathan-surface border border-leviathan-border rounded-lg p-4">
    <h3 className="font-mono text-sm uppercase text-leviathan-text-muted mb-3">Quick Actions</h3>
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={isRunning ? onPause : onPlay}
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
          isRunning 
            ? 'bg-leviathan-warning/20 text-leviathan-warning border border-leviathan-warning/30' 
            : 'bg-leviathan-success/20 text-leviathan-success border border-leviathan-success/30'
        }`}
      >
        {isRunning ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={onSpawn}
        className="px-3 py-2 rounded-lg bg-leviathan-primary/20 text-leviathan-primary border border-leviathan-primary/30 font-medium text-sm hover:bg-leviathan-primary/30 transition-colors"
      >
        Spawn
      </button>
      <button
        onClick={onReset}
        className="px-3 py-2 rounded-lg bg-leviathan-surface-light text-leviathan-danger border border-leviathan-border font-medium text-sm hover:text-leviathan-danger hover:border-leviathan-danger/30 transition-colors"
      >
        Reset
      </button>
    </div>
  </div>
);

const Dashboard = ({ 
  isRunning, 
  tick, 
  speed, 
  npcs, 
  events, 
  worldState,
  onPlay, 
  onPause, 
  onSpawnResources,
  onReset
}) => {
  // Society simulation uses state (active/recovering) and energy
  const activeNPCs = npcs.filter(n => n.state?.toLowerCase() === 'active').length;
  const avgEnergy = npcs.length > 0 
    ? Math.round(npcs.reduce((sum, n) => sum + (n.energy || n.vitals?.energy || 0), 0) / npcs.length) 
    : 0;
  
  const populationData = worldState.populationTrend.map((val, idx) => ({
    tick: idx * 10,
    value: val,
  }));

  const recentEvents = events.slice(0, 10).map(e => ({
    ...e,
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-leviathan-text">Dashboard</h1>
          <p className="text-leviathan-text-muted">Simulation overview and key metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-leviathan-text-muted">
          <Clock className="w-4 h-4" />
          <span>Tick {tick}</span>
          <span className="px-2 py-0.5 rounded-full bg-leviathan-surface-light text-xs">
            {speed}x
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Active Entities"
          value={activeNPCs}
          subtext={`${npcs.length} total`}
          color="bg-leviathan-primary/20 text-leviathan-primary"
          delay={0.1}
        />
        <StatCard
          icon={Activity}
          label="Avg Energy"
          value={`${avgEnergy}%`}
          subtext={avgEnergy > 60 ? 'Sufficient' : avgEnergy > 30 ? 'Low' : 'Critical'}
          color={`${avgEnergy > 60 ? 'bg-leviathan-success/20 text-leviathan-success' : avgEnergy > 30 ? 'bg-leviathan-warning/20 text-leviathan-warning' : 'bg-leviathan-danger/20 text-leviathan-danger'}`}
          delay={0.2}
        />
        <StatCard
          icon={Globe}
          label="Resources"
          value={worldState.resources?.toLocaleString() || '0'}
          subtext="Available"
          color="bg-leviathan-accent/20 text-leviathan-accent"
          delay={0.3}
        />
        <StatCard
          icon={HeartHandshake}
          label="Bonds"
          value={worldState.couples || 0}
          subtext="Active connections"
          color="bg-pink-400/20 text-pink-400"
          delay={0.4}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Population Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-leviathan-surface border border-leviathan-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-leviathan-primary" />
              <h3 className="font-mono text-sm uppercase text-leviathan-text-muted">Population Trend</h3>
            </div>
            <span className="text-xs text-leviathan-text-muted">Last 50 ticks</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={populationData}>
                <XAxis 
                  dataKey="tick" 
                  stroke="#4a4a5a"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#4a4a5a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid #2a2a3a',
                    borderRadius: '4px',
                  }}
                  itemStyle={{ color: '#00d4ff' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Panel */}
        <div className="space-y-4">
          <QuickActions 
            onPlay={onPlay} 
            onPause={onPause} 
            onSpawn={onSpawnResources}
            onReset={onReset}
            isRunning={isRunning}
          />
          <RecentEvents events={recentEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
