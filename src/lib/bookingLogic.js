const DAY_MS = 24 * 60 * 60 * 1000;

// Dates are ISO strings: 'YYYY-MM-DD'
const toUTC = (iso) => new Date(`${iso}T00:00:00Z`);
const toISO = (date) => date.toISOString().slice(0, 10);

export function addDays(iso, n) {
  return toISO(new Date(toUTC(iso).getTime() + n * DAY_MS));
}

export function daysBetween(start, end) {
  return Math.round((toUTC(end) - toUTC(start)) / DAY_MS);
}

export function validateDates(start, end, today = toISO(new Date())) {
  if (!start || !end) return 'Select both pickup and return dates';
  if (start < today) return 'Pickup date cannot be in the past';
  if (end <= start) return 'Return date must be after pickup date';
  return null;
}

// Half-open ranges: a return on day X does not clash with a pickup on day X
export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export function isAvailable(carId, start, end, bookings) {
  return !bookings.some(
    (b) =>
      b.carId === carId &&
      b.status !== 'cancelled' &&
      rangesOverlap(start, end, b.startDate, b.endDate)
  );
}

export function calculatePrice(pricePerDay, start, end, holidays = [], surcharge = 0.2) {
  const days = daysBetween(start, end);
  let total = 0;
  for (let i = 0; i < days; i++) {
    const isHoliday = holidays.includes(addDays(start, i));
    total += isHoliday ? pricePerDay * (1 + surcharge) : pricePerDay;
  }
  return Math.round(total * 100) / 100;
}