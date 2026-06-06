import React, { useState } from 'react';
import { Trade } from '../types';
import { Activity, Percent, Crosshair, TrendingUp, AlertCircle, X, Check } from 'lucide-react';

interface TradeCardProps {
  trade: Trade;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({ trade, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isWin = trade.resultStatus === 'Win';
  const isLoss = trade.resultStatus === 'Loss';
  const isBreakeven = trade.resultStatus === 'Breakeven';
  
  const statusColor = isWin ? 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20' 
                   : isLoss ? 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20'
                   : isBreakeven ? 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20'
                   : 'text-zinc-600 bg-zinc-100 border-zinc-200 dark:text-zinc-400 dark:bg-zinc-800/50 dark:border-zinc-700';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">{trade.pair}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
              {trade.resultStatus}
            </span>
          </div>
          <p className="text-sm text-zinc-500 font-mono">
            {new Date(trade.dateTime).toLocaleString(undefined, { 
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </p>
          {trade.strategyTags && trade.strategyTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {trade.strategyTags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-400 dark:border-zinc-700/50">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {/* Action buttons could go here */}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> 4H/1H</p>
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-300">{trade.macd4hDirection} / {trade.macd1hCrossover}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> RSI</p>
          <p className="text-sm font-mono text-zinc-800 dark:text-zinc-300">{trade.rsiAtEntry}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><Crosshair className="w-3.5 h-3.5" /> Entry/SL</p>
          <div className="flex flex-col">
          <p className="text-sm font-mono text-zinc-800 dark:text-zinc-300">{trade.entryPrice}</p>
          <p className="text-xs font-mono text-red-500 dark:text-red-400">{trade.stopLossPrice} ({trade.stopLossPips}p)</p>
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Result</p>
          <div className="flex flex-col">
          <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400">{trade.takeProfitPrice} (1:{trade.takeProfitRR})</p>
          {trade.resultPips !== undefined && trade.resultPips !== null && (
            <p className={`text-xs font-mono ${trade.resultPips > 0 ? 'text-emerald-600 dark:text-emerald-400' : trade.resultPips < 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
              {trade.resultPips > 0 ? '+' : ''}{trade.resultPips} pips
            </p>
          )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-lg">
          <p className="text-xs text-indigo-500 dark:text-indigo-400/70 mb-1 font-medium tracking-wide uppercase">What I did well</p>
          <p className="text-sm text-zinc-800 dark:text-zinc-300">{trade.didWell}</p>
        </div>
        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-lg">
          <p className="text-xs text-amber-600 dark:text-amber-400/70 mb-1 font-medium tracking-wide uppercase">What I would change</p>
          <p className="text-sm text-zinc-800 dark:text-zinc-300">{trade.wouldChange}</p>
        </div>
      </div>

      {trade.notes && (
        <div className="mt-4 px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1 font-medium tracking-wide uppercase">Trading Notes</p>
          <p className="text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">{trade.notes}</p>
        </div>
      )}

      {trade.resultPips !== undefined && trade.stopLossPips > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Realized R:R</span>
            <span className={`text-xs font-mono font-bold ${trade.resultPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {(trade.resultPips / trade.stopLossPips).toFixed(2)}R
            </span>
          </div>
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex relative">
             {/* Target Marker */}
             <div 
               className="absolute top-0 bottom-0 w-0.5 bg-indigo-500/50 z-10" 
               style={{ left: `${Math.min((trade.takeProfitRR / Math.max(trade.takeProfitRR, 3)) * 100, 100)}%` }}
               title={`Target: ${trade.takeProfitRR}R`}
             />
             {/* Bar Fill */}
             <div 
               className={`h-full transition-all duration-500 ${trade.resultPips >= 0 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-red-500 dark:bg-red-400'}`}
               style={{ width: `${Math.min((Math.abs(trade.resultPips / trade.stopLossPips) / Math.max(trade.takeProfitRR, 3)) * 100, 100)}%` }}
             />
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2 transition-opacity">
        {showDeleteConfirm ? (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mr-2">
              <AlertCircle className="w-3.5 h-3.5" /> Delete this entry?
            </span>
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(trade.id)}
              className="p-1 text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 dark:bg-red-500/10 rounded transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="text-xs font-medium text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Delete Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
