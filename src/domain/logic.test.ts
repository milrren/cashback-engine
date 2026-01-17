import { describe, it, expect } from 'vitest';
import { calculateCashback, calculateSafeBalanceDeduction } from './logic';

describe('Cashback Calculation Logic', () => {
  it('should apply 5% for STANDARD tier', () => {
    const result = calculateCashback(100, 'STANDARD');
    expect(result).toBe(5.00);
  });

  it('should apply 10% for VIP tier', () => {
    const result = calculateCashback(100, 'VIP');
    expect(result).toBe(10.00);
  });

  it('should handle decimal values correctly', () => {
    const result = calculateCashback(99.99, 'VIP');
    expect(result).toBe(10.00); // Rounded to 2 decimals
  });
});

describe('Zero-Balance Floor Rule', () => {
  it('should subtract correctly when balance is sufficient', () => {
    const result = calculateSafeBalanceDeduction(50, 20);
    expect(result).toBe(30);
  });

  it('should return 0 when deduction exceeds balance', () => {
    const result = calculateSafeBalanceDeduction(10, 20);
    expect(result).toBe(0);
  });

  it('should return 0 when balance is already 0', () => {
    const result = calculateSafeBalanceDeduction(0, 10);
    expect(result).toBe(0);
  });
});
