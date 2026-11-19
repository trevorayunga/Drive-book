import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cancelBooking, getUserBookings } from '../services/bookings';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserBookings(user.uid)
      .then((list) =>
        setBookings([...list].sort((a, b) => b.startDate.localeCompare(a.startDate)))
      )
      .catch(() => setError('Could not load your bookings.'))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleCancel = async (id) => {
    setError('');
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch {
      setError('Could not cancel the booking. Please try again.');
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {error && (
        <p role="alert" className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {loading && <p className="mt-4">Loading bookings...</p>}

      {!loading && bookings.length === 0 && !error && (
        <p className="mt-4">
          You have no bookings yet.{' '}
          <Link to="/cars" className="text-blue-600 underline">
            Browse cars
          </Link>
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <div>
              <h2 className="font-semibold">{b.carName}</h2>
              <p className="text-sm text-slate-600">{`${b.startDate} to ${b.endDate}`}</p>
              <p className="text-sm">
                {`KES ${b.totalPrice.toLocaleString('en-US')} · `}
                <span className="capitalize">{b.status}</span>
              </p>
            </div>
            {b.status === 'confirmed' && (
              <button
                onClick={() => handleCancel(b.id)}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500"
              >
                Cancel booking
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}