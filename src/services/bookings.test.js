import { describe, it, expect, vi, beforeEach } from 'vitest';
import { doc, getDocs, updateDoc, where } from 'firebase/firestore';
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getAllContacts,
  getBookingsForCar,
  getUserBookings,
  setBookingStatus,
} from './bookings';

const batch = vi.hoisted(() => ({ set: vi.fn(), commit: vi.fn() }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((_db, name) => `${name}-ref`),
  doc: vi.fn(() => ({ id: 'new-id' })),
  getDocs: vi.fn(),
  query: vi.fn((...args) => args),
  serverTimestamp: vi.fn(() => 'now'),
  updateDoc: vi.fn(),
  where: vi.fn((...args) => args),
  writeBatch: vi.fn(() => batch),
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

  it('gets all bookings', async () => {
    getDocs.mockResolvedValue(snapshot);
    expect(await getAllBookings()).toEqual([
      { id: 'b1', carId: 'c1', status: 'confirmed' },
    ]);
  });

  it('creates the booking and its private contact record together', async () => {
    batch.commit.mockResolvedValue();
    const id = await createBooking(
      { carId: 'c1', userId: 'u1' },
      { phone: '+254712345678', notes: 'Airport pickup' }
    );
    expect(id).toBe('new-id');
    expect(batch.set).toHaveBeenCalledTimes(2);
    expect(batch.set).toHaveBeenNthCalledWith(
      1,
      { id: 'new-id' },
      { carId: 'c1', userId: 'u1', status: 'confirmed', createdAt: 'now' }
    );
    expect(batch.set).toHaveBeenNthCalledWith(
      2,
      { id: 'new-id' },
      { userId: 'u1', phone: '+254712345678', notes: 'Airport pickup', createdAt: 'now' }
    );
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it('saves empty notes when none are given', async () => {
    batch.commit.mockResolvedValue();
    await createBooking({ carId: 'c1', userId: 'u1' }, { phone: '+254712345678' });
    expect(batch.set).toHaveBeenNthCalledWith(
      2,
      { id: 'new-id' },
      expect.objectContaining({ notes: '' })
    );
  });

  it('cancels a booking by setting its status', async () => {
    await cancelBooking('b1');
    expect(doc).toHaveBeenCalledWith({}, 'bookings', 'b1');
    expect(updateDoc).toHaveBeenCalledWith({ id: 'new-id' }, { status: 'cancelled' });
  });

  it('sets any booking status', async () => {
    await setBookingStatus('b1', 'confirmed');
    expect(updateDoc).toHaveBeenCalledWith({ id: 'new-id' }, { status: 'confirmed' });
  });

  it('gets all contacts keyed by booking id', async () => {
    getDocs.mockResolvedValue({
      docs: [{ id: 'b1', data: () => ({ phone: '+254712345678', notes: '' }) }],
    });
    expect(await getAllContacts()).toEqual({ b1: { phone: '+254712345678', notes: '' } });
  });
});