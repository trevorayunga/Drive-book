import { describe, it, expect, vi } from 'vitest';
import { getDoc, getDocs } from 'firebase/firestore';
import { getCar, getCars } from './cars';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'cars-ref'),
  doc: vi.fn(() => 'car-ref'),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
}));
vi.mock('../firebase', () => ({ db: {} }));

describe('getCars', () => {
  it('returns cars with their document ids', async () => {
    getDocs.mockResolvedValue({
      docs: [{ id: 'c1', data: () => ({ make: 'Toyota', model: 'Vitz' }) }],
    });
    expect(await getCars()).toEqual([{ id: 'c1', make: 'Toyota', model: 'Vitz' }]);
  });
});

describe('getCar', () => {
  it('returns a car with its id when it exists', async () => {
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
});