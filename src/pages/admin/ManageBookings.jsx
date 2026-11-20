import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAvailable } from '../../lib/bookingLogic';
import { getAllBookings, setBookingStatus } from '../../services/bookings';

const money = (n) => `KES ${n.toLocaleString('en-US')}`;

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllBookings()
      .then((list) =>
        setBookings([...list].sort((a, b) => b.startDate.localeCompare(a.startDate)))
      )
      .catch(() => setError('Could not load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (booking, status) => {
    setError('');
    if (status === 'confirmed') {
      const others = bookings.filter((b) => b.id !== booking.id);
      if (!isAvailable(booking.carId, booking.startDate, booking.endDate, others)) {
        setError('Cannot confirm: this car is already booked for those dates.');
        return;
      }
    }
    try {
      await setBookingStatus(booking.id, status);
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status } : b)));
    } catch {
      setError('Could not update the booking. Please try again.');
    }
  };

  const visible = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <section>
      <Link to="/admin" className="text-sm text-blue-600 underline">
        Back to dashboard
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage bookings</h1>
        <label className="text-sm">
          <span className="mr-2">Status</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1"
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-red-600">
          {error}
        </p>
      )}
      {loading && <p className="mt-4">Loading bookings...</p>}
      {!loading && !error && visible.length === 0 && <p className="mt-4">No bookings found.</p>}

      <ul className="mt-6 space-y-3">
        {visible.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <div>
              <p className="font-semibold">{b.carName}</p>
              <p className="text-sm text-slate-600">
                {`${b.userName} · ${b.startDate} to ${b.endDate} · ${money(b.totalPrice)} · ${b.status}`}
              </p>
            </div>
            {b.status === 'confirmed' ? (
              <button
                onClick={() => changeStatus(b, 'cancelled')}
                aria-label={`Cancel booking for ${b.userName}`}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500"
              >
                Cancel booking
              </button>
            ) : (
              <button
                onClick={() => changeStatus(b, 'confirmed')}
                aria-label={`Confirm booking for ${b.userName}`}
                className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-500"
              >
                Confirm booking
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}