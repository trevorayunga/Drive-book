import { describe, it, expect, vi, afterEach } from 'vitest';
import { getMakes, getModels } from './nhtsa';

const mockFetch = (body, ok = true, status = 200) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok, status, json: async () => body })
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getMakes', () => {
  it('returns unique makes sorted alphabetically', async () => {
    mockFetch({
      Results: [{ MakeName: 'Toyota' }, { MakeName: 'Honda' }, { MakeName: 'Toyota' }],
    });
    expect(await getMakes()).toEqual(['Honda', 'Toyota']);
  });

  it('throws when the request fails', async () => {
    mockFetch({}, false, 500);
    await expect(getMakes()).rejects.toThrow('Request failed: 500');
  });
});

describe('getModels', () => {
  it('returns unique models for a make and encodes the make in the URL', async () => {
    mockFetch({
      Results: [{ Model_Name: 'Vitz' }, { Model_Name: 'Corolla' }, { Model_Name: 'Vitz' }],
    });
    expect(await getModels('Land Rover')).toEqual(['Corolla', 'Vitz']);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('Land%20Rover'));
  });
});