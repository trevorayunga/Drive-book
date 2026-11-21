import { describe, it, expect } from 'vitest';
import { normalizePhone, validatePhone } from './phone';

describe('normalizePhone', () => {
  it('converts common Kenyan formats to +254', () => {
    expect(normalizePhone('0712 345 678')).toBe('+254712345678');
    expect(normalizePhone('0112345678')).toBe('+254112345678');
    expect(normalizePhone('+254712345678')).toBe('+254712345678');
    expect(normalizePhone('254712345678')).toBe('+254712345678');
    expect(normalizePhone('0712-345-678')).toBe('+254712345678');
  });

  it('rejects invalid numbers', () => {
    expect(normalizePhone('12345')).toBeNull();
    expect(normalizePhone('0812345678')).toBeNull();
    expect(normalizePhone('07123456789')).toBeNull();
    expect(normalizePhone('abcdefghij')).toBeNull();
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone()).toBeNull();
  });
});

describe('validatePhone', () => {
  it('returns null for a valid number', () => {
    expect(validatePhone('0712345678')).toBeNull();
  });

  it('returns a message for an invalid number', () => {
    expect(validatePhone('123')).toMatch(/valid Kenyan phone number/i);
  });
});