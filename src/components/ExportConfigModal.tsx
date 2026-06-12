import React, { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { PDFExportOptions } from '../exportUtils';

interface ExportConfigModalProps {
  onClose: () => void;
  onExport: (options: PDFExportOptions) => void;
}

export function ExportConfigModal({ onClose, onExport }: ExportConfigModalProps) {
  const [options, setOptions] = useState<PDFExportOptions>({
    includeSummary: true,
    includeTrades: true,
    includeCharts: false
  });

  const handleExport = () => {
    onExport(options);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            PDF Export Configuration
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Select the sections you want to include in the generated PDF report.
          </p>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={options.includeSummary}
              onChange={(e) => setOptions({ ...options, includeSummary: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Performance Summary</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">High-level overview of win rate and net pips.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={options.includeCharts}
              onChange={(e) => setOptions({ ...options, includeCharts: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Performance Charts</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Visual charts and insights snapshot.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={options.includeTrades}
              onChange={(e) => setOptions({ ...options, includeTrades: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Individual Trades</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Detailed list of your trades in a table.</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3 p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!options.includeSummary && !options.includeCharts && !options.includeTrades}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}
