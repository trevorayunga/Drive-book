import { isValidImageUrl, parseImageLines } from './carImages';

export function validateCar(values, currentYear = new Date().getFullYear()) {
  const { make, model, year, type, pricePerDay, seats, description, images } = values;

  if (!String(make).trim()) return 'Select or enter a make';
  if (!String(model).trim()) return 'Select or enter a model';
  if (!type) return 'Select a car type';

  const y = Number(year);
  if (!Number.isInteger(y) || y < 1990 || y > currentYear + 1) {
    return `Year must be between 1990 and ${currentYear + 1}`;
  }
  if (!(Number(pricePerDay) > 0)) return 'Price per day must be greater than 0';

  const s = Number(seats);
  if (!Number.isInteger(s) || s < 1 || s > 20) return 'Seats must be between 1 and 20';

  if (String(description || '').length > 500) {
    return 'Description must be 500 characters or fewer';
  }
  if (!parseImageLines(images).every(isValidImageUrl)) {
    return 'Photo links must start with http://, https:// or /';
  }

  return null;
}