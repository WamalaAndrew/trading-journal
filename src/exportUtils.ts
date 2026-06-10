import { Trade } from './types';
import { getActualPips } from './utils/tradeCalculations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToCSV(trades: Trade[]) {
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.resultStatus === 'Win').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : '0.0';
  const totalPips = trades.reduce((acc, t) => acc + getActualPips(t), 0).toFixed(2);

  const reportHeader = [
    ['AlphaLog Trading Report'],
    [`Generated: ${new Date().toLocaleString()}`],
    ['----------------------------------------'],
    ['Account Summary'],
    [`Total Trades: ${totalTrades}`],
    [`Win Rate: ${winRate}%`],
    [`Net Pips: ${totalPips}`],
    ['----------------------------------------'],
    []
  ];

  const dataHeaders = [
    'Date & Time',
    'Pair',
    'Strategy',
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
    'Result Pips',
    'Notes',
    'Did Well',
    'Would Change'
  ];

  const rows = trades.map(t => [
    t.dateTime,
    t.pair,
    (t.strategyTags || []).join(';') || 'N/A',
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
    t.exitPrice !== undefined ? t.exitPrice : '',
    t.resultPips !== undefined ? getActualPips(t) : '',
    `"${t.notes ? t.notes.replace(/"/g, '""') : ''}"`,
    `"${t.didWell ? t.didWell.replace(/"/g, '""') : ''}"`,
    `"${t.wouldChange ? t.wouldChange.replace(/"/g, '""') : ''}"`
  ]);

  const csvContent = [
    ...reportHeader.map(r => r.join(',')),
    dataHeaders.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `alphalog_trade_report_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(trades: Trade[]) {
  const doc = new jsPDF('landscape');
  
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.resultStatus === 'Win').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : '0.0';
  const totalPips = trades.reduce((acc, t) => acc + getActualPips(t), 0).toFixed(2);

  // Styling and Logo Mock
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text("ALPHALOG", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(113, 113, 122); // Zinc 500
  doc.setFont('helvetica', 'normal');
  doc.text("Professional Trading Journal Report", 14, 32);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

  // Performance Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(39, 39, 42); // Zinc 800
  doc.text("Overview", 14, 52);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(63, 63, 70);
  doc.text(`Total Trades: ${totalTrades}`, 14, 60);
  doc.text(`Win Rate: ${winRate}%`, 60, 60);
  
  const pipsColor = Number(totalPips) >= 0 ? [16, 185, 129] : [239, 68, 68];
  doc.text('Net Pips: ', 110, 60);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(pipsColor[0], pipsColor[1], pipsColor[2]);
  doc.text(`${totalPips}`, 128, 60);

  // Table
  const tableColumn = ["Date", "Pair", "Strategy", "Status", "R:R", "Result Pips"];
  const tableRows = [];

  trades.forEach(t => {
    const tradeData = [
      new Date(t.dateTime).toLocaleDateString(),
      t.pair,
      (t.strategyTags || []).join(', ') || 'N/A',
      t.resultStatus || 'Open',
      t.takeProfitRR ? `1:${t.takeProfitRR}` : 'N/A',
      t.resultPips !== undefined && t.resultPips !== null ? `${getActualPips(t)}` : '-'
    ];
    tableRows.push(tradeData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 70,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 4 },
    willDrawCell: function(data) {
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'Win') {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'Loss') {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        }
      }
      if (data.section === 'body' && data.column.index === 5) {
        const val = Number(data.cell.raw);
        if (!isNaN(val)) {
          if (val > 0) {
            data.cell.styles.textColor = [16, 185, 129];
          } else if (val < 0) {
            data.cell.styles.textColor = [239, 68, 68];
          }
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  doc.save(`alphalog_performance_report_${new Date().toISOString().slice(0, 10)}.pdf`);
}