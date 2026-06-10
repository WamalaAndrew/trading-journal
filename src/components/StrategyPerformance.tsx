import { Trade } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getActualPips } from '../utils/tradeCalculations';

interface StrategyPerformanceProps {
  trades: Trade[];
}

export function StrategyPerformance({ trades }: StrategyPerformanceProps) {
  if (trades.length === 0) return null;

  // Calculate performance per pair
  const pairStats: Record<string, { pips: number; count: number }> = {};
  trades.forEach(t => {
    const pips = getActualPips(t);
    const pair = t.pair || 'Unknown';
    if (!pairStats[pair]) {
      pairStats[pair] = { pips: 0, count: 0 };
    }
    pairStats[pair].pips += pips;
    pairStats[pair].count += 1;
  });

  const chartData = Object.entries(pairStats)
    .map(([pair, stats]) => ({
      name: pair,
      pips: stats.pips,
      count: stats.count
    }))
    .sort((a, b) => b.pips - a.pips)
    .slice(0, 10); // Top 10 pairs

  const formatPips = (pips: number) => {
    return Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pips);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{data.name}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Trades: {data.count}</p>
          <p className={`text-sm font-mono font-bold ${data.pips >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {formatPips(data.pips)} pips
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Performance By Pair</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Net pips gained or lost per instrument</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <XAxis 
              type="number"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }} 
              className="text-zinc-400 dark:text-zinc-500"
              tickFormatter={(value) => formatPips(value)}
            />
            <YAxis 
              dataKey="name" 
              type="category"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
              className="text-zinc-600 dark:text-zinc-300"
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Bar dataKey="pips" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.pips >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
