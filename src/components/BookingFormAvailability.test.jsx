import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingForm from './BookingForm';

const car = { id: 'c1', pricePerDay: 4500 };
const booked = [
  { carId: 'c1', startDate: '2099-01-09', endDate: '2099-01-12', status: 'confirmed' },
];

const fillDates = (start, end) => {
  fireEvent.change(screen.getByLabelText('Pickup date'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('Return date'), { target: { value: end } });
};

describe('BookingForm availability', () => {
  it('shows no availability message while the bookings are not loaded', () => {
    render(<BookingForm car={car} onSubmit={vi.fn()} />);
    fillDates('2099-01-10', '2099-01-13');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeEnabled();
  });

  it('says the car is available when the dates are free', () => {
    render(<BookingForm car={car} bookings={[]} onSubmit={vi.fn()} />);
    fillDates('2099-01-10', '2099-01-13');
    expect(screen.getByRole('status')).toHaveTextContent('This car is available for your dates.');
  });

  it('warns about a clash and blocks the button', () => {
    render(<BookingForm car={car} bookings={booked} onSubmit={vi.fn()} />);
    fillDates('2099-01-10', '2099-01-13');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'already booked from 2099-01-09 to 2099-01-12'
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeDisabled();
  });

  it('allows a pickup on the day another booking ends', () => {
    render(<BookingForm car={car} bookings={booked} onSubmit={vi.fn()} />);
    fillDates('2099-01-12', '2099-01-14');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeEnabled();
  });
});