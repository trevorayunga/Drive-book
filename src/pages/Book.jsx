import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { business } from '../config/business';
import { useAuth } from '../context/AuthContext';
import { getBookedRanges, isAvailable } from '../lib/bookingLogic';
import { createBooking, getBookingsForCar } from '../services/bookings';
import { getCar } from '../services/cars';
import { getHolidays } from '../services/holidays';

export default function Book() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    getCar(id)
      .then((c) => {
        if (c) setCar(c);
        else setLoadError('Car not found.');
      })
      .catch(() => setLoadError('Could not load the car.'))
      .finally(() => setLoading(false));

    getBookingsForCar(id)
      .then(setBookings)
      .catch(() => setBookings(null));

    const year = new Date().getFullYear();
    Promise.all([getHolidays(year), getHolidays(year + 1)])
      .then(([thisYear, nextYear]) => setHolidays([...thisYear, ...nextYear]))
      .catch(() => setHolidays([]));
  }, [id]);

  const handleSubmit = async ({ startDate, endDate, totalPrice, phone, notes }) => {
    setServerError('');
    setSubmitting(true);
    try {
      // Check again with fresh data in case someone booked while this page was open
      const existing = await getBookingsForCar(car.id);
      setBookings(existing);
      if (!isAvailable(car.id, startDate, endDate, existing)) {
        setServerError('Sorry, this car is already booked for those dates.');
        return;
      }
      await createBooking(
        {
          userId: user.uid,
          userName: user.displayName || user.email,
          carId: car.id,
          carName: `${car.make} ${car.model}`,
          startDate,
          endDate,
          totalPrice,
        },
        { phone, notes }
      );
      navigate('/bookings');
    } catch (err) {
      console.error('Booking failed:', err);
      setServerError(
        `Could not save your booking (${err.code || 'unknown error'}). Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (loadError) {
    return (
      <div>
        <p role="alert" className="text-red-600">
          {loadError}
        </p>
        <Link to="/cars" className="text-blue-600 underline">
          Back to cars
        </Link>
      </div>
    );
  }

  const ranges = bookings ? getBookedRanges(car.id, bookings) : [];

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">{`Book ${car.make} ${car.model}`}</h1>
      <p className="mt-1 text-slate-600">
        {`${car.year} · ${car.type} · ${car.seats} seats · KES ${car.pricePerDay.toLocaleString('en-US')} / day`}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        <Link to="/policy" className="text-blue-600 underline">
          Read the rental policy
        </Link>
        {` · Questions? Call ${business.phone}`}
      </p>

      {ranges.length > 0 && (
        <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-slate-700">
          <p className="font-medium">This car is already booked on:</p>
          <ul className="mt-1 list-disc pl-5">
            {ranges.map((r) => (
              <li key={`${r.startDate}-${r.endDate}`}>{`${r.startDate} to ${r.endDate}`}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-slate-500">
            The car is free again on the return date shown.
          </p>
        </div>
      )}

      <BookingForm
        car={car}
        holidays={holidays}
        bookings={bookings}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
      />
    </section>
  );
}