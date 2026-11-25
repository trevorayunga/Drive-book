import { describe, it, expect } from 'vitest';
import { isPaid, revenueByDay, todayLocal, totalRevenue } from './revenue';

const bookings = [
  { status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-20', totalPrice: 9000 },
  { status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-20', totalPrice: 6000 },
  { status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-22', totalPrice: 10000 },
  { status: 'confirmed', paymentStatus: 'unpaid', totalPrice: 12000 },
  { status: 'cancelled', paymentStatus: 'paid', paidDate: '2026-11-21', totalPrice: 45000 },
  { status: 'confirmed', paymentStatus: 'paid', totalPrice: 3000 },
];

describe('isPaid', () => {
  it('is true only for confirmed bookings marked paid with a date', () => {
    expect(isPaid(bookings[0])).toBe(true);
    expect(isPaid(bookings[3])).toBe(false);
    expect(isPaid(bookings[4])).toBe(false);
    expect(isPaid(bookings[5])).toBe(false);
  });
});

describe('revenueByDay', () => {
  it('groups paid bookings by payment day, oldest first', () => {
    expect(revenueByDay(bookings)).toEqual([
      { date: '2026-11-20', count: 2, amount: 15000 },
      { date: '2026-11-22', count: 1, amount: 10000 },
    ]);
  });

  it('filters by a start date', () => {
    expect(revenueByDay(bookings, '2026-11-21')).toEqual([
      { date: '2026-11-22', count: 1, amount: 10000 },
    ]);
  });

  it('filters by an end date', () => {
    expect(revenueByDay(bookings, '', '2026-11-20')).toEqual([
      { date: '2026-11-20', count: 2, amount: 15000 },
    ]);
  });

  it('filters by a date range', () => {
    expect(revenueByDay(bookings, '2026-11-21', '2026-11-21')).toEqual([]);
  });
});

describe('totalRevenue', () => {
  it('adds up the daily amounts', () => {
    expect(totalRevenue(revenueByDay(bookings))).toBe(25000);
    expect(totalRevenue([])).toBe(0);
  });
});

describe('todayLocal', () => {
  it('returns a YYYY-MM-DD date', () => {
    expect(todayLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});