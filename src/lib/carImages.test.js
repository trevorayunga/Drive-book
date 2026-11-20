import { describe, it, expect } from 'vitest';
import { getCarImages, isValidImageUrl, parseImageLines } from './carImages';

describe('getCarImages', () => {
  it('prefers the images list', () => {
    expect(getCarImages({ images: ['/a.jpg', '/b.jpg'], image: '/old.jpg' })).toEqual([
      '/a.jpg',
      '/b.jpg',
    ]);
  });

  it('falls back to the single image', () => {
    expect(getCarImages({ image: '/old.jpg' })).toEqual(['/old.jpg']);
    expect(getCarImages({ images: [], image: '/old.jpg' })).toEqual(['/old.jpg']);
  });

  it('returns an empty list when there are no photos', () => {
    expect(getCarImages({ image: '' })).toEqual([]);
  });
});

describe('parseImageLines', () => {
  it('trims lines and drops blank ones', () => {
    expect(parseImageLines(' /a.jpg \n\n /b.jpg\n')).toEqual(['/a.jpg', '/b.jpg']);
  });

  it('handles missing text', () => {
    expect(parseImageLines()).toEqual([]);
  });
});

describe('isValidImageUrl', () => {
  it('accepts web links and site paths', () => {
    expect(isValidImageUrl('https://x.com/a.jpg')).toBe(true);
    expect(isValidImageUrl('http://x.com/a.jpg')).toBe(true);
    expect(isValidImageUrl('/cars/a.jpg')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isValidImageUrl('ftp://x/a.jpg')).toBe(false);
    expect(isValidImageUrl('photo.jpg')).toBe(false);
  });
});