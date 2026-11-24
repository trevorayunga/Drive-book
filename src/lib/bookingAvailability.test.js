import { describe, it, expect } from 'vitest';
import { findConflict, getBookedRanges } from './bookingLogic';

const bookings = [
  { carId: 'a', startDate: '2099-01-10', endDate: '2099-01-13', status: 'confirmed' },
  { carId: 'a', startDate: '2099-02-01', endDate: '2099-02-03', status: 'cancelled' },
  { carId: 'a', startDate: '2000-01-01', endDate: '2000-01-05', status: 'confirmed' },
  { carId: 'b', startDate: '2099-01-10', endDate: '2099-01-13', status: 'confirmed' },
  { carId: 'a', startDate: '2098-12-01', endDate: '2098-12-05', status: 'confirmed' },
];

describe('findConflict', () => {
  it('returns the booking that overlaps the dates', () => {
    expect(findConflict('a', '2099-01-12', '2099-01-15', bookings)).toBe(bookings[0]);
  });

  it('returns null when the dates are free', () => {
    expect(findConflict('a', '2099-01-13', '2099-01-15', bookings)).toBeNull();
  });

  it('ignores cancelled bookings and other cars', () => {
    expect(findConflict('a', '2099-02-01', '2099-02-03', bookings)).toBeNull();
    expect(findConflict('c', '2099-01-10', '2099-01-13', bookings)).toBeNull();
  });
});

describe('getBookedRanges', () => {
  it('lists upcoming active bookings of the car, earliest first', () => {
    expect(getBookedRanges('a', bookings, '2026-11-23')).toEqual([
      { startDate: '2098-12-01', endDate: '2098-12-05' },
      { startDate: '2099-01-10', endDate: '2099-01-13' },
    ]);
  });

  it('uses today by default and skips past bookings', () => {
    expect(getBookedRanges('a', bookings)).toHaveLength(2);
  });
});