import { describe, it, expect } from 'vitest';
import { formatMake, withCurrent } from './carOptions';

describe('formatMake', () => {
  it('capitalises long names', () => {
    expect(formatMake('TOYOTA')).toBe('Toyota');
    expect(formatMake('MERCEDES-BENZ')).toBe('Mercedes-Benz');
    expect(formatMake('LAND ROVER')).toBe('Land Rover');
  });

  it('keeps short names in capitals', () => {
    expect(formatMake('BMW')).toBe('BMW');
  });

  it('returns empty values unchanged', () => {
    expect(formatMake('')).toBe('');
  });
});

describe('withCurrent', () => {
  it('adds a missing current value to the front', () => {
    expect(withCurrent(['Corolla'], 'Vitz')).toEqual(['Vitz', 'Corolla']);
  });

  it('leaves the list alone when the value is present or empty', () => {
    expect(withCurrent(['Corolla'], 'Corolla')).toEqual(['Corolla']);
    expect(withCurrent(['Corolla'], '')).toEqual(['Corolla']);
  });
});