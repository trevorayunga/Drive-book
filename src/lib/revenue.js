
export function isPaid(booking) {
  return (
    booking.status === 'confirmed' &&
    booking.paymentStatus === 'paid' &&
    Boolean(booking.paidDate)
  );
}


export function todayLocal() {
  return new Date().toLocaleDateString('en-CA');
}

export function revenueByDay(bookings, from = '', to = '') {
  const days = {};
  bookings.filter(isPaid).forEach((b) => {
    if (from && b.paidDate < from) return;
    if (to && b.paidDate > to) return;
    const day = days[b.paidDate] || { count: 0, amount: 0 };
    days[b.paidDate] = { count: day.count + 1, amount: day.amount + b.totalPrice };
  });
  return Object.entries(days)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, day]) => ({ date, count: day.count, amount: day.amount }));
}

export function totalRevenue(rows) {
  return rows.reduce((sum, row) => sum + row.amount, 0);
}