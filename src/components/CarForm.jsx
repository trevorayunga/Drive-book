import { useEffect, useState } from 'react';
import { CAR_TYPES, formatMake, withCurrent } from '../lib/carOptions';
import { validateCar } from '../lib/carValidation';
import { getMakes, getModels } from '../services/nhtsa';

const emptyValues = {
  make: '',
  model: '',
  year: '',
  type: '',
  pricePerDay: '',
  seats: '',
  image: '',
};

const inputClass = 'mt-1 block w-full rounded border border-slate-300 px-3 py-2';

export default function CarForm({
  car = null,
  onSubmit,
  onCancel,
  submitting = false,
  serverError = '',
}) {
  const [values, setValues] = useState(
    car
      ? {
          make: car.make,
          model: car.model,
          year: String(car.year),
          type: car.type,
          pricePerDay: String(car.pricePerDay),
          seats: String(car.seats),
          image: car.image || '',
        }
      : emptyValues
  );
  const [makes, setMakes] = useState([]);
  const [makesFailed, setMakesFailed] = useState(false);
  const [modelData, setModelData] = useState({ make: '', list: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getMakes()
      .then((list) => active && setMakes([...new Set(list.map(formatMake))].sort()))
      .catch(() => active && setMakesFailed(true));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!values.make || makesFailed) return;
    let active = true;
    getModels(values.make)
      .then((list) => active && setModelData({ make: values.make, list }))
      .catch(() => active && setModelData({ make: values.make, list: [] }));
    return () => {
      active = false;
    };
  }, [values.make, makesFailed]);

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const modelsLoaded = modelData.make === values.make;
  const modelOptions = modelsLoaded ? modelData.list : [];
  const manualModel = makesFailed || (modelsLoaded && modelOptions.length === 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const problem = validateCar(values);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    onSubmit({
      make: values.make.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      type: values.type,
      pricePerDay: Number(values.pricePerDay),
      seats: Number(values.seats),
      image: values.image.trim(),
    });
  };

  const message = error || serverError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {makesFailed && (
        <p className="text-sm text-amber-700">
          Could not load the vehicle list. Enter the details manually.
        </p>
      )}

      <label className="block text-sm font-medium">
        Make
        {makesFailed ? (
          <input type="text" value={values.make} onChange={set('make')} className={inputClass} />
        ) : (
          <select
            value={values.make}
            onChange={(e) =>
              setValues((v) => ({ ...v, make: e.target.value, model: '' }))
            }
            className={inputClass}
          >
            <option value="">Select make</option>
            {withCurrent(makes, values.make).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="block text-sm font-medium">
        Model
        {manualModel ? (
          <input type="text" value={values.model} onChange={set('model')} className={inputClass} />
        ) : (
          <select
            value={values.model}
            onChange={set('model')}
            disabled={!values.make}
            className={inputClass}
          >
            <option value="">
              {values.make && !modelsLoaded ? 'Loading models...' : 'Select model'}
            </option>
            {withCurrent(modelOptions, values.model).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="block text-sm font-medium">
        Year
        <input type="number" value={values.year} onChange={set('year')} className={inputClass} />
      </label>

      <label className="block text-sm font-medium">
        Car type
        <select value={values.type} onChange={set('type')} className={inputClass}>
          <option value="">Select type</option>
          {CAR_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        Price per day (KES)
        <input
          type="number"
          value={values.pricePerDay}
          onChange={set('pricePerDay')}
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium">
        Seats
        <input type="number" value={values.seats} onChange={set('seats')} className={inputClass} />
      </label>

      <label className="block text-sm font-medium">
        Image URL (optional)
        <input type="text" value={values.image} onChange={set('image')} className={inputClass} />
      </label>

      {message && (
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : car ? 'Save changes' : 'Add car'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-slate-200 px-4 py-2 font-medium hover:bg-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}