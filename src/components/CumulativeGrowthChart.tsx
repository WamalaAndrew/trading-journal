import { Trade } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getActualPips } from '../utils/tradeCalculations';

interface CumulativeGrowthChartProps {
  trades: Trade[];
}

export function CumulativeGrowthChart({ trades }: CumulativeGrowthChartProps) {
  if (trades.length === 0) return null;

  // Sort trades chronologically
  const sortedTrades = [...trades].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  let cumulativePips = 0;
  const chartData = sortedTrades.map((trade, index) => {
    cumulativePips += getActualPips(trade);
    return {
      index: index + 1,
      date: new Date(trade.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      pips: cumulativePips,
      pair: trade.pair
    };
  });

  // Add initial point 0
  if (chartData.length > 0) {
    chartData.unshift({ index: 0, date: 'Start', pips: 0, pair: '' });
  }

  const formatPips = (pips: number) => {
    return Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pips);
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
            Cumulative: {payload[0].value >= 0 ? '+' : ''}{formatPips(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const isProfitable = cumulativePips >= 0;
  const strokeColor = isProfitable ? '#10b981' : '#ef4444';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Cumulative Growth</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Account progress over time</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-mono font-bold ${isProfitable ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {isProfitable ? '+' : ''}{formatPips(cumulativePips)}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Net Pips</p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800 opacity-50" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }} 
              className="text-zinc-400 dark:text-zinc-500"
              minTickGap={30}
              tickFormatter={(val) => val === 'Start' ? val : val.split(',')[0]}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12 }}
              className="text-zinc-400 dark:text-zinc-500"
              tickFormatter={(value) => formatPips(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="pips" 
              stroke={strokeColor} 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorGrowth)"
              activeDot={{ r: 6, fill: strokeColor, stroke: 'var(--bg-zinc-900)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
