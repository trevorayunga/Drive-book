import { isPaid } from './revenue';

export function calculateStats(cars, bookings) {
  const active = bookings.filter((b) => b.status === 'confirmed');
  return {
    totalCars: cars.length,
    totalBookings: bookings.length,
    activeBookings: active.length,
    cancelledBookings: bookings.length - active.length,
    revenue: bookings.filter(isPaid).reduce((sum, b) => sum + b.totalPrice, 0),
  };
}