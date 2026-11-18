const BASE = 'https://date.nager.at/api/v3';


export async function getHolidays(year, country = 'KE') {
  const res = await fetch(`${BASE}/PublicHolidays/${year}/${country}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();
  return data.map((h) => h.date);
}