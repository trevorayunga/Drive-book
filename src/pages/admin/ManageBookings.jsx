import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAvailable } from '../../lib/bookingLogic';
import { todayLocal } from '../../lib/revenue';
import {
  getAllBookings,
  getAllContacts,
  markBookingPaid,
  markBookingUnpaid,
  setBookingStatus,
} from '../../services/bookings';

const money = (n) => `KES ${n.toLocaleString('en-US')}`;

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState({});
  const [payDates, setPayDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([getAllBookings(), getAllContacts().catch(() => ({}))])
      .then(([list, contactMap]) => {
        setBookings([...list].sort((a, b) => b.startDate.localeCompare(a.startDate)));
        setContacts(contactMap);
      })
      .catch(() => setError('Could not load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  const updateBooking = (id, changes) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...changes } : b)));

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
      updateBooking(booking.id, { status });
    } catch {
      setError('Could not update the booking. Please try again.');
    }
  };

  const markPaid = async (booking) => {
    setError('');
    const paidDate = payDates[booking.id] || todayLocal();
    try {
      await markBookingPaid(booking.id, paidDate);
      updateBooking(booking.id, { paymentStatus: 'paid', paidDate });
    } catch {
      setError('Could not record the payment. Please try again.');
    }
  };

  const undoPayment = async (booking) => {
    setError('');
    try {
      await markBookingUnpaid(booking.id);
      updateBooking(booking.id, { paymentStatus: 'unpaid', paidDate: null });
    } catch {
      setError('Could not undo the payment. Please try again.');
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
            name="statusFilter"
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
        {visible.map((b) => {
          const paid = b.paymentStatus === 'paid';
          return (
            <li
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow"
            >
              <div>
                <p className="font-semibold">{b.carName}</p>
                <p className="text-sm text-slate-600">
                  {`${b.userName} · ${b.startDate} to ${b.endDate} · ${money(b.totalPrice)} · ${b.status}`}
                </p>
                {contacts[b.id] && (
                  <p className="text-sm text-slate-600">
                    <a href={`tel:${contacts[b.id].phone}`} className="text-blue-600 underline">
                      {contacts[b.id].phone}
                    </a>
                    {contacts[b.id].notes && ` · Note: ${contacts[b.id].notes}`}
                  </p>
                )}
                {b.status === 'confirmed' &&
                  (paid ? (
                    <p className="text-sm font-medium text-green-700">
                      {`Paid in full on ${b.paidDate}`}
                    </p>
                  ) : (
                    <p className="text-sm text-amber-700">
                      {`Payment due at pickup: ${money(b.totalPrice)}`}
                    </p>
                  ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {b.status === 'confirmed' && !paid && (
                  <>
                    <input
                      type="date"
                      name={`payDate-${b.id}`}
                      aria-label={`Payment date for ${b.userName}`}
                      value={payDates[b.id] || todayLocal()}
                      onChange={(e) =>
                        setPayDates((prev) => ({ ...prev, [b.id]: e.target.value }))
                      }
                      className="rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => markPaid(b)}
                      aria-label={`Mark paid for ${b.userName}`}
                      className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-500"
                    >
                      Mark paid
                    </button>
                    <button
                      onClick={() => changeStatus(b, 'cancelled')}
                      aria-label={`Cancel booking for ${b.userName}`}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500"
                    >
                      Cancel booking
                    </button>
                  </>
                )}
                {b.status === 'confirmed' && paid && (
                  <button
                    onClick={() => undoPayment(b)}
                    aria-label={`Undo payment for ${b.userName}`}
                    className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
                  >
                    Undo payment
                  </button>
                )}
                {b.status !== 'confirmed' && (
                  <button
                    onClick={() => changeStatus(b, 'confirmed')}
                    aria-label={`Confirm booking for ${b.userName}`}
                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-500"
                  >
                    Confirm booking
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}