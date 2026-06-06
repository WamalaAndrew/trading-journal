import { Trade } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  trades: Trade[];
}

export function PerformanceChart({ trades }: PerformanceChartProps) {
  if (trades.length === 0) return null;

  // Sort trades chronologically for the chart
  const sortedTrades = [...trades].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  let cumulativePips = 0;
  const chartData = sortedTrades.map((trade, index) => {
    cumulativePips += (Number(trade.resultPips) || 0);
    return {
      index: index + 1,
      date: new Date(trade.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      pips: cumulativePips,
      pair: trade.pair
    };
  });

  // Add initial point 0
  if (chartData.length > 0) {
    chartData.unshift({ index: 0, date: 'Start', pips: 0, pair: '' });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{payload[0].payload.date}</p>
          {payload[0].payload.pair && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Trade: {payload[0].payload.pair}</p>
          )}
          <p className={`text-sm font-mono font-bold ${payload[0].value >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {payload[0].value} pips
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Performance Trend</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Cumulative pips gained or lost</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-mono font-bold ${cumulativePips >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {cumulativePips >= 0 ? '+' : ''}{cumulativePips}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Net Pips</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }} 
              className="text-zinc-400 dark:text-zinc-500"
              minTickGap={30}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }}
              className="text-zinc-400 dark:text-zinc-500"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="stepAfter" 
              dataKey="pips" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#6366f1', stroke: 'var(--bg-zinc-900)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
