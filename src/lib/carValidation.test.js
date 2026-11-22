import { describe, it, expect } from 'vitest';
import { validateCar } from './carValidation';

const valid = {
  make: 'Toyota',
  model: 'Corolla',
  year: '2020',
  type: 'Sedan',
  pricePerDay: '4500',
  seats: '5',
  description: '',
  images: '',
};

describe('validateCar', () => {
  it('accepts valid values', () => {
    expect(validateCar(valid, 2026)).toBeNull();
    expect(validateCar(valid)).toBeNull();
  });

  it('requires a make, model and type', () => {
    expect(validateCar({ ...valid, make: ' ' }, 2026)).toMatch(/make/i);
    expect(validateCar({ ...valid, model: '' }, 2026)).toMatch(/model/i);
    expect(validateCar({ ...valid, type: '' }, 2026)).toMatch(/type/i);
  });

  it('checks the year range', () => {
    expect(validateCar({ ...valid, year: '1980' }, 2026)).toMatch(/year/i);
    expect(validateCar({ ...valid, year: '2028' }, 2026)).toMatch(/year/i);
    expect(validateCar({ ...valid, year: '' }, 2026)).toMatch(/year/i);
  });

  it('requires a positive price', () => {
    expect(validateCar({ ...valid, pricePerDay: '0' }, 2026)).toMatch(/price/i);
    expect(validateCar({ ...valid, pricePerDay: '' }, 2026)).toMatch(/price/i);
  });

  it('checks the number of seats', () => {
    expect(validateCar({ ...valid, seats: '0' }, 2026)).toMatch(/seats/i);
    expect(validateCar({ ...valid, seats: '2.5' }, 2026)).toMatch(/seats/i);
    expect(validateCar({ ...valid, seats: '30' }, 2026)).toMatch(/seats/i);
  });

  it('limits the description length', () => {
    expect(validateCar({ ...valid, description: 'a'.repeat(501) }, 2026)).toMatch(/description/i);
    expect(validateCar({ ...valid, description: 'a'.repeat(500) }, 2026)).toBeNull();
  });

  it('checks the photo links', () => {
    expect(validateCar({ ...valid, images: 'ftp://x/a.jpg' }, 2026)).toMatch(/photo links/i);
    expect(validateCar({ ...valid, images: '/cars/a.jpg\nhttps://x.com/b.jpg' }, 2026)).toBeNull();
  });
});