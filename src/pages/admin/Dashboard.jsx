import { useEffect, useState } from 'react';
import { calculateStats } from '../../lib/stats';
import { getAllBookings } from '../../services/bookings';
import { getCars } from '../../services/cars';

const money = (n) => `KES ${n.toLocaleString('en-US')}`;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCars(), getAllBookings()])
      .then(([cars, bookings]) => {
        setStats(calculateStats(cars, bookings));
        setRecent(
          [...bookings]
            .sort((a, b) => b.startDate.localeCompare(a.startDate))
            .slice(0, 5)
        );
      })
      .catch(() => setError('Could not load dashboard data.'));
  }, []);

  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  const cards = [
    ['Total cars', stats.totalCars],
    ['Total bookings', stats.totalBookings],
    ['Active bookings', stats.activeBookings],
    ['Cancelled bookings', stats.cancelledBookings],
    ['Revenue', money(stats.revenue)],
  ];

  return (
    <section>
      <h1 className="text-2xl font-bold">Admin dashboard</h1>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-4 shadow">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="mt-1 text-2xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-xl font-semibold">Recent bookings</h2>
      {recent.length === 0 ? (
        <p className="mt-2">No bookings yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {recent.map((b) => (
            <li key={b.id} className="rounded-lg bg-white p-4 shadow">
              <p className="font-semibold">{b.carName}</p>
              <p className="text-sm text-slate-600">
                {`${b.userName} · ${b.startDate} to ${b.endDate} · ${money(b.totalPrice)} · ${b.status}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}