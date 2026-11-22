import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BookingForm from './BookingForm';

const car = { pricePerDay: 4500 };

const fillDates = (start, end) => {
  fireEvent.change(screen.getByLabelText('Pickup date'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('Return date'), { target: { value: end } });
};

const fillPhone = (value) =>
  fireEvent.change(screen.getByLabelText('Phone number'), { target: { value } });

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Confirm booking' }));

describe('BookingForm', () => {
  it('shows an error when submitted without dates', async () => {
    render(<BookingForm car={car} onSubmit={vi.fn()} />);
    await submit();
    expect(screen.getByRole('alert')).toHaveTextContent(/both/i);
  });

  it('rejects dates in the past', async () => {
    const onSubmit = vi.fn();
    render(<BookingForm car={car} onSubmit={onSubmit} />);
    fillDates('2000-01-01', '2000-01-05');
    await submit();
    expect(screen.getByRole('alert')).toHaveTextContent(/past/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows the total price once the dates are valid', () => {
    render(<BookingForm car={car} onSubmit={vi.fn()} />);
    fillDates('2099-01-10', '2099-01-13');
    expect(screen.getByText('KES 13,500')).toBeInTheDocument();
    expect(screen.getByText(/for 3 days/)).toBeInTheDocument();
  });

  it('adds the holiday surcharge', () => {
    render(<BookingForm car={car} holidays={['2099-01-11']} onSubmit={vi.fn()} />);
    fillDates('2099-01-10', '2099-01-13');
    expect(screen.getByText('KES 14,400')).toBeInTheDocument();
  });

  it('uses the singular for a one day rental', () => {
    render(<BookingForm car={car} onSubmit={vi.fn()} />);
    fillDates('2099-01-10', '2099-01-11');
    expect(screen.getByText(/for 1 day$/)).toBeInTheDocument();
  });

  it('requires a phone number', async () => {
    const onSubmit = vi.fn();
    render(<BookingForm car={car} onSubmit={onSubmit} />);
    fillDates('2099-01-10', '2099-01-13');
    await submit();
    expect(screen.getByRole('alert')).toHaveTextContent(/phone number/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects an invalid phone number', async () => {
    const onSubmit = vi.fn();
    render(<BookingForm car={car} onSubmit={onSubmit} />);
    fillDates('2099-01-10', '2099-01-13');
    fillPhone('12345');
    await submit();
    expect(screen.getByRole('alert')).toHaveTextContent(/valid kenyan phone number/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the booking details with a normalised phone number and notes', async () => {
    const onSubmit = vi.fn();
    render(<BookingForm car={car} onSubmit={onSubmit} />);
    fillDates('2099-01-10', '2099-01-13');
    fillPhone('0712 345 678');
    await userEvent.type(screen.getByLabelText('Notes (optional)'), '  Airport pickup  ');
    await submit();
    expect(onSubmit).toHaveBeenCalledWith({
      startDate: '2099-01-10',
      endDate: '2099-01-13',
      totalPrice: 13500,
      phone: '+254712345678',
      notes: 'Airport pickup',
    });
  });

  it('shows an error passed from the parent', () => {
    render(<BookingForm car={car} onSubmit={vi.fn()} serverError="Boom" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
  });

  it('disables the button while saving', () => {
    render(<BookingForm car={car} onSubmit={vi.fn()} submitting />);
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });
});