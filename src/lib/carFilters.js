export function getCarTypes(cars) {
  return [...new Set(cars.map((c) => c.type))].sort();
}

export function filterCarsByType(cars, type) {
  return type ? cars.filter((c) => c.type === type) : cars;
}