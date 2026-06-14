import React, { useState, useEffect } from 'react';
import { Trade, MACDDirection, CrossoverType, ExitReason, ResultStatus } from '../types';
import { calculateTradeFields } from '../utils/tradeCalculations';
import { X, Plus, Save, Loader2, Bookmark, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface AnalysisTemplate {
  name: string;
  didWell: string;
  wouldChange: string;
}

interface TradeFormProps {
  initialData?: Trade;
  onSubmit: (trade: Omit<Trade, 'id'>) => Promise<void> | void;
  onCancel: () => void;
}

export const STRATEGY_OPTIONS = ['Trend Following', 'Mean Reversion', 'Breakout', 'Scalping', 'Swing', 'News', 'RSI MACD Signal v2', 'CRT'];

export function TradeForm({ initialData, onSubmit, onCancel }: TradeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Trade>>(() => {
    if (initialData) return { ...initialData };
    const saved = localStorage.getItem('tradeFormDraft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      dateTime: new Date().toISOString().slice(0, 16),
      resultStatus: 'Open/Pending',
      macd4hDirection: 'Mixed',
      macd1hCrossover: 'Above zero',
      strategyTags: []
    };
  });

  const [analysisTemplates, setAnalysisTemplates] = useState<AnalysisTemplate[]>([]);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    const savedTemplates = localStorage.getItem('analysisTemplates');
    if (savedTemplates) {
      try {
        setAnalysisTemplates(JSON.parse(savedTemplates));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      localStorage.setItem('tradeFormDraft', JSON.stringify(formData));
    }
  }, [formData, initialData]);

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    const newTemplate: AnalysisTemplate = {
      name: newTemplateName,
      didWell: formData.didWell || '',
      wouldChange: formData.wouldChange || ''
    };
    const updated = [...analysisTemplates, newTemplate];
    setAnalysisTemplates(updated);
    localStorage.setItem('analysisTemplates', JSON.stringify(updated));
    setNewTemplateName('');
    setShowSaveTemplate(false);
    toast.success('Template saved');
  };

  const applyTemplate = (template: AnalysisTemplate) => {
    setFormData(prev => ({
      ...prev,
      didWell: template.didWell,
      wouldChange: template.wouldChange
    }));
    toast.success('Template applied');
  };

  const deleteTemplate = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = analysisTemplates.filter(t => t.name !== name);
    setAnalysisTemplates(updated);
    localStorage.setItem('analysisTemplates', JSON.stringify(updated));
  };

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
    
    setFormData(prev => calculateTradeFields(name, parsedValue, prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const submissionData = { ...formData };
    
    // Remove optional fields if they are empty strings so Firestore rules (which expect numbers or specific strings) aren't violated
    if ((submissionData as any).exitReason === '') delete submissionData.exitReason;
    if ((submissionData as any).exitPrice === '') delete submissionData.exitPrice;
    if ((submissionData as any).resultPips === '') delete submissionData.resultPips;
    if ((submissionData as any).notes === '') delete submissionData.notes;
    
    // Strip internal/metadata fields returned from Firestore so they aren't merged back
    if ('id' in submissionData) delete (submissionData as any).id;
    if ('userId' in submissionData) delete (submissionData as any).userId;
    if ('createdAt' in submissionData) delete (submissionData as any).createdAt;
    
    try {
      await onSubmit(submissionData as Omit<Trade, 'id'>);
      localStorage.removeItem('tradeFormDraft');
      toast.success(initialData ? 'Trade updated successfully!' : 'Trade logged successfully!');
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save trade. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-2xl">
          <div>
            <h2 className="text-xl font-mono text-zinc-900 dark:text-zinc-100 mb-1">{initialData ? 'Edit Entry' : 'New Entry'}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{initialData ? 'Update an existing trade' : 'Log a new trade setup'}</p>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">Self Review</h3>
                <div className="relative">
                  {analysisTemplates.length > 0 && (
                    <div className="flex items-center gap-2 mb-2 justify-end flex-wrap">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Templates:</span>
                      {analysisTemplates.map(t => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => applyTemplate(t)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs font-medium transition-colors group"
                        >
                          <Bookmark className="w-3 h-3 text-indigo-500" />
                          {t.name}
                          <div 
                            onClick={(e) => deleteTemplate(t.name, e)}
                            className="ml-1 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-full transition-all"
                          >
                            <X className="w-2.5 h-2.5 text-zinc-500" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowSaveTemplate(!showSaveTemplate)}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    + Save current as template
                  </button>
                  {showSaveTemplate && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-xl z-20">
                      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Template Name</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveTemplate();
                            }
                          }}
                          placeholder="e.g. Good Setup"
                          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded md:px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleSaveTemplate}
                          disabled={!newTemplateName.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-1.5 rounded transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
              onClick={() => {
                setFormData({
                  dateTime: new Date().toISOString().slice(0, 16),
                  pair: 'EURUSD',
                  timeframe: '1H',
                  macd4hDirection: 'Bullish',
                  macd1hCrossover: 'Above zero',
                  rsiAtEntry: 45,
                  entryPrice: 1.1000,
                  stopLossPrice: 1.0950,
                  stopLossPips: 50,
                  takeProfitPrice: 1.1100,
                  takeProfitRR: 2,
                  resultStatus: 'Win',
                  exitPrice: 1.1100,
                  exitReason: 'Hit TP',
                  resultPips: 100,
                  didWell: 'Followed strategy perfectly and waited for TP.',
                  wouldChange: 'Nothing, great setup.',
                  strategyTags: ['Trend Following'],
                  notes: 'Testing demo data save functionality.'
                });
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-medium"
            >
              Fill Demo Data
            </button>
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
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-medium shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
