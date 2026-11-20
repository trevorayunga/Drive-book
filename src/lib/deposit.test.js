import { describe, it, expect } from 'vitest';
import { DEPOSIT_PERCENT, calculateDeposit } from './deposit';

describe('calculateDeposit', () => {
  it('uses the default percentage', () => {
    expect(DEPOSIT_PERCENT).toBe(30);
    expect(calculateDeposit(13500)).toBe(4050);
  });

  it('accepts a custom percentage', () => {
    expect(calculateDeposit(5000, 10)).toBe(500);
  });

  it('rounds to whole shillings', () => {
    expect(calculateDeposit(1001)).toBe(300);
  });
});