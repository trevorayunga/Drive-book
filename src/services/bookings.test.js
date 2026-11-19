import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, getDocs, updateDoc, where } from 'firebase/firestore';
import {
  cancelBooking,
  createBooking,
  getBookingsForCar,
  getUserBookings,
} from './bookings';

vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(() => 'bookings-ref'),
  doc: vi.fn(() => 'booking-ref'),
  getDocs: vi.fn(),
  query: vi.fn((...args) => args),
  serverTimestamp: vi.fn(() => 'now'),
  updateDoc: vi.fn(),
  where: vi.fn((...args) => args),
}));
vi.mock('../firebase', () => ({ db: {} }));

const snapshot = {
  docs: [{ id: 'b1', data: () => ({ carId: 'c1', status: 'confirmed' }) }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('bookings service', () => {
  it('gets bookings for a car', async () => {
    getDocs.mockResolvedValue(snapshot);
    expect(await getBookingsForCar('c1')).toEqual([
      { id: 'b1', carId: 'c1', status: 'confirmed' },
    ]);
    expect(where).toHaveBeenCalledWith('carId', '==', 'c1');
  });

  it('gets bookings for a user', async () => {
    getDocs.mockResolvedValue(snapshot);
    await getUserBookings('u1');
    expect(where).toHaveBeenCalledWith('userId', '==', 'u1');
  });

  it('creates a confirmed booking and returns its id', async () => {
    addDoc.mockResolvedValue({ id: 'new-id' });
    const id = await createBooking({ carId: 'c1', userId: 'u1' });
    expect(id).toBe('new-id');
    expect(addDoc).toHaveBeenCalledWith('bookings-ref', {
      carId: 'c1',
      userId: 'u1',
      status: 'confirmed',
      createdAt: 'now',
    });
  });

  it('cancels a booking by setting its status', async () => {
    await cancelBooking('b1');
    expect(updateDoc).toHaveBeenCalledWith('booking-ref', { status: 'cancelled' });
  });
});