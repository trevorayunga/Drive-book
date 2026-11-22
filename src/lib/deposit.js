export const DEPOSIT_PERCENT = 30;

export function calculateDeposit(total, percent = DEPOSIT_PERCENT) {
  return Math.round((total * percent) / 100);
}