
export function getCarImages(car) {
  if (car.images && car.images.length > 0) return car.images;
  return car.image ? [car.image] : [];
}

export function parseImageLines(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function isValidImageUrl(url) {
  return /^(https?:\/\/|\/)/.test(url);
}