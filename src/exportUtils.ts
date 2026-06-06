import { Trade } from './types';

export function exportToCSV(trades: Trade[]) {
  const headers = [
    'Date & Time',
    'Pair',
    'Timeframe',
    '4H MACD',
    '1H Crossover',
    'RSI',
    'Entry Price',
    'Stop Loss',
    'SL Pips',
    'Take Profit',
    'R:R',
    'Status',
    'Exit Price',
    'Exit Reason',
    'Result Pips',
    'Did Well',
    'Would Change'
  ];

  const rows = trades.map(t => [
    t.dateTime,
    t.pair,
    t.timeframe,
    t.macd4hDirection,
    t.macd1hCrossover,
    t.rsiAtEntry,
    t.entryPrice,
    t.stopLossPrice,
    t.stopLossPips,
    t.takeProfitPrice,
    t.takeProfitRR,
    t.resultStatus,
    t.exitPrice || '',
    t.exitReason || '',
    t.resultPips || '',
    `"${t.didWell ? t.didWell.replace(/"/g, '""') : ''}"`,
    `"${t.wouldChange ? t.wouldChange.replace(/"/g, '""') : ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `trade_journal_export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
