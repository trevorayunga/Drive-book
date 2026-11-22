import { describe, it, expect } from 'vitest';
import { getCarTypes, filterCarsByType } from './carFilters';

const cars = [
  { id: 1, type: 'SUV' },
  { id: 2, type: 'Sedan' },
  { id: 3, type: 'SUV' },
];

describe('getCarTypes', () => {
  it('returns unique types sorted alphabetically', () => {
    expect(getCarTypes(cars)).toEqual(['SUV', 'Sedan']);
  });
});

describe('filterCarsByType', () => {
  it('returns only cars of the chosen type', () => {
    expect(filterCarsByType(cars, 'SUV')).toHaveLength(2);
  });
  it('returns all cars when no type is chosen', () => {
    expect(filterCarsByType(cars, '')).toHaveLength(3);
  });
});