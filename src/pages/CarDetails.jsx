import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CarGallery from '../components/CarGallery';
import { business } from '../config/business';
import { getCarImages } from '../lib/carImages';
import { DEPOSIT_PERCENT } from '../lib/deposit';
import { getCar } from '../services/cars';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCar(id)
      .then((c) => {
        if (c) setCar(c);
        else setError('Car not found.');
      })
      .catch(() => setError('Could not load the car.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p role="alert" className="text-red-600">
          {error}
        </p>
        <Link to="/cars" className="text-blue-600 underline">
          Back to cars
        </Link>
      </div>
    );
  }

  return (
    <section>
      <Link to="/cars" className="text-sm text-blue-600 underline">
        Back to cars
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <CarGallery images={getCarImages(car)} alt={`${car.make} ${car.model}`} />

        <div>
          <h1 className="text-3xl font-bold">{`${car.make} ${car.model}`}</h1>
          <p className="mt-1 text-slate-600">{`${car.year} · ${car.type} · ${car.seats} seats`}</p>
          <p className="mt-3 text-2xl font-bold">
            {`KES ${car.pricePerDay.toLocaleString('en-US')}`}
            <span className="text-sm font-normal text-slate-500"> / day</span>
          </p>

          <h2 className="mt-6 text-lg font-semibold">About this car</h2>
          <p className="mt-1 text-slate-700">{car.description || 'No description yet.'}</p>

          <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-slate-700">
            {`A refundable security deposit of ${DEPOSIT_PERCENT}% of the rental total is paid at pickup. `}
            <Link to="/policy" className="text-blue-600 underline">
              Read the rental policy
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            {'Questions? Call '}
            <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="text-blue-600 underline">
              {business.phone}
            </a>
          </p>

          <Link
            to={`/cars/${car.id}/book`}
            className="mt-6 inline-block rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-500"
          >
            Book now
          </Link>
        </div>
      </div>
    </section>
  );
}