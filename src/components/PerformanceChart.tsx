import { Trade } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PerformanceChartProps {
  trades: Trade[];
}

export function PerformanceChart({ trades }: PerformanceChartProps) {
  if (trades.length === 0) return null;

  // Sort trades chronologically for the chart
  const sortedTrades = [...trades].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  let cumulativePips = 0;
  const chartData = sortedTrades.map((trade, index) => {
    const pips = Number(trade.resultPips) || 0;
    cumulativePips += pips;
    return {
      index: index + 1,
      date: new Date(trade.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      pips: pips,
      cumulative: cumulativePips,
      pair: trade.pair
    };
  });

  const formatPips = (pips: number) => {
    return Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(pips);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{payload[0].payload.date}</p>
          {payload[0].payload.pair && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Trade: {payload[0].payload.pair}</p>
          )}
          <p className={`text-sm font-mono font-bold ${payload[0].value >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            Trade Pips: {payload[0].value >= 0 ? '+' : ''}{formatPips(payload[0].value)}
          </p>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
            Net: {formatPips(payload[0].payload.cumulative)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Trade Results</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Pips gained or lost per trade</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-mono font-bold ${cumulativePips >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {cumulativePips >= 0 ? '+' : ''}{formatPips(cumulativePips)}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Net Pips</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800 opacity-50" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }} 
              className="text-zinc-400 dark:text-zinc-500"
              minTickGap={30}
              tickFormatter={(val) => val.split(',')[0]} // Just show date
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }}
              className="text-zinc-400 dark:text-zinc-500"
              tickFormatter={(value) => formatPips(value)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(161, 161, 170, 0.1)' }} />
            <Bar dataKey="pips" radius={[4, 4, 4, 4]}>
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
