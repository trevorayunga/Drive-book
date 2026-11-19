import { useEffect, useState } from 'react';
import CarCard from '../components/CarCard';
import { getCars } from '../services/cars';
import { getCarTypes, filterCarsByType } from '../lib/carFilters';
import { Link } from 'react-router-dom';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch(() => setError('Could not load cars. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading cars...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  const visible = filterCarsByType(cars, type);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Available cars</h1>
        <label className="text-sm">
          <span className="mr-2">Car type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1"
          >
            <option value="">All types</option>
            {getCarTypes(cars).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p>No cars available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((car) => (
            <CarCard key={car.id} car={car}>
              <Link
                to={`/cars/${car.id}/book`}
                className="block rounded bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-500"
              >
                Book now
              </Link>
            </CarCard>
          ))}
        </div>
      )}
    </section>
  );
}