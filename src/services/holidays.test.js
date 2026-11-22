import { describe, it, expect, vi, afterEach } from 'vitest';
import { getHolidays } from './holidays';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getHolidays', () => {
  it('returns holiday dates for Kenya by default', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ date: '2026-12-12' }, { date: '2026-12-25' }],
      })
    );
    expect(await getHolidays(2026)).toEqual(['2026-12-12', '2026-12-25']);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/2026/KE'));
  });

  it('throws when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(getHolidays(2026)).rejects.toThrow('Request failed: 404');
  });
});