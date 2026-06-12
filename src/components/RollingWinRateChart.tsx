import React from 'react';
import { Trade } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface RollingWinRateChartProps {
  trades: Trade[];
}

export function RollingWinRateChart({ trades }: RollingWinRateChartProps) {
  // Sort trades chronologically
  const sortedTrades = [...trades]
    .filter(t => t.resultStatus !== 'Open/Pending' && t.resultStatus !== 'Open')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  if (sortedTrades.length === 0) return null;

  const WINDOW_SIZE = 10;
  
  const chartData = sortedTrades.map((trade, index) => {
    // Calculate win rate for the last WINDOW_SIZE trades up to 'index'
    const startIdx = Math.max(0, index - WINDOW_SIZE + 1);
    const windowTrades = sortedTrades.slice(startIdx, index + 1);
    
    const wins = windowTrades.filter(t => t.resultStatus === 'Win').length;
    const winRate = windowTrades.length > 0 ? (wins / windowTrades.length) * 100 : 0;

    return {
      index: index + 1,
      date: new Date(trade.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      winRate: Number(winRate.toFixed(1)),
      pair: trade.pair
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Trade #{payload[0].payload.index} ({payload[0].payload.date})
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Pair:</span>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{payload[0].payload.pair}</span>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-2 pt-2 gap-4">
             <span className="text-xs text-zinc-500">Win Rate:</span>
             <span className="text-sm font-mono font-bold text-emerald-500">{payload[0].value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 uppercase tracking-wide">Rolling Win Rate</h3>
          <p className="text-xs text-zinc-500 mt-1">Past {WINDOW_SIZE} Trades window</p>
        </div>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:stroke-zinc-800" />
            <XAxis 
              dataKey="index" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 12, fontFamily: 'monospace' }}
              tickFormatter={(value) => `${value}%`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="3 3" opacity={0.5} />
            <Line 
              type="monotone" 
              dataKey="winRate" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
