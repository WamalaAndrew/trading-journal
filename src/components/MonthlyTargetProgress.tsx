import React, { useState, useEffect } from 'react';
import { Edit2, Check } from 'lucide-react';

interface MonthlyTargetProgressProps {
  currentPips: number;
}

export function MonthlyTargetProgress({ currentPips }: MonthlyTargetProgressProps) {
  const [target, setTarget] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState('100');

  useEffect(() => {
    const saved = localStorage.getItem('monthlyPipTarget');
    if (saved && !isNaN(Number(saved))) {
      setTarget(Number(saved));
      setTempTarget(saved);
    }
  }, []);

  const handleSave = () => {
    const val = Number(tempTarget);
    if (!isNaN(val) && val > 0) {
      setTarget(val);
      localStorage.setItem('monthlyPipTarget', val.toString());
    } else {
      setTempTarget(target.toString());
    }
    setIsEditing(false);
  };

  const progress = Math.max(0, Math.min((currentPips / target) * 100, 100));
  const isTargetHit = currentPips >= target;

  return (
    <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-indigo-700 dark:text-indigo-500/80">Monthly Target</p>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors p-1"
        >
          {isEditing ? <Check className="w-4 h-4" onClick={handleSave} /> : <Edit2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isEditing ? (
        <div className="flex flex-col mb-1 relative z-10">
           <input 
             type="number" 
             value={tempTarget} 
             onChange={(e) => setTempTarget(e.target.value)} 
             className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 rounded px-2 py-1 text-lg font-mono text-zinc-900 dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-1"
             autoFocus
             onKeyDown={(e) => e.key === 'Enter' && handleSave()}
           />
           <p className="text-xs text-indigo-600/70 dark:text-indigo-500/60 font-medium">Set pip goal</p>
        </div>
      ) : (
        <div className="flex items-end gap-1 mb-1 relative z-10">
          <p className={`text-3xl font-mono ${isTargetHit ? 'text-emerald-500 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
            {currentPips >= 0 ? currentPips.toFixed(0) : 0}
          </p>
          <p className="text-lg font-mono text-indigo-400 dark:text-indigo-600/50 mb-0.5">/ {target}</p>
        </div>
      )}

      <div className="mt-3">
        <div className="flex justify-between text-[10px] font-medium text-indigo-700/60 dark:text-indigo-400/60 mb-1 uppercase tracking-wider">
          <span>Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isTargetHit ? 'bg-emerald-500' : 'bg-indigo-500 dark:bg-indigo-400'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
