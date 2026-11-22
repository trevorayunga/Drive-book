import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CarForm from '../../components/CarForm';
import { addCar, deleteCar, getCars, updateCar } from '../../services/cars';

const money = (n) => `KES ${n.toLocaleString('en-US')}`;

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null, 'new', or a car
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch(() => setLoadFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    setFormError('');
    setSubmitting(true);
    try {
      if (editing === 'new') {
        const id = await addCar(data);
        setCars((prev) => [...prev, { id, ...data }]);
      } else {
        await updateCar(editing.id, data);
        setCars((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)));
      }
      setEditing(null);
    } catch {
      setFormError('Could not save the car. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (car) => {
    if (!window.confirm(`Delete ${car.make} ${car.model}?`)) return;
    setError('');
    try {
      await deleteCar(car.id);
      setCars((prev) => prev.filter((c) => c.id !== car.id));
    } catch {
      setError('Could not delete the car. Please try again.');
    }
  };

  const openForm = (target) => {
    setFormError('');
    setEditing(target);
  };

  return (
    <section>
      <Link to="/admin" className="text-sm text-blue-600 underline">
        Back to dashboard
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage cars</h1>
        {!editing && (
          <button
            onClick={() => openForm('new')}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Add car
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {editing && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            {editing === 'new' ? 'Add a car' : `Edit ${editing.make} ${editing.model}`}
          </h2>
          <CarForm
            key={editing === 'new' ? 'new' : editing.id}
            car={editing === 'new' ? null : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            submitting={submitting}
            serverError={formError}
          />
        </div>
      )}

      {loading && <p className="mt-4">Loading cars...</p>}
      {loadFailed && (
        <p role="alert" className="mt-4 text-red-600">
          Could not load cars.
        </p>
      )}
      {!loading && !loadFailed && cars.length === 0 && <p className="mt-4">No cars yet.</p>}

      {cars.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3">Car</th>
                <th className="p-3">Year</th>
                <th className="p-3">Type</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Price / day</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-t">
                  <td className="p-3">{`${car.make} ${car.model}`}</td>
                  <td className="p-3">{car.year}</td>
                  <td className="p-3">{car.type}</td>
                  <td className="p-3">{car.seats}</td>
                  <td className="p-3">{money(car.pricePerDay)}</td>
                  <td className="space-x-2 p-3">
                    <button
                      onClick={() => openForm(car)}
                      aria-label={`Edit ${car.make} ${car.model}`}
                      className="rounded bg-slate-200 px-3 py-1 hover:bg-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car)}
                      aria-label={`Delete ${car.make} ${car.model}`}
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}