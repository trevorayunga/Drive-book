export const CAR_TYPES = ['Hatchback', 'Sedan', 'SUV', 'Van', 'Pickup', 'Convertible'];


export function formatMake(name) {
  if (!name || name.length <= 3) return name;
  return name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}


export function withCurrent(list, current) {
  return current && !list.includes(current) ? [current, ...list] : list;
}