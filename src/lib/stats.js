export function calculateStats(cars, bookings) {
  const active = bookings.filter((b) => b.status === 'confirmed');
  return {
    totalCars: cars.length,
    totalBookings: bookings.length,
    activeBookings: active.length,
    cancelledBookings: bookings.length - active.length,
    revenue: active.reduce((sum, b) => sum + b.totalPrice, 0),
  };
}