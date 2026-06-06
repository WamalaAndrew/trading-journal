import React, { useState } from 'react';
import { Trade, MACDDirection, CrossoverType, ExitReason, ResultStatus } from '../types';
import { X, Plus, Save } from 'lucide-react';

interface TradeFormProps {
  onSubmit: (trade: Omit<Trade, 'id'>) => void;
  onCancel: () => void;
}

export const STRATEGY_OPTIONS = ['Trend Following', 'Mean Reversion', 'Breakout', 'Scalping', 'Swing', 'News'];

export function TradeForm({ onSubmit, onCancel }: TradeFormProps) {
  const [formData, setFormData] = useState<Partial<Trade>>({
    dateTime: new Date().toISOString().slice(0, 16),
    resultStatus: 'Open/Pending',
    macd4hDirection: 'Mixed',
    macd1hCrossover: 'Above zero',
    strategyTags: []
  });

  const toggleStrategy = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.strategyTags || [];
      if (currentTags.includes(tag)) {
        return { ...prev, strategyTags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, strategyTags: [...currentTags, tag] };
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => {
      const next = { ...prev, [name]: parsedValue };
      
      const entry = Number(next.entryPrice);
      const tpp = Number(next.takeProfitPrice);
      const slp = Number(next.stopLossPrice);
      const ep = Number(next.exitPrice);
      const pair = next.pair || '';
      
      if (!isNaN(entry) && entry > 0) {
        const mult = pair.toUpperCase().includes('JPY') ? 100 : 10000;
        const isLong = !isNaN(tpp) && tpp > 0 ? tpp > entry : (!isNaN(slp) && slp > 0 ? slp < entry : true);

        if (!isNaN(slp) && slp > 0 && name !== 'stopLossPips') {
           next.stopLossPips = Number((Math.abs(entry - slp) * mult).toFixed(1));
        } else if (name === 'stopLossPips' && next.stopLossPips > 0) {
           // If user manually types SL pips, maybe don't overwrite if they want manual control. 
        }

        if (!isNaN(tpp) && tpp > 0 && !isNaN(slp) && slp > 0 && name !== 'takeProfitRR') {
           const slDistance = Math.abs(entry - slp);
           const tpDistance = Math.abs(tpp - entry);
           if (slDistance > 0) {
              next.takeProfitRR = Number((tpDistance / slDistance).toFixed(2));
           }
        }

        if (!isNaN(ep) && ep > 0 && name !== 'resultPips') {
           const profit = isLong ? ep - entry : entry - ep;
           next.resultPips = Number((profit * mult).toFixed(1));
           
           if (!prev.resultStatus || prev.resultStatus === 'Open/Pending') {
             if (profit > 0) next.resultStatus = 'Win';
             else if (profit < 0) next.resultStatus = 'Loss';
             else next.resultStatus = 'Breakeven';
           }
        }
      }
      
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = { ...formData };
    
    // Remove optional fields if they are empty strings so Firestore rules (which expect numbers or specific strings) aren't violated
    if (submissionData.exitReason === '') delete submissionData.exitReason;
    if (submissionData.exitPrice === '') delete submissionData.exitPrice;
    if (submissionData.resultPips === '') delete submissionData.resultPips;
    if (submissionData.notes === '') delete submissionData.notes;
    
    onSubmit(submissionData as Omit<Trade, 'id'>);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-2xl">
          <div>
            <h2 className="text-xl font-mono text-zinc-900 dark:text-zinc-100 mb-1">New Entry</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Log a new trade setup</p>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 scrollbar-thin">
          <form id="trade-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Entry Details */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-4">Core Details</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Date & Time</label>
                    <input required type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Pair</label>
                    <input required type="text" name="pair" placeholder="e.g. EURUSD" value={formData.pair || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all uppercase placeholder:normal-case font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Timeframe</label>
                    <input required type="text" name="timeframe" placeholder="e.g. 1H entry / 4H bias" value={formData.timeframe || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Entry Price</label>
                    <input required type="number" step="any" name="entryPrice" placeholder="0.0000" value={formData.entryPrice || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Strategy Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {STRATEGY_OPTIONS.map(tag => {
                      const isSelected = formData.strategyTags?.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleStrategy(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            isSelected 
                              ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

            {/* Indicators */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-4">Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">4H MACD Direction</label>
                  <select name="macd4hDirection" value={formData.macd4hDirection} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">1H Crossover Type</label>
                  <select name="macd1hCrossover" value={formData.macd1hCrossover} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="Above zero">Above zero</option>
                    <option value="Below zero">Below zero</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">RSI at entry</label>
                  <input required type="number" name="rsiAtEntry" placeholder="e.g. 38" value={formData.rsiAtEntry || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono" />
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

            {/* Risk Management */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-4">Risk Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Stop Loss Price</label>
                    <input required type="number" step="any" name="stopLossPrice" placeholder="0.0000" value={formData.stopLossPrice || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Pips at Risk</label>
                    <input required type="number" step="any" name="stopLossPips" placeholder="e.g. 15" value={formData.stopLossPips || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-mono" />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Take Profit Price</label>
                    <input required type="number" step="any" name="takeProfitPrice" placeholder="0.0000" value={formData.takeProfitPrice || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">R:R Ratio</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 font-mono">1:</span>
                      <input required type="number" step="any" name="takeProfitRR" placeholder="2" value={formData.takeProfitRR || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-4 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

            {/* Exit Results */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-4">Closure (Optional initially)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Result Status</label>
                  <select name="resultStatus" value={formData.resultStatus} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="Open/Pending">Open/Pending</option>
                    <option value="Win">Win</option>
                    <option value="Loss">Loss</option>
                    <option value="Breakeven">Breakeven</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Exit Reason</label>
                  <select name="exitReason" value={formData.exitReason || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="">-- Select --</option>
                    <option value="Hit TP">Hit TP</option>
                    <option value="Hit SL">Hit SL</option>
                    <option value="MACD cross">MACD cross</option>
                    <option value="RSI">RSI</option>
                    <option value="Manual">Manual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                 <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Exit Price</label>
                  <input type="number" step="any" name="exitPrice" placeholder="0.0000" value={formData.exitPrice || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Pips Gained/Lost</label>
                  <input type="number" step="any" name="resultPips" placeholder="+/- 0" value={formData.resultPips || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono" />
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

            {/* Review */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-4">Self Review</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">What I did well (One honest sentence)</label>
                  <textarea required name="didWell" rows={2} placeholder="e.g. Maintained discipline waiting for the true cross." value={formData.didWell || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">What I would change (One honest sentence)</label>
                  <textarea required name="wouldChange" rows={2} placeholder="e.g. Could have tightened SL after consecutive bullish candles." value={formData.wouldChange || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none" />
                </div>
                <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Trading Notes & Insights (Detailed psychological/execution notes)</label>
                  <textarea name="notes" rows={4} placeholder="e.g. Felt FOMO entering? How was market structure? Thoughts leading to exit?" value={formData.notes || ''} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y min-h-[100px]" />
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-6 rounded-b-2xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="trade-form"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-medium shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
            >
              <Save className="w-4 h-4" />
              Save Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
