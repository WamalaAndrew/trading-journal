import React, { useState, useMemo } from 'react';
import { Trade } from '../types';
import { TradeCard } from './TradeCard';
import { getActualPips } from '../utils/tradeCalculations';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

export function CalendarView({ trades, onEdit, onDelete }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Map trades by local date string YYYY-MM-DD
  const tradesByDate = useMemo(() => {
    const map: Record<string, { trades: Trade[], netPips: number }> = {};
    trades.forEach(t => {
      const d = new Date(t.dateTime);
      // Create local YYYY-MM-DD string
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[dateStr]) {
        map[dateStr] = { trades: [], netPips: 0 };
      }
      map[dateStr].trades.push(t);
      map[dateStr].netPips += getActualPips(t);
    });
    return map;
  }, [trades]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun, 1 = Mon, etc.

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const selectedDateTrades = selectedDate ? tradesByDate[selectedDate]?.trades || [] : [];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100 uppercase tracking-wide">
          <CalendarIcon className="w-5 h-5 text-indigo-500" />
          Trading Calendar
        </h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 w-32 text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 py-2">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-16 md:h-24 rounded-lg bg-transparent" />;
          }

          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayData = tradesByDate[dateStr];
          const hasTrades = !!dayData;
          const isSelected = selectedDate === dateStr;
          
          let bgColorClass = 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800/50';
          let textColorClass = 'text-zinc-700 dark:text-zinc-300';
          
          if (hasTrades) {
            if (dayData.netPips > 0) {
              bgColorClass = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30';
              textColorClass = 'text-emerald-700 dark:text-emerald-400';
            } else if (dayData.netPips < 0) {
              bgColorClass = 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
              textColorClass = 'text-red-700 dark:text-red-400';
            } else {
              bgColorClass = 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700';
            }
          }

          if (isSelected) {
            bgColorClass = 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 dark:border-indigo-400 shadow-sm';
            textColorClass = 'text-indigo-700 dark:text-indigo-300';
          }

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={`relative h-16 md:h-24 rounded-lg border flex flex-col p-1.5 md:p-2 transition-all hover:border-indigo-300 dark:hover:border-indigo-700 ${bgColorClass}`}
            >
              <span className={`text-xs md:text-sm font-medium ${textColorClass}`}>{day}</span>
              {hasTrades && (
                <div className="mt-auto w-full text-left">
                  <p className={`text-[10px] md:text-xs font-mono font-bold truncate ${dayData.netPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {dayData.netPips > 0 ? '+' : ''}{dayData.netPips.toFixed(0)} <span className="hidden lg:inline">pips</span>
                  </p>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayData.trades.slice(0, 3).map((t, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${t.resultStatus === 'Win' ? 'bg-emerald-500' : t.resultStatus === 'Loss' ? 'bg-red-500' : 'bg-zinc-400'}`} />
                    ))}
                    {dayData.trades.length > 3 && <span className="text-[8px] text-zinc-500 ml-0.5 leading-none">+{dayData.trades.length - 3}</span>}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              Trades on {new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {selectedDateTrades.length}
              </span>
            </h4>
            <button onClick={() => setSelectedDate(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {selectedDateTrades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDateTrades.map(trade => (
                <TradeCard 
                  key={trade.id} 
                  trade={trade} 
                  onEdit={() => onEdit(trade)} 
                  onDelete={() => onDelete(trade.id)} 
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8 bg-zinc-50 dark:bg-zinc-950 rounded-lg">
              No trades logged on this date.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
