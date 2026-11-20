import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingForm from './BookingForm';

describe('BookingForm deposit', () => {
  it('shows the security deposit once the dates are valid', () => {
    render(<BookingForm car={{ pricePerDay: 4500 }} onSubmit={vi.fn()} />);
    expect(screen.queryByText(/security deposit/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Pickup date'), { target: { value: '2099-01-10' } });
    fireEvent.change(screen.getByLabelText('Return date'), { target: { value: '2099-01-13' } });
    expect(screen.getByText(/security deposit \(30%\): KES 4,050/i)).toBeInTheDocument();
  });
});