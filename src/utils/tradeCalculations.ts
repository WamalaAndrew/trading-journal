export function calculateTradeFields(
  name: string,
  value: any,
  currentData: any
) {
  const next = { ...currentData, [name]: value };

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
        // user manually typed SL pips
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
        
        if (!currentData.resultStatus || currentData.resultStatus === 'Open/Pending') {
          if (profit > 0) next.resultStatus = 'Win';
          else if (profit < 0) next.resultStatus = 'Loss';
          else next.resultStatus = 'Breakeven';
        }
    }
  }

  return next;
}
