import React, { useState } from 'react';
import { FRVP_TEMPLATES, FRVP_PINE_SCRIPT_CODE, StrategyTemplateItem } from '../data/strategyTemplates';
import { Trade } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Layers, 
  SlidersHorizontal, 
  Code2, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FrvpStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: Omit<Trade, 'id'>) => void;
}

export function FrvpStrategyModal({ isOpen, onClose, onSelectTemplate }: FrvpStrategyModalProps) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'templates' | 'pinescript' | 'rules'>('templates');
  const [copiedPine, setCopiedPine] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplateItem>(FRVP_TEMPLATES[0]);
  const [visualModel, setVisualModel] = useState<'sweep' | 'choch' | 'inverse'>('sweep');

  if (!isOpen) return null;

  const handleCopyPine = () => {
    navigator.clipboard.writeText(FRVP_PINE_SCRIPT_CODE);
    setCopiedPine(true);
    toast.success('Pine Script v6 copied to clipboard!');
    setTimeout(() => setCopiedPine(false), 2500);
  };

  const handleApplyTemplate = (tpl: StrategyTemplateItem) => {
    onSelectTemplate(tpl.data);
    onClose();
    toast.success(`Template applied: ${tpl.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl my-6 relative flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  FRVP POC Bounce v7.1
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                  Pine Script v6
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Volume Profile POC • Sweep & Reclaim • CHoCH-BOS • v7 Inverse Retest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={handleCopyPine}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors"
            >
              {copiedPine ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPine ? 'Copied' : 'Copy Pine Script'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6 bg-zinc-50/70 dark:bg-zinc-950/40 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'templates'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Relatable Templates ({FRVP_TEMPLATES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'visualizer'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Interactive Visual Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Strategy Rules & Logic</span>
          </button>
          <button
            onClick={() => setActiveTab('pinescript')}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'pinescript'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Pine Script v6 Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {/* TAB 1: RELATABLE TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <BookmarkPlus className="w-4 h-4 text-amber-500" />
                      Pre-Built Relatable Trade Templates
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Select any template below to examine real-world market context, execution logic, psychological notes, and immediately log it into your journal.
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplyTemplate(selectedTemplate)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs sm:text-sm rounded-lg shadow-md transition-colors whitespace-nowrap"
                  >
                    <span>Use Selected Template</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Template Selector Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {FRVP_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-500/10 ring-1 ring-amber-500/50'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="font-mono font-bold text-xs uppercase text-zinc-900 dark:text-zinc-100">
                            {tpl.data.pair}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            tpl.direction.includes('Long') ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
                            tpl.direction.includes('Short') ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' :
                            'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {tpl.direction}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2 mb-2">
                          {tpl.title}
                        </p>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {tpl.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Template Deep-Dive Card */}
              <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {selectedTemplate.badge}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        Model: {selectedTemplate.pineModel}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedTemplate.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      {selectedTemplate.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApplyTemplate(selectedTemplate)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span>Load into Trade Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Entry Price</span>
                    <span className="text-base font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedTemplate.data.entryPrice}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Stop Loss (Risk)</span>
                    <span className="text-base font-mono font-bold text-red-500">
                      {selectedTemplate.data.stopLossPrice} ({selectedTemplate.data.stopLossPips}p)
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Target (R:R)</span>
                    <span className="text-base font-mono font-bold text-emerald-500">
                      {selectedTemplate.data.takeProfitPrice} (1:{selectedTemplate.data.takeProfitRR}R)
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Result</span>
                    <span className={`text-base font-mono font-bold ${
                      (selectedTemplate.data.resultPips ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {(selectedTemplate.data.resultPips ?? 0) > 0 ? '+' : ''}{selectedTemplate.data.resultPips} pips ({selectedTemplate.data.resultStatus})
                    </span>
                  </div>
                </div>

                {/* Setup Summary */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Trade Context & Market Dynamics
                  </h5>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 leading-relaxed">
                    {selectedTemplate.setupSummary}
                  </p>
                </div>

                {/* Rules Checklist */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    FRVP Strategy Rules Checklist Passed
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTemplate.rulesPassed.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade Reflection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-indigo-50 dark:bg-indigo-500/5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      What I Did Well
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                      {selectedTemplate.data.didWell}
                    </p>
                  </div>
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-500/5 rounded-lg border border-amber-100 dark:border-amber-500/20 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      What I Would Change / Key Takeaway
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                      {selectedTemplate.data.wouldChange}
                    </p>
                  </div>
                </div>

                {/* Key Lesson */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                    <strong className="font-semibold">Golden Rule:</strong> {selectedTemplate.keyLesson}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE VISUAL DIAGRAM */}
          {activeTab === 'visualizer' && (
            <div className="space-y-6">
              {/* Model Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setVisualModel('sweep')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    visualModel === 'sweep'
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  ⚡ v6 Model 1: Sweep & Reclaim (Fast Reclaim)
                </button>
                <button
                  onClick={() => setVisualModel('choch')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    visualModel === 'choch'
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  🎯 v5 Model 2: CHoCH + BOS (Fractal Confirmation)
                </button>
                <button
                  onClick={() => setVisualModel('inverse')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    visualModel === 'inverse'
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  🔄 v7 Model 3: Inverse Trade (Level FLIP & Retest)
                </button>
              </div>

              {/* Visual Candlestick & Volume Profile Canvas / SVG Diagram */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 overflow-hidden relative shadow-inner">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-xs font-bold text-zinc-300 uppercase">
                      {visualModel === 'sweep' && 'Sweep & Reclaim Long Setup Visualizer'}
                      {visualModel === 'choch' && 'CHoCH + BOS Short Setup Visualizer (Williams 5-Bar)'}
                      {visualModel === 'inverse' && 'v7 Level FLIP -> Short INV Setup Visualizer'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500">
                    Session Profile + Pine Box Draw Engine
                  </span>
                </div>

                {/* SVG Architecture Diagram */}
                <div className="w-full h-80 sm:h-96 relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 800 360" fill="none">
                    {/* Grid lines */}
                    <line x1="40" y1="60" x2="760" y2="60" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="40" y1="120" x2="760" y2="120" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="40" y1="180" x2="760" y2="180" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="40" y1="240" x2="760" y2="240" stroke="#27272a" strokeDasharray="3 3" />
                    <line x1="40" y1="300" x2="760" y2="300" stroke="#27272a" strokeDasharray="3 3" />

                    {/* COMPLETED SESSION VOLUME PROFILE (Left Section 40-160px) */}
                    <rect x="40" y="40" width="130" height="280" fill="#18181b" rx="6" stroke="#27272a" />
                    <text x="50" y="58" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="bold">DAY -1 SESSION</text>
                    
                    {/* Horizontal Volume Profile Bars */}
                    <rect x="50" y="80" width="45" height="10" fill="#3f3f46" rx="2" />
                    <rect x="50" y="100" width="65" height="10" fill="#3f3f46" rx="2" />
                    <rect x="50" y="120" width="90" height="10" fill="#3f3f46" rx="2" />
                    <rect x="50" y="140" width="110" height="10" fill="#f59e0b" rx="2" opacity="0.9" /> {/* POC heavy node */}
                    <rect x="50" y="160" width="85" height="10" fill="#3f3f46" rx="2" />
                    <rect x="50" y="180" width="70" height="10" fill="#3f3f46" rx="2" />
                    <rect x="50" y="200" width="50" height="10" fill="#3f3f46" rx="2" />

                    {/* VAH, POC, VAL Extended Lines */}
                    {/* VAH */}
                    <line x1="170" y1="90" x2="760" y2="90" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="710" y="85" fill="#60a5fa" fontSize="10" fontFamily="monospace">VAH</text>

                    {/* POC - Focal Line */}
                    <line x1="170" y1="145" x2="760" y2="145" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="690" y="140" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">ACTIVE POC</text>

                    {/* VAL */}
                    <line x1="170" y1="210" x2="760" y2="210" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="710" y="225" fill="#60a5fa" fontSize="10" fontFamily="monospace">VAL</text>

                    {/* MODEL 1: SWEEP & RECLAIM (LONG) */}
                    {visualModel === 'sweep' && (
                      <g>
                        {/* Price moves away up >= 1.5x ATR */}
                        <path d="M 190 145 Q 240 70 290 65" fill="none" stroke="#10b981" strokeWidth="2.5" />
                        <rect x="230" y="45" width="125" height="18" fill="#064e3b" rx="4" />
                        <text x="236" y="58" fill="#34d399" fontSize="9" fontFamily="monospace">1. Move Away &gt;= 1.5 ATR</text>

                        {/* Price returns to POC */}
                        <path d="M 290 65 Q 350 70 390 145" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
                        <circle cx="390" cy="145" r="4" fill="#f59e0b" />
                        <text x="365" y="132" fill="#f59e0b" fontSize="9" fontFamily="monospace">2. Touch POC</text>

                        {/* Candlestick: Sweep down below POC */}
                        {/* Candle 1 (red drop) */}
                        <line x1="420" y1="130" x2="420" y2="175" stroke="#ef4444" strokeWidth="1.5" />
                        <rect x="415" y="140" width="10" height="25" fill="#ef4444" />

                        {/* Candle 2: Sweep Wick to extreme */}
                        <line x1="440" y1="140" x2="440" y2="195" stroke="#ef4444" strokeWidth="1.5" />
                        <rect x="435" y="148" width="10" height="15" fill="#ef4444" />
                        <text x="415" y="215" fill="#ef4444" fontSize="9" fontFamily="monospace">Sweep Wick Tip</text>

                        {/* Candle 3: Bullish RECLAIM close back above POC */}
                        <line x1="460" y1="125" x2="460" y2="170" stroke="#10b981" strokeWidth="2" />
                        <rect x="455" y="130" width="10" height="30" fill="#10b981" />
                        <circle cx="460" cy="130" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="475" y="125" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">3. Reclaim Close (ENTRY!)</text>

                        {/* Trade Boxes: Green TP1/TP2 and Red SL */}
                        {/* Red Stop Loss Box */}
                        <rect x="500" y="130" width="160" height="75" fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" rx="4" />
                        <text x="510" y="170" fill="#f87171" fontSize="10" fontFamily="monospace">SL Box: Below Sweep Tip</text>

                        {/* Green TP Box */}
                        <rect x="500" y="60" width="160" height="70" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.5" rx="4" />
                        <text x="510" y="95" fill="#34d399" fontSize="10" fontFamily="monospace">TP1 (1.5R) / TP2 (3.0R)</text>

                        {/* Rally Arrow */}
                        <path d="M 465 130 Q 550 90 640 65" fill="none" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
                      </g>
                    )}

                    {/* MODEL 2: CHOCH + BOS (SHORT) */}
                    {visualModel === 'choch' && (
                      <g>
                        {/* Price moves away below >= 1.5x ATR */}
                        <path d="M 190 145 Q 230 260 280 270" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                        <rect x="220" y="280" width="125" height="18" fill="#450a0a" rx="4" />
                        <text x="226" y="293" fill="#f87171" fontSize="9" fontFamily="monospace">1. Move Away &gt;= 1.5 ATR</text>

                        {/* Push up into POC */}
                        <path d="M 280 270 Q 340 240 380 145" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                        <text x="350" y="135" fill="#f59e0b" fontSize="9" fontFamily="monospace">2. Touch POC</text>

                        {/* Swing High Extreme */}
                        <circle cx="410" cy="135" r="4" fill="#f59e0b" />
                        <text x="390" y="120" fill="#a1a1aa" fontSize="9" fontFamily="monospace">Touch Extreme (19,865)</text>

                        {/* Fractal Low 1 (CHoCH trigger) */}
                        <line x1="410" y1="180" x2="490" y2="180" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                        <text x="430" y="175" fill="#f43f5e" fontSize="9" fontFamily="monospace">Fractal Low (CHoCH)</text>

                        {/* Next Fractal Low (BOS trigger) */}
                        <line x1="460" y1="210" x2="570" y2="210" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3 3" />
                        <text x="490" y="205" fill="#ec4899" fontSize="9" fontFamily="monospace">Fractal Low (BOS)</text>

                        {/* Candle breaking BOS */}
                        <line x1="530" y1="195" x2="530" y2="225" stroke="#ef4444" strokeWidth="2" />
                        <rect x="525" y="200" width="10" height="20" fill="#ef4444" />
                        <circle cx="530" cy="220" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="545" y="225" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">BOS Close (SHORT ENTRY)</text>

                        {/* Green Profit Target Box */}
                        <rect x="560" y="220" width="150" height="85" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.5" rx="4" />
                        <text x="570" y="260" fill="#34d399" fontSize="10" fontFamily="monospace">TP Box: Targets VAL</text>

                        {/* Red Stop Loss Box */}
                        <rect x="560" y="135" width="150" height="85" fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" rx="4" />
                        <text x="570" y="175" fill="#f87171" fontSize="10" fontFamily="monospace">SL: Beyond Touch Extreme</text>
                      </g>
                    )}

                    {/* MODEL 3: INVERSE TRADE (INV FLIP) */}
                    {visualModel === 'inverse' && (
                      <g>
                        {/* Price pushes right THROUGH POC */}
                        <path d="M 210 110 L 320 220" stroke="#ef4444" strokeWidth="3" />
                        <rect x="250" y="150" width="140" height="20" fill="#450a0a" rx="4" />
                        <text x="256" y="164" fill="#f87171" fontSize="9" fontFamily="monospace">Slices through (Level Flipped)</text>

                        {/* Closes beyond zone */}
                        <circle cx="340" cy="225" r="4" fill="#ef4444" />
                        <text x="310" y="245" fill="#a1a1aa" fontSize="9" fontFamily="monospace">N Closes Below VAL</text>

                        {/* Away & Return from Underneath */}
                        <path d="M 340 225 Q 400 270 440 210 Q 470 170 500 148" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                        <text x="430" y="135" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">Retest From Below</text>

                        {/* Candle rejecting under POC */}
                        <line x1="510" y1="140" x2="510" y2="180" stroke="#ef4444" strokeWidth="2" />
                        <rect x="505" y="150" width="10" height="25" fill="#ef4444" />
                        <circle cx="510" cy="175" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="525" y="175" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">SHORT INV Entry</text>

                        {/* Green Target Box */}
                        <rect x="560" y="175" width="150" height="90" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.5" rx="4" />
                        <text x="570" y="220" fill="#34d399" fontSize="10" fontFamily="monospace">TP1 (1.5R) / TP2 (3.0R)</text>

                        {/* Red Stop Box */}
                        <rect x="560" y="130" width="150" height="45" fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" rx="4" />
                        <text x="570" y="155" fill="#f87171" fontSize="10" fontFamily="monospace">SL: Beyond Retest Extreme</text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Explainer Cards for the Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2 text-amber-500 font-semibold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-xs">1</span>
                    Completed Session Level
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Every completed trading day calculates its Point of Control (POC) and Value Area (VAH/VAL). Active levels are kept up to N sessions until tested.
                  </p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2 text-indigo-500 font-semibold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs">2</span>
                    Move Away &amp; First Return
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Price must first expand at least <strong>1.5x ATR</strong> away from the POC. This ensures energy builds before price returns for its maiden retest.
                  </p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2 text-emerald-500 font-semibold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs">3</span>
                    Trigger &amp; Risk Box
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Enter immediately on the <strong>reclaim candle close</strong> or <strong>Williams 5-bar BOS</strong>. Pine Script automatically draws green/red risk boxes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGY RULES & LOGIC */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Levels & Active Memory */}
                <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    1. Levels &amp; Multi-Session Memory
                  </h4>
                  <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                    <li>Every completed session (daily bar) generates a Volume Profile node.</li>
                    <li>The Point of Control (POC), Value Area High (VAH), and Value Area Low (VAL) are drawn along the session’s range.</li>
                    <li>Levels remain <strong>ACTIVE</strong> on the chart for up to <strong>N sessions</strong> (default: 5) until price retests them.</li>
                    <li>Untouched &ldquo;Naked POCs&rdquo; act as institutional magnets across subsequent sessions.</li>
                  </ul>
                </div>

                {/* Entry Sequence */}
                <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    2. Entry Sequence On A Level
                  </h4>
                  <ol className="text-xs space-y-2 text-zinc-600 dark:text-zinc-300 list-decimal pl-4">
                    <li><strong>Move Away:</strong> Price moves away &ge; <code className="text-indigo-400">minAway x ATR</code> (default 1.5x).</li>
                    <li><strong>Maiden Return:</strong> Price comes back to the POC (first touch from that side).</li>
                    <li><strong>Visible Bounce:</strong> Price departs the touch extreme by &ge; <code className="text-indigo-400">minBounce x ATR</code> without pushing deep through the POC.</li>
                    <li><strong>Direction Rule:</strong> Came down from above &rarr; <span className="text-emerald-500 font-semibold">LONG</span>. Came up from below &rarr; <span className="text-red-500 font-semibold">SHORT</span>.</li>
                  </ol>
                </div>

                {/* Sweep & Reclaim Model */}
                <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    3. Sweep &amp; Reclaim Model (v6 Fast Trigger)
                  </h4>
                  <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                    <li>Fires <strong>1 to 3 candles</strong> after the POC touch without waiting for multi-bar fractals.</li>
                    <li>Enter on the first candle that <strong>CLOSES back through the level</strong> with strong momentum.</li>
                    <li>Stop Loss is placed just beyond the sweep tip (extreme since touch) + tick buffer.</li>
                    <li>Provides higher Risk-to-Reward and prevents chasing delayed breakouts.</li>
                  </ul>
                </div>

                {/* Inverse Trade (v7 FLIP) */}
                <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-red-500 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    4. Inverse Trade (v7 FLIP &amp; INV Tag)
                  </h4>
                  <ul className="text-xs space-y-2 text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                    <li>A level flips when price <strong>breaks through</strong> with <code className="text-red-400">N consecutive closes</code> beyond the zone.</li>
                    <li>Price moves away on the other side, then later returns to backtest the broken POC.</li>
                    <li>Enter in the <strong>opposite direction</strong>: Broke down &rarr; returned up &rarr; <span className="text-red-500 font-semibold">SHORT INV</span>.</li>
                    <li>Trades are automatically tagged &ldquo;Long INV&rdquo; and &ldquo;Short INV&rdquo; on the chart and in the strategy tester.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: PINE SCRIPT V6 CODE */}
          {activeTab === 'pinescript' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Pine Script v6 Production Source
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Ready to paste into TradingView Pine Editor (v6 compatible)
                  </p>
                </div>
                <button
                  onClick={handleCopyPine}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-sm transition-colors"
                >
                  {copiedPine ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPine ? 'Copied Code!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[420px] scrollbar-thin">
                <pre>{FRVP_PINE_SCRIPT_CODE}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Pine Script v6 Syntax Checked • Auto Risk-Box Calculations • Multi-Asset Compatible</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-1 sm:flex-none"
            >
              Close
            </button>
            <button
              onClick={() => handleApplyTemplate(selectedTemplate)}
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg shadow-sm transition-colors flex-1 sm:flex-none flex items-center justify-center gap-1.5"
            >
              <span>Apply &amp; Journal Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
