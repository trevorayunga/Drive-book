import { describe, it, expect } from 'vitest';
import { calculateStats } from './stats';

describe('calculateStats', () => {
  it('counts cars and bookings and sums revenue for paid bookings only', () => {
    const cars = [{ id: 'c1' }, { id: 'c2' }];
    const bookings = [
      { status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-20', totalPrice: 9000 },
      { status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-21', totalPrice: 6000 },
      { status: 'confirmed', paymentStatus: 'unpaid', totalPrice: 12000 },
      { status: 'cancelled', paymentStatus: 'paid', paidDate: '2026-11-21', totalPrice: 45000 },
    ];
    expect(calculateStats(cars, bookings)).toEqual({
      totalCars: 2,
      totalBookings: 4,
      activeBookings: 3,
      cancelledBookings: 1,
      revenue: 15000,
    });
  });

  it('returns zeros when there is no data', () => {
    expect(calculateStats([], [])).toEqual({
      totalCars: 0,
      totalBookings: 0,
      activeBookings: 0,
      cancelledBookings: 0,
      revenue: 0,
    });
  });
});