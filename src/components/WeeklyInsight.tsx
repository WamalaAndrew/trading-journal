import React, { useMemo } from 'react';
import { Trade } from '../types';
import { getActualPips } from '../utils/tradeCalculations';
import { TrendingUp, Target, Activity } from 'lucide-react';

interface WeeklyInsightProps {
  trades: Trade[];
}

export function WeeklyInsight({ trades }: WeeklyInsightProps) {
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentTrades = trades.filter(t => new Date(t.dateTime) >= sevenDaysAgo);
    
    // Total Profit (Net Pips)
    const netPips = recentTrades.reduce((acc, t) => acc + getActualPips(t), 0);
    
    // Win Rate
    const closedRecent = recentTrades.filter(t => t.resultStatus === 'Win' || t.resultStatus === 'Loss');
    const wins = closedRecent.filter(t => t.resultStatus === 'Win').length;
    const winRate = closedRecent.length > 0 ? (wins / closedRecent.length) * 100 : 0;
    
    // Most Traded Strategy
    const strategyCounts: Record<string, number> = {};
    recentTrades.forEach(t => {
      (t.strategyTags || []).forEach(tag => {
        strategyCounts[tag] = (strategyCounts[tag] || 0) + 1;
      });
    });
    
    let bestStrategy = 'N/A';
    let maxCount = 0;
    for (const [strategy, count] of Object.entries(strategyCounts)) {
      if (count > maxCount) {
        maxCount = count;
        bestStrategy = strategy;
      }
    }
    
    return {
      tradeCount: recentTrades.length,
      netPips,
      winRate,
      bestStrategy
    };
  }, [trades]);

  return (
    <div className="bg-zinc-800 dark:bg-zinc-900 border border-zinc-700 dark:border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Weekly Insight
        </h3>
        <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-700/50 text-zinc-300 rounded-full">
          Past 7 Days
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 relative z-10">
        <div>
          <p className="text-xs text-zinc-400 font-medium mb-1">Net Pips</p>
          <p className={`text-xl font-mono ${weeklyStats.netPips > 0 ? 'text-emerald-400' : weeklyStats.netPips < 0 ? 'text-red-400' : 'text-zinc-100'}`}>
            {weeklyStats.netPips > 0 ? '+' : ''}{weeklyStats.netPips.toFixed(1)}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-zinc-400 font-medium mb-1">Win Rate</p>
          <p className="text-xl font-mono text-zinc-100">
            {weeklyStats.winRate.toFixed(1)}%
          </p>
        </div>
        
        <div>
          <p className="text-xs text-zinc-400 font-medium mb-1">Top Strategy</p>
          <p className="text-sm font-medium text-indigo-300 truncate mt-1">
            {weeklyStats.bestStrategy}
          </p>
        </div>
      </div>
    </div>
  );
}
