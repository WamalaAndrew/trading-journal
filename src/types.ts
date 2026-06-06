export type MACDDirection = 'Bullish' | 'Bearish' | 'Mixed';
export type CrossoverType = 'Above zero' | 'Below zero';
export type ExitReason = 'Hit TP' | 'Hit SL' | 'MACD cross' | 'RSI' | 'Manual' | 'Other';
export type ResultStatus = 'Win' | 'Loss' | 'Breakeven' | 'Open/Pending';

export interface Trade {
  id: string;
  dateTime: string;
  pair: string;
  timeframe: string;
  macd4hDirection: MACDDirection;
  macd1hCrossover: CrossoverType;
  rsiAtEntry: number;
  entryPrice: number;
  stopLossPrice: number;
  stopLossPips: number;
  takeProfitPrice: number;
  takeProfitRR: number;
  exitPrice?: number;
  exitReason?: ExitReason;
  resultStatus: ResultStatus;
  resultPips?: number;
  didWell: string;
  wouldChange: string;
  notes?: string;
  strategyTags?: string[];
}

