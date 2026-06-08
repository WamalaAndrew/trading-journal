import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, X, ArrowRight, Check, AlertCircle, Trash2 } from 'lucide-react';
import { Trade } from '../types';

interface ImportWizardProps {
  onImport: (trades: any[]) => Promise<void>;
  onClose: () => void;
}

type Step = 'upload' | 'mapping' | 'preview' | 'importing';

const TRADE_FIELDS = [
  { key: 'dateTime', label: 'Date/Time (YYYY-MM-DDTHH:mm)', type: 'string' },
  { key: 'pair', label: 'Pair/Symbol', type: 'string' },
  { key: 'entryPrice', label: 'Entry Price', type: 'number' },
  { key: 'stopLossPrice', label: 'Stop Loss Price', type: 'number' },
  { key: 'takeProfitPrice', label: 'Take Profit Price', type: 'number' },
  { key: 'resultStatus', label: 'Result (Win/Loss/Breakeven)', type: 'string' },
  { key: 'resultPips', label: 'Net Pips / Profit', type: 'number' },
  { key: 'notes', label: 'Notes', type: 'string' }
];

export function ImportWizard({ onImport, onClose }: ImportWizardProps) {
  const [step, setStep] = useState<Step>('upload');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [parsedTrades, setParsedTrades] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setCsvHeaders(results.meta.fields);
          setCsvData(results.data);
          
          // Auto-map where possible
          const initialMapping: Record<string, string> = {};
          TRADE_FIELDS.forEach(field => {
            const match = results.meta.fields!.find(h => 
              h.toLowerCase().includes(field.key.toLowerCase()) || 
              h.toLowerCase().includes(field.label.split(' ')[0].toLowerCase())
            );
            if (match) initialMapping[field.key] = match;
          });
          setMapping(initialMapping);
          setStep('mapping');
        }
      }
    });
  };

  const handleMappingSubmit = () => {
    const tradesToImport = csvData.map(row => {
      const trade: any = {
        timeframe: 'Custom',
        macd4hDirection: 'Neutral',
        macd1hCrossover: 'None',
        rsiAtEntry: 50,
      };
      
      TRADE_FIELDS.forEach(field => {
        const csvCol = mapping[field.key];
        if (csvCol && row[csvCol] !== undefined && row[csvCol] !== '') {
          let val: any = row[csvCol];
          if (field.type === 'number') {
            val = parseFloat(val);
            if (isNaN(val)) val = 0;
          }
          trade[field.key] = val;
        }
      });
      
      // Defaults to avoid firebase errors
      if (!trade.dateTime) trade.dateTime = new Date().toISOString().slice(0, 16);
      if (!trade.pair) trade.pair = 'Unknown';
      if (!trade.resultStatus) trade.resultStatus = 'Open/Pending';
      
      return trade;
    });
    
    setParsedTrades(tradesToImport);
    setStep('preview');
  };

  const handleImport = async () => {
    setIsProcessing(true);
    try {
      await onImport(parsedTrades);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-mono text-zinc-900 dark:text-zinc-100">Import CSV Data</h2>
            <p className="text-sm text-zinc-500">Upload your broker or journal history</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          {step === 'upload' && (
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
              <p className="text-zinc-500 text-sm mb-6">Select a comma-separated values file exported from your broker</p>
              <label className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors font-medium">
                Choose File
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          )}

          {step === 'mapping' && (
            <div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-4 rounded-xl mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">We've attempted to auto-map your columns. Please review and adjust the mapping to ensure your data imports correctly into AlphaLog.</p>
              </div>

              <div className="space-y-4">
                {TRADE_FIELDS.map(field => (
                  <div key={field.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                    <div className="w-full sm:w-1/2">
                      <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{field.label}</p>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <select 
                        value={mapping[field.key] || ''}
                        onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- Ignore this field --</option>
                        {csvHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setStep('upload')} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium">Back</button>
                <button onClick={handleMappingSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700">Preview Data <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Previewing {parsedTrades.length} trades. Please confirm before importing.</p>
              
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase bg-white dark:bg-zinc-900 sticky top-0 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Pair</th>
                      <th className="px-4 py-3">Entry</th>
                      <th className="px-4 py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTrades.slice(0, 10).map((t, i) => (
                      <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-100 dark:hover:bg-zinc-900/50">
                        <td className="px-4 py-3 whitespace-nowrap">{t.dateTime}</td>
                        <td className="px-4 py-3 font-medium">{t.pair}</td>
                        <td className="px-4 py-3">{t.entryPrice || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${t.resultStatus === 'Win' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : t.resultStatus === 'Loss' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                            {t.resultStatus || 'Unknown'} {t.resultPips ? `(${t.resultPips}p)` : ''}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedTrades.length > 10 && (
                <p className="text-xs text-center mt-3 text-zinc-500">Showing first 10 rows only.</p>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setStep('mapping')} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium" disabled={isProcessing}>Back</button>
                <button 
                  onClick={handleImport} 
                  disabled={isProcessing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Importing...' : 'Confirm Import'}
                  {!isProcessing && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
