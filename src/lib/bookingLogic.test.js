import { describe, it, expect } from 'vitest';
import {
  addDays,
  daysBetween,
  validateDates,
  rangesOverlap,
  isAvailable,
  calculatePrice,
} from './bookingLogic';

describe('date helpers', () => {
  it('adds days across month boundaries', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
  });
  it('counts days between dates', () => {
    expect(daysBetween('2026-12-01', '2026-12-04')).toBe(3);
  });
});

describe('validateDates', () => {
  const today = '2026-11-18';
  it('requires both dates', () => {
    expect(validateDates('', '2026-12-01', today)).toMatch(/both/);
  });
  it('rejects a pickup in the past', () => {
    expect(validateDates('2026-11-01', '2026-11-20', today)).toMatch(/past/);
  });
  it('rejects a return on or before pickup', () => {
    expect(validateDates('2026-12-01', '2026-12-01', today)).toMatch(/after/);
  });
  it('accepts a valid range', () => {
    expect(validateDates('2026-12-01', '2026-12-05', today)).toBeNull();
  });
  it('uses the current date when none is given', () => {
    expect(validateDates('2000-01-01', '2000-01-05')).toMatch(/past/);
  });
});

describe('availability', () => {
  const bookings = [
    { carId: 'a', startDate: '2026-12-10', endDate: '2026-12-15', status: 'confirmed' },
    { carId: 'b', startDate: '2026-12-10', endDate: '2026-12-15', status: 'cancelled' },
  ];
  it('detects overlap', () => {
    expect(rangesOverlap('2026-12-12', '2026-12-18', '2026-12-10', '2026-12-15')).toBe(true);
  });
  it('allows back-to-back bookings', () => {
    expect(rangesOverlap('2026-12-15', '2026-12-18', '2026-12-10', '2026-12-15')).toBe(false);
  });
  it('blocks a car that is already booked', () => {
    expect(isAvailable('a', '2026-12-12', '2026-12-14', bookings)).toBe(false);
  });
  it('ignores cancelled bookings', () => {
    expect(isAvailable('b', '2026-12-12', '2026-12-14', bookings)).toBe(true);
  });
  it('ignores bookings of other cars', () => {
    expect(isAvailable('c', '2026-12-12', '2026-12-14', bookings)).toBe(true);
  });
});

describe('calculatePrice', () => {
  it('multiplies days by the daily rate', () => {
    expect(calculatePrice(5000, '2026-12-01', '2026-12-04')).toBe(15000);
  });
  it('adds a surcharge for holiday days', () => {
    expect(calculatePrice(5000, '2026-12-11', '2026-12-13', ['2026-12-12'])).toBe(11000);
  });
});