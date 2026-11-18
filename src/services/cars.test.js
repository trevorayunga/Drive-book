import { describe, it, expect, vi } from 'vitest';
import { getDocs } from 'firebase/firestore';
import { getCars } from './cars';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'cars-ref'),
  getDocs: vi.fn(),
}));
vi.mock('../firebase', () => ({ db: {} }));

describe('getCars', () => {
  it('returns cars with their document ids', async () => {
    getDocs.mockResolvedValue({
      docs: [{ id: 'c1', data: () => ({ make: 'Toyota', model: 'Vitz' }) }],
    });
    const cars = await getCars();
    expect(cars).toEqual([{ id: 'c1', make: 'Toyota', model: 'Vitz' }]);
  });
});