
export function normalizePhone(input) {
  const cleaned = String(input || '').replace(/[\s\-()]/g, '');
  const match = cleaned.match(/^(?:\+?254|0)([17]\d{8})$/);
  return match ? `+254${match[1]}` : null;
}

export function validatePhone(input) {
  return normalizePhone(input) ? null : 'Enter a valid Kenyan phone number, e.g. 0712 345 678';
}