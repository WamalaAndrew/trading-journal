export function getActualPips(trade: { resultPips?: number | string | null, resultStatus?: string }): number {
  if (trade.resultPips === undefined || trade.resultPips === null) return 0;
  let pips = Number(trade.resultPips);
  if (isNaN(pips)) return 0;
  
  if (trade.resultStatus === 'Loss' && pips > 0) return -pips;
  if (trade.resultStatus === 'Win' && pips < 0) return Math.abs(pips);
  if (trade.resultStatus === 'Breakeven') return 0;
  
  return pips;
}

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
    let mult = 10000;
    const p = pair.toUpperCase().replace(/[^A-Z]/g, '');
    if (p.includes('JPY')) mult = 100;
    else if (p.includes('XAU') || p.includes('GOLD')) mult = 10;
    else if (p.includes('XAG') || p.includes('SILVER')) mult = 10;
    else if (p.includes('BTC') || p.includes('ETH')) mult = 1;
    else if (['US30', 'NAS100', 'US100', 'SPX500', 'GER30', 'UK100', 'DOW', 'NDX'].some(i => p.includes(i))) mult = 1;

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
        
        if (!currentData.resultStatus || currentData.resultStatus === 'Open/Pending' || name === 'exitPrice') {
          if (profit > 0) next.resultStatus = 'Win';
          else if (profit < 0) next.resultStatus = 'Loss';
          else next.resultStatus = 'Breakeven';
        }
    }
  }

  // Enforce correct sign on resultPips based on resultStatus, or vice versa if user types pips manually
  if (next.resultPips !== undefined && !isNaN(Number(next.resultPips))) {
    if (name === 'resultPips') {
        if (next.resultPips > 0) next.resultStatus = 'Win';
        else if (next.resultPips < 0) next.resultStatus = 'Loss';
        else next.resultStatus = 'Breakeven';
    } else {
        if (next.resultStatus === 'Loss' && next.resultPips > 0) {
            next.resultPips = -next.resultPips;
        } else if (next.resultStatus === 'Win' && next.resultPips < 0) {
            next.resultPips = Math.abs(next.resultPips);
        } else if (next.resultStatus === 'Breakeven') {
            next.resultPips = 0;
        }
    }
  }

  return next;
}

