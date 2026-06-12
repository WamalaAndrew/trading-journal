import React from 'react';
import { Trade } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getActualPips } from '../utils/tradeCalculations';

interface HourlyPerformanceChartProps {
  trades: Trade[];
}

export function HourlyPerformanceChart({ trades }: HourlyPerformanceChartProps) {
  // Group by hour
  const grouped: Record<number, number> = {};
  
  trades.forEach(t => {
    if (t.resultStatus === 'Open/Pending') return;
    const d = new Date(t.dateTime);
    const hour = d.getHours();
    const pips = getActualPips(t);
    if (!grouped[hour]) grouped[hour] = 0;
    grouped[hour] += pips;
  });

  const chartData = Object.entries(grouped)
    .map(([hour, pips]) => {
      const hr = parseInt(hour, 10);
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const displayHr = hr % 12 || 12;
      return { 
        hr, // for sorting
        hourLabel: `${displayHr} ${ampm}`, 
        pips: Number(pips.toFixed(2)) 
      };
    })
    .sort((a, b) => a.hr - b.hr);

  if (chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPositive = payload[0].value >= 0;
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{label}</p>
          <p className={`text-sm font-mono font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{payload[0].value} pips
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 uppercase tracking-wide">Hourly Performance</h3>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:stroke-zinc-800" />
            <XAxis 
              dataKey="hourLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 12, fontFamily: 'monospace' }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(161, 161, 170, 0.1)' }} />
            <Bar dataKey="pips" radius={[4, 4, 4, 4]}>
               {chartData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.pips >= 0 ? '#818CF8' : '#F87171'} />
               ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
