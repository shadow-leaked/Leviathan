import { motion } from 'framer-motion';
import { Globe, TreePine, Mountain, Droplets, Wind, Sun, Settings, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { useState } from 'react';

const ResourceCard = ({ icon: Icon, name, value, max, color, onUpdate }) => {
  const percent = Math.min(100, (value / max) * 100);
  
  return (
    <div className="bg-leviathan-surface border border-leviathan-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-medium text-leviathan-text">{name}</span>
        </div>
        <span className="text-lg font-bold text-leviathan-text">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-leviathan-surface-light rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full rounded-full transition-all ${color.replace('bg-', 'bg-opacity-100 ')}`}
          style={{ width: `${percent}%`, backgroundColor: 'currentColor' }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onUpdate(value + 100)}
          className="flex-1 py-1.5 text-xs rounded bg-leviathan-surface-light hover:bg-leviathan-primary/20 hover:text-leviathan-primary transition-colors text-leviathan-text-muted"
        >
          +100
        </button>
        <button
          onClick={() => onUpdate(value + 1000)}
          className="flex-1 py-1.5 text-xs rounded bg-leviathan-surface-light hover:bg-leviathan-primary/20 hover:text-leviathan-primary transition-colors text-leviathan-text-muted"
        >
          +1K
        </button>
        <button
          onClick={() => onUpdate(value + 10000)}
          className="flex-1 py-1.5 text-xs rounded bg-leviathan-surface-light hover:bg-leviathan-primary/20 hover:text-leviathan-primary transition-colors text-leviathan-text-muted"
        >
          +10K
        </button>
      </div>
    </div>
  );
};

const EnvironmentControl = ({ label, value, min, max, onChange, icon: Icon }) => (
  <div className="bg-leviathan-surface-light rounded-lg p-4">
    <div className="flex items-center gap-3 mb-3">
      <Icon className="w-5 h-5 text-leviathan-primary" />
      <span className="text-sm font-medium text-leviathan-text">{label}</span>
    </div>
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-leviathan-surface rounded-lg appearance-none cursor-pointer accent-leviathan-primary"
      />
      <span className="text-sm font-mono text-leviathan-text w-12 text-right">{value}</span>
    </div>
  </div>
);

const WorldMetrics = ({ worldState }) => {
  const populationData = worldState.populationTrend?.map((val, idx) => ({
    tick: idx * 10,
    population: val,
  })) || [];

  const resourceHistory = worldState.resourceHistory?.map((val, idx) => ({
    tick: idx * 10,
    resources: val,
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-leviathan-surface border border-leviathan-border rounded-lg p-4">
        <h3 className="font-mono text-sm uppercase text-leviathan-text-muted mb-4">Population History</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={populationData}>
              <defs>
                <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="tick" stroke="#4a4a5a" fontSize={12} tickLine={false} />
              <YAxis stroke="#4a4a5a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  border: '1px solid #2a2a3a',
                  borderRadius: '4px',
                }}
                itemStyle={{ color: '#00d4ff' }}
              />
              <Area
                type="monotone"
                dataKey="population"
                stroke="#00d4ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#popGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-leviathan-surface border border-leviathan-border rounded-lg p-4">
        <h3 className="font-mono text-sm uppercase text-leviathan-text-muted mb-4">Resource Depletion</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={resourceHistory}>
              <XAxis dataKey="tick" stroke="#4a4a5a" fontSize={12} tickLine={false} />
              <YAxis stroke="#4a4a5a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12121a',
                  border: '1px solid #2a2a3a',
                  borderRadius: '4px',
                }}
                itemStyle={{ color: '#ff6b6b' }}
              />
              <Line
                type="monotone"
                dataKey="resources"
                stroke="#ff6b6b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const WorldPage = ({ worldState, onSpawnResources, onTriggerEvent, onReset }) => {
  const [resources, setResources] = useState({
    food: worldState.resources || 1000,
    water: 500,
    wood: 300,
    stone: 200,
  });

  const [environment, setEnvironment] = useState({
    temperature: 20,
    humidity: 50,
    windSpeed: 10,
    sunlight: 80,
  });

  const updateResource = (key, value) => {
    setResources(prev => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const updateEnvironment = (key, value) => {
    setEnvironment(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-leviathan-primary" />
          <h1 className="text-2xl font-bold text-leviathan-text">World Control</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSpawnResources}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-leviathan-primary/20 text-leviathan-primary border border-leviathan-primary/30 hover:bg-leviathan-primary/30 transition-colors"
          >
            <TreePine className="w-4 h-4" />
            Spawn Resources
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-leviathan-danger/20 text-leviathan-danger border border-leviathan-danger/30 hover:bg-leviathan-danger/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset World
          </button>
        </div>
      </motion.div>

      {/* Resources Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold text-leviathan-text mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-leviathan-accent" />
          Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <ResourceCard
            icon={TreePine}
            name="Food"
            value={resources.food}
            max={10000}
            color="bg-leviathan-success/20 text-leviathan-success"
            onUpdate={(v) => updateResource('food', v)}
          />
          <ResourceCard
            icon={Droplets}
            name="Water"
            value={resources.water}
            max={5000}
            color="bg-leviathan-primary/20 text-leviathan-primary"
            onUpdate={(v) => updateResource('water', v)}
          />
          <ResourceCard
            icon={Mountain}
            name="Wood"
            value={resources.wood}
            max={3000}
            color="bg-leviathan-warning/20 text-leviathan-warning"
            onUpdate={(v) => updateResource('wood', v)}
          />
          <ResourceCard
            icon={Mountain}
            name="Stone"
            value={resources.stone}
            max={2000}
            color="bg-leviathan-text-muted/20 text-leviathan-text-muted"
            onUpdate={(v) => updateResource('stone', v)}
          />
        </div>
      </motion.div>

      {/* Environment Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold text-leviathan-text mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-leviathan-warning" />
          Environment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnvironmentControl
            label="Temperature"
            icon={Sun}
            value={environment.temperature}
            min={-20}
            max={50}
            onChange={(v) => updateEnvironment('temperature', v)}
          />
          <EnvironmentControl
            label="Humidity"
            icon={Droplets}
            value={environment.humidity}
            min={0}
            max={100}
            onChange={(v) => updateEnvironment('humidity', v)}
          />
          <EnvironmentControl
            label="Wind Speed"
            icon={Wind}
            value={environment.windSpeed}
            min={0}
            max={100}
            onChange={(v) => updateEnvironment('windSpeed', v)}
          />
          <EnvironmentControl
            label="Sunlight"
            icon={Sun}
            value={environment.sunlight}
            min={0}
            max={100}
            onChange={(v) => updateEnvironment('sunlight', v)}
          />
        </div>
      </motion.div>

      {/* World Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-bold text-leviathan-text mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-leviathan-primary" />
          World Metrics
        </h2>
        <WorldMetrics worldState={worldState} />
      </motion.div>
    </div>
  );
};

export default WorldPage;
