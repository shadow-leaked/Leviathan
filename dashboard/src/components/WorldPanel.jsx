import { motion } from 'framer-motion';
import { Globe, TrendingUp, Package, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const WorldPanel = ({ worldState }) => {
  const data = worldState.populationTrend.map((val, idx) => ({
    tick: idx * 10,
    population: val,
  }));

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header flex items-center gap-2">
        <Globe className="w-4 h-4" />
        <span>World State</span>
      </div>
      
      <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-visible">
        {/* Resource Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-leviathan-surface-light rounded-lg p-3">
            <div className="flex items-center gap-2 text-leviathan-accent mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">Resources</span>
            </div>
            <p className="stat-value">{worldState.resources.toLocaleString()}</p>
          </div>
          
          <div className="bg-leviathan-surface-light rounded-lg p-3">
            <div className="flex items-center gap-2 text-leviathan-accent mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">Activity</span>
            </div>
            <p className="stat-value">{worldState.activeRate || 0}%</p>
          </div>
        </div>

        {/* Population Chart */}
        <div className="bg-leviathan-surface-light rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-leviathan-primary">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">Population Trend</span>
            </div>
            <span className="text-xs text-leviathan-text-muted">
              Last 50 ticks
            </span>
          </div>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="tick" 
                  hide 
                />
                <YAxis 
                  hide 
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid #2a2a3a',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#00d4ff' }}
                />
                <Line
                  type="monotone"
                  dataKey="population"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* World Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-leviathan-text-muted">Total Entities</span>
            <span className="font-mono">{worldState.populationTrend[worldState.populationTrend.length - 1]}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-leviathan-text-muted">Active Couples</span>
            <span className="font-mono text-leviathan-success">
              {worldState.couples || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-leviathan-text-muted">Children Born</span>
            <span className="font-mono text-leviathan-accent">
              {worldState.births || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldPanel;
