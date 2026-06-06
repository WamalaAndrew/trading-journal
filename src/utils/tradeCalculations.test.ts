import { describe, it, expect } from 'vitest';
import { calculateTradeFields } from './tradeCalculations';

describe('calculateTradeFields', () => {
  it('should update the target field', () => {
    const prev = { entryPrice: 1.1000 };
    const next = calculateTradeFields('pair', 'EURUSD', prev);
    expect(next.pair).toBe('EURUSD');
    expect(next.entryPrice).toBe(1.1000);
  });

  it('should auto compute stopLossPips given SL and Entry for JPY pair', () => {
    const prev = { entryPrice: 150.00, pair: 'USDJPY' };
    const next = calculateTradeFields('stopLossPrice', 149.50, prev);
    expect(next.stopLossPrice).toBe(149.50);
    expect(next.stopLossPips).toBe(50); // (150 - 149.5) * 100 = 50
  });

  it('should auto compute stopLossPips for normal pairs', () => {
    const prev = { entryPrice: 1.1000, pair: 'EURUSD' };
    const next = calculateTradeFields('stopLossPrice', 1.0950, prev);
    expect(next.stopLossPips).toBe(50); // (1.1 - 1.095) * 10000 = 50
  });

  it('should compute takeProfitRR', () => {
    const prev = { entryPrice: 1.1000, pair: 'EURUSD', stopLossPrice: 1.0950 }; // SL distance 50
    const next = calculateTradeFields('takeProfitPrice', 1.1100, prev); // TP distance 100
    expect(next.takeProfitRR).toBe(2); 
  });

  it('should compute resultPips and resultStatus if it hits TP (Win)', () => {
    const prev = { entryPrice: 1.1000, pair: 'EURUSD', stopLossPrice: 1.0950, takeProfitPrice: 1.1100, resultStatus: 'Open/Pending' };
    const next = calculateTradeFields('exitPrice', 1.1100, prev);
    expect(next.resultPips).toBe(100); 
    expect(next.resultStatus).toBe('Win');
  });

  it('should compute resultPips and resultStatus if it hits SL (Loss)', () => {
    const prev = { entryPrice: 1.1000, pair: 'EURUSD', stopLossPrice: 1.0950, takeProfitPrice: 1.1100, resultStatus: 'Open/Pending' };
    const next = calculateTradeFields('exitPrice', 1.0950, prev);
    expect(next.resultPips).toBe(-50); 
    expect(next.resultStatus).toBe('Loss');
  });
});
