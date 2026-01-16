import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Maximize2, Settings, PenTool } from 'lucide-react';

/**
 * Custom tooltip for the trading chart displaying price and volume data.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ex-card border border-ex-border p-2 rounded shadow-xl text-xs font-mono">
        <p className="text-ex-text-secondary mb-1">{label}</p>
        <p className="text-ex-green">High: {payload[0].payload.high}</p>
        <p className="text-ex-red">Low: {payload[0].payload.low}</p>
        <p className="text-ex-text-primary">Close: {payload[0].value}</p>
        <p className="text-ex-text-muted mt-1">Vol: {payload[0].payload.volume}</p>
      </div>
    );
  }
  return null;
};

/**
 * Interactive trading chart component using Recharts to visualize price action and volume.
 */
export const TradingChart = ({ data }) => {
  const [timeframe, setTimeframe] = useState('1H');
  const timeframes = ['15m', '1H', '4H', '1D', '1W'];

  // Calculate min/max for Y-axis domain to make chart look dynamic
  const minPrice = Math.min(...data.map(d => d.low)) * 0.999;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.001;

  return (
    <div className="flex flex-col h-full bg-ex-bg relative group">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-ex-border">
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-ex-bg">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  timeframe === tf 
                    ? 'text-ex-text-primary bg-ex-border' 
                    : 'text-ex-text-secondary hover:text-ex-text-primary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-ex-border"></div>
          <button className="text-ex-text-secondary hover:text-ex-text-primary">
            <PenTool className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-ex-text-secondary">
             <button className="hover:text-ex-text-primary"><Settings className="w-4 h-4" /></button>
             <button className="hover:text-ex-text-primary"><Maximize2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ecb81" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ecb81" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2b3139" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#848e9c', fontSize: 10 }}
              minTickGap={50}
            />
            <YAxis 
              orientation="right" 
              domain={[minPrice, maxPrice]} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#848e9c', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) => val.toFixed(2)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#5e6673', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#0ecb81" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Volume Overlay (Simplified visual) */}
        <div className="absolute bottom-0 left-0 right-[60px] h-[20%] opacity-20 pointer-events-none">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data}>
               <Bar dataKey="volume">
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#0ecb81' : '#f6465d'} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
