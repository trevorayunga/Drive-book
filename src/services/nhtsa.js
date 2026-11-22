const BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function getMakes() {
  const data = await getJSON(`${BASE}/GetMakesForVehicleType/car?format=json`);
  return [...new Set(data.Results.map((r) => r.MakeName))].sort();
}

export async function getModels(make) {
  const data = await getJSON(
    `${BASE}/GetModelsForMake/${encodeURIComponent(make)}?format=json`
  );
  return [...new Set(data.Results.map((r) => r.Model_Name))].sort();
}