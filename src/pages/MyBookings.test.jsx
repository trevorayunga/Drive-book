import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cancelBooking, getUserBookings } from '../services/bookings';
import MyBookings from './MyBookings';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'u1' } }),
}));
vi.mock('../services/bookings', () => ({
  getUserBookings: vi.fn(),
  cancelBooking: vi.fn(),
}));

const confirmed = {
  id: 'b1',
  carName: 'Toyota Corolla',
  startDate: '2099-01-01',
  endDate: '2099-01-03',
  totalPrice: 9000,
  status: 'confirmed',
};
const cancelled = {
  id: 'b2',
  carName: 'Nissan X-Trail',
  startDate: '2099-02-01',
  endDate: '2099-02-03',
  totalPrice: 17000,
  status: 'cancelled',
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <MyBookings />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.resetAllMocks();
});

describe('MyBookings', () => {
  it('lists bookings with the newest first', async () => {
    getUserBookings.mockResolvedValue([confirmed, cancelled]);
    renderPage();
    expect(screen.getByText(/loading bookings/i)).toBeInTheDocument();
    const items = await screen.findAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Nissan X-Trail');
    expect(items[1]).toHaveTextContent('Toyota Corolla');
    expect(screen.getByText('KES 9,000 ·', { exact: false })).toBeInTheDocument();
  });

  it('only offers cancel for confirmed bookings', async () => {
    getUserBookings.mockResolvedValue([confirmed, cancelled]);
    renderPage();
    await screen.findAllByRole('listitem');
    expect(screen.getAllByRole('button', { name: 'Cancel booking' })).toHaveLength(1);
  });

  it('shows an empty state with a link to the cars', async () => {
    getUserBookings.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText(/no bookings yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse cars' })).toHaveAttribute('href', '/cars');
  });

  it('cancels a booking', async () => {
    getUserBookings.mockResolvedValue([confirmed]);
    cancelBooking.mockResolvedValue();
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel booking' }));
    expect(cancelBooking).toHaveBeenCalledWith('b1');
    expect(await screen.findByText('cancelled')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel booking' })).not.toBeInTheDocument();
  });

  it('shows an error when cancelling fails', async () => {
    getUserBookings.mockResolvedValue([confirmed]);
    cancelBooking.mockRejectedValue(new Error('fail'));
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel booking' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not cancel/i);
  });

  it('shows an error when bookings cannot be loaded', async () => {
    getUserBookings.mockRejectedValue(new Error('fail'));
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load your bookings/i);
  });
});