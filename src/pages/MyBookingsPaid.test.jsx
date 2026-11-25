import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { getUserBookings } from '../services/bookings';
import MyBookings from './MyBookings';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'u1' } }),
}));
vi.mock('../services/bookings', () => ({
  getUserBookings: vi.fn(),
  cancelBooking: vi.fn(),
}));

describe('MyBookings paid bookings', () => {
  it('shows paid bookings as paid and does not offer to cancel them', async () => {
    getUserBookings.mockResolvedValue([
      {
        id: 'b1',
        carName: 'Toyota Corolla',
        startDate: '2099-01-01',
        endDate: '2099-01-03',
        totalPrice: 9000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paidDate: '2099-01-01',
      },
    ]);
    render(
      <MemoryRouter>
        <MyBookings />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Paid in full/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel booking' })).not.toBeInTheDocument();
  });
});