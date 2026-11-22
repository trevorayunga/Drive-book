import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { useAuth } from '../context/AuthContext';
import { isAvailable } from '../lib/bookingLogic';
import { createBooking, getBookingsForCar } from '../services/bookings';
import { getCar } from '../services/cars';
import { getHolidays } from '../services/holidays';
import { business } from '../config/business';

export default function Book() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
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

    const year = new Date().getFullYear();
    Promise.all([getHolidays(year), getHolidays(year + 1)])
      .then(([thisYear, nextYear]) => setHolidays([...thisYear, ...nextYear]))
      .catch(() => setHolidays([]));
  }, [id]);

  const handleSubmit = async ({ startDate, endDate, totalPrice, phone, notes }) => {
    setServerError('');
    setSubmitting(true);
    try {
      const existing = await getBookingsForCar(car.id);
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
      setServerError(`Could not save your booking (${err.code || 'unknown error'}). Please try again.`);
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
      <BookingForm
        car={car}
        holidays={holidays}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
      />
    </section>
  );
}