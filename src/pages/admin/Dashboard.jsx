import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addDays } from '../../lib/bookingLogic';
import { revenueByDay, todayLocal, totalRevenue } from '../../lib/revenue';
import { calculateStats } from '../../lib/stats';
import { getAllBookings } from '../../services/bookings';
import { getCars } from '../../services/cars';

const money = (n) => `KES ${n.toLocaleString('en-US')}`;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    Promise.all([getCars(), getAllBookings()])
      .then(([cars, list]) => {
        setStats(calculateStats(cars, list));
        setBookings(list);
      })
      .catch(() => setError('Could not load dashboard data.'));
  }, []);

  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  const recent = [...bookings].sort((a, b) => b.startDate.localeCompare(a.startDate)).slice(0, 5);

  const today = todayLocal();
  const rows = revenueByDay(bookings, from, to);
  const paidCount = rows.reduce((sum, row) => sum + row.count, 0);
  const presets = [
    ['Today', today, today],
    ['Last 7 days', addDays(today, -6), today],
    ['This month', `${today.slice(0, 7)}-01`, today],
    ['All time', '', ''],
  ];

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
      <div className="mt-4 flex gap-4 text-sm">
        <Link to="/admin/cars" className="text-blue-600 underline">
          Manage cars
        </Link>
        <Link to="/admin/bookings" className="text-blue-600 underline">
          Manage bookings
        </Link>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-4 shadow">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="mt-1 text-2xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-xl font-semibold">Revenue by day</h2>
      <p className="mt-1 text-sm text-slate-600">
        Counts bookings that are confirmed, picked up and paid in full (marked by an admin in Manage bookings).
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="mr-2">From</span>
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded border border-slate-300 px-2 py-1"
          />
        </label>
        <label className="text-sm">
          <span className="mr-2">To</span>
          <input
            type="date"
            name="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded border border-slate-300 px-2 py-1"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map(([label, start, end]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setFrom(start);
                setTo(end);
              }}
              className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4">No paid bookings in this period.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Bookings</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-t">
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.count}</td>
                  <td className="p-3">{money(row.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-slate-50 font-semibold">
                <td className="p-3">Total</td>
                <td className="p-3">{paidCount}</td>
                <td className="p-3">{money(totalRevenue(rows))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

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