import { useState } from 'react';
import { calculatePrice, daysBetween, validateDates } from '../lib/bookingLogic';
import { DEPOSIT_PERCENT, calculateDeposit } from '../lib/deposit';


export default function BookingForm({
  car,
  holidays = [],
  onSubmit,
  submitting = false,
  serverError = '',
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const isValid = !validateDates(startDate, endDate);
  const total = isValid
    ? calculatePrice(car.pricePerDay, startDate, endDate, holidays)
    : null;
  const days = isValid ? daysBetween(startDate, endDate) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const problem = validateDates(startDate, endDate);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    onSubmit({ startDate, endDate, totalPrice: total });
  };

  const message = error || serverError;

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow">
      <label className="block text-sm font-medium">
        Pickup date
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Return date
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>

       {isValid && (
        <div className="space-y-1 text-slate-700">
          <p>
            Total: <strong>{`KES ${total.toLocaleString('en-US')}`}</strong>
            {` for ${days} day${days === 1 ? '' : 's'}`}
          </p>
          <p className="text-sm">
            {`Refundable security deposit (${DEPOSIT_PERCENT}%): KES ${calculateDeposit(total).toLocaleString('en-US')}, paid at pickup`}
          </p>
        </div>
      )}

      {message && (
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Confirm booking'}
      </button>
    </form>
  );
}