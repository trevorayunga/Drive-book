import { useState } from 'react';
import {
  calculatePrice,
  daysBetween,
  findConflict,
  validateDates,
} from '../lib/bookingLogic';
import { DEPOSIT_PERCENT, calculateDeposit } from '../lib/deposit';
import { normalizePhone, validatePhone } from '../lib/phone';

const inputClass = 'mt-1 block w-full rounded border border-slate-300 px-3 py-2';

export default function BookingForm({
  car,
  holidays = [],
  bookings = null,
  onSubmit,
  submitting = false,
  serverError = '',
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const isValid = !validateDates(startDate, endDate);
  const total = isValid
    ? calculatePrice(car.pricePerDay, startDate, endDate, holidays)
    : null;
  const days = isValid ? daysBetween(startDate, endDate) : 0;

  const conflict = isValid && bookings ? findConflict(car.id, startDate, endDate, bookings) : null;
  const conflictMessage = conflict
    ? `Sorry, this car is already booked from ${conflict.startDate} to ${conflict.endDate}. Please choose different dates.`
    : '';
  const available = Boolean(isValid && bookings && !conflict);

  const handleSubmit = (e) => {
    e.preventDefault();
    const problem = validateDates(startDate, endDate) || conflictMessage || validatePhone(phone);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    onSubmit({
      startDate,
      endDate,
      totalPrice: total,
      phone: normalizePhone(phone),
      notes: notes.trim(),
    });
  };

  const message = error || serverError || conflictMessage;

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow">
      <label className="block text-sm font-medium">
        Pickup date
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block text-sm font-medium">
        Return date
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium">
        Phone number
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0712 345 678"
          className={inputClass}
        />
      </label>
      <label className="block text-sm font-medium">
        Notes (optional)
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={200}
          rows={2}
          placeholder="Pickup time, airport pickup, child seat..."
          className={inputClass}
        />
      </label>
      <p className="text-xs text-slate-500">
        We use your phone number only to contact you about this booking.
      </p>

      {available && (
        <p role="status" className="text-sm font-medium text-green-700">
          This car is available for your dates.
        </p>
      )}

      {isValid && (
        <div className="space-y-1 text-slate-700">
          <p>
            Total: <strong>{`KES ${total.toLocaleString('en-US')}`}</strong>
            {` for ${days} day${days === 1 ? '' : 's'}`}
          </p>
          <p className="text-sm">
            {`Refundable security deposit (${DEPOSIT_PERCENT}%): KES ${calculateDeposit(total).toLocaleString('en-US')}, paid at pickup (not charged online)`}
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
        disabled={submitting || Boolean(conflict)}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Confirm booking'}
      </button>
    </form>
  );
}