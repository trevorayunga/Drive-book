import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, deleteDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { addCar, deleteCar, getCar, getCars, updateCar } from './cars';

vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(() => 'cars-ref'),
  deleteDoc: vi.fn(),
  doc: vi.fn(() => 'car-ref'),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
}));
vi.mock('../firebase', () => ({ db: {} }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('cars service', () => {
  it('gets cars with their document ids', async () => {
    getDocs.mockResolvedValue({
      docs: [{ id: 'c1', data: () => ({ make: 'Toyota', model: 'Vitz' }) }],
    });
    expect(await getCars()).toEqual([{ id: 'c1', make: 'Toyota', model: 'Vitz' }]);
  });

  it('gets one car when it exists', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      id: 'c1',
      data: () => ({ make: 'Toyota' }),
    });
    expect(await getCar('c1')).toEqual({ id: 'c1', make: 'Toyota' });
  });

  it('returns null when the car does not exist', async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    expect(await getCar('missing')).toBeNull();
  });

  it('adds a car and returns its id', async () => {
    addDoc.mockResolvedValue({ id: 'new-id' });
    const data = { make: 'Toyota', model: 'Axio' };
    expect(await addCar(data)).toBe('new-id');
    expect(addDoc).toHaveBeenCalledWith('cars-ref', data);
  });

  it('updates a car', async () => {
    const data = { pricePerDay: 5000 };
    await updateCar('c1', data);
    expect(updateDoc).toHaveBeenCalledWith('car-ref', data);
  });

  it('deletes a car', async () => {
    await deleteCar('c1');
    expect(deleteDoc).toHaveBeenCalledWith('car-ref');
  });
});