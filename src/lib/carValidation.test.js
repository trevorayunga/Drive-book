import { describe, it, expect } from 'vitest';
import { validateCar } from './carValidation';

const valid = {
  make: 'Toyota',
  model: 'Corolla',
  year: '2020',
  type: 'Sedan',
  pricePerDay: '4500',
  seats: '5',
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
});