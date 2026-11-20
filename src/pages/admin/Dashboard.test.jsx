import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllBookings } from '../../services/bookings';
import { getCars } from '../../services/cars';
import Dashboard from './Dashboard';

vi.mock('../../services/cars', () => ({ getCars: vi.fn() }));
vi.mock('../../services/bookings', () => ({ getAllBookings: vi.fn() }));

const cars = [{ id: 'c1' }, { id: 'c2' }];
const bookings = [
  { id: 'b1', carName: 'Toyota Corolla', userName: 'Trevor', startDate: '2099-01-01', endDate: '2099-01-03', totalPrice: 9000, status: 'confirmed' },
  { id: 'b2', carName: 'Nissan X-Trail', userName: 'Amina', startDate: '2099-02-01', endDate: '2099-02-02', totalPrice: 6000, status: 'confirmed' },
  { id: 'b3', carName: 'Toyota Prado', userName: 'Joseph', startDate: '2099-03-01', endDate: '2099-03-04', totalPrice: 45000, status: 'cancelled' },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

const valueOf = (label) => screen.getByText(label).nextElementSibling;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Dashboard', () => {
  it('shows the statistics', async () => {
    getCars.mockResolvedValue(cars);
    getAllBookings.mockResolvedValue(bookings);
    renderPage();
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    await screen.findByRole('heading', { name: 'Admin dashboard' });
    expect(valueOf('Total cars')).toHaveTextContent(/^2$/);
    expect(valueOf('Total bookings')).toHaveTextContent(/^3$/);
    expect(valueOf('Active bookings')).toHaveTextContent(/^2$/);
    expect(valueOf('Cancelled bookings')).toHaveTextContent(/^1$/);
    expect(valueOf('Revenue')).toHaveTextContent('KES 15,000');
  });

  it('links to the manage pages', async () => {
    getCars.mockResolvedValue(cars);
    getAllBookings.mockResolvedValue(bookings);
    renderPage();
    expect(await screen.findByRole('link', { name: 'Manage cars' })).toHaveAttribute('href', '/admin/cars');
    expect(screen.getByRole('link', { name: 'Manage bookings' })).toHaveAttribute('href', '/admin/bookings');
  });

  it('lists recent bookings with the newest first', async () => {
    getCars.mockResolvedValue(cars);
    getAllBookings.mockResolvedValue(bookings);
    renderPage();
    const items = await screen.findAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Toyota Prado');
    expect(items[2]).toHaveTextContent('Toyota Corolla');
  });

  it('shows an empty message when there are no bookings', async () => {
    getCars.mockResolvedValue([]);
    getAllBookings.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('No bookings yet.')).toBeInTheDocument();
  });

  it('shows an error when the data cannot be loaded', async () => {
    getCars.mockRejectedValue(new Error('fail'));
    getAllBookings.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load dashboard data/i);
  });
});