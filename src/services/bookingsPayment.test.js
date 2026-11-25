import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateDoc } from 'firebase/firestore';
import { markBookingPaid, markBookingUnpaid } from './bookings';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(() => 'booking-ref'),
  getDocs: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn(),
  writeBatch: vi.fn(),
}));
vi.mock('../firebase', () => ({ db: {} }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('booking payment', () => {
  it('marks a booking as paid on a date', async () => {
    await markBookingPaid('b1', '2026-11-22');
    expect(updateDoc).toHaveBeenCalledWith('booking-ref', {
      paymentStatus: 'paid',
      paidDate: '2026-11-22',
    });
  });

  it('undoes a payment', async () => {
    await markBookingUnpaid('b1');
    expect(updateDoc).toHaveBeenCalledWith('booking-ref', {
      paymentStatus: 'unpaid',
      paidDate: null,
    });
  });
});