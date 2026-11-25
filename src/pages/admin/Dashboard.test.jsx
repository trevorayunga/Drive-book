import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDays } from '../../lib/bookingLogic';
import { todayLocal } from '../../lib/revenue';
import { getAllBookings } from '../../services/bookings';
import { getCars } from '../../services/cars';
import Dashboard from './Dashboard';

vi.mock('../../services/cars', () => ({ getCars: vi.fn() }));
vi.mock('../../services/bookings', () => ({ getAllBookings: vi.fn() }));

const cars = [{ id: 'c1' }, { id: 'c2' }];
const bookings = [
  { id: 'b1', carName: 'Toyota Corolla', userName: 'Trevor', startDate: '2099-01-01', endDate: '2099-01-03', totalPrice: 9000, status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-20' },
  { id: 'b2', carName: 'Nissan X-Trail', userName: 'Amina', startDate: '2099-02-01', endDate: '2099-02-02', totalPrice: 6000, status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-20' },
  { id: 'b3', carName: 'Toyota Prado', userName: 'Joseph', startDate: '2099-03-01', endDate: '2099-03-04', totalPrice: 12000, status: 'confirmed' },
  { id: 'b4', carName: 'Audi SQ5', userName: 'Mary', startDate: '2099-04-01', endDate: '2099-04-02', totalPrice: 45000, status: 'cancelled', paymentStatus: 'paid', paidDate: '2026-11-21' },
  { id: 'b5', carName: 'Toyota Noah', userName: 'Peter', startDate: '2099-05-01', endDate: '2099-05-03', totalPrice: 10000, status: 'confirmed', paymentStatus: 'paid', paidDate: '2026-11-21' },
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
  getCars.mockResolvedValue(cars);
  getAllBookings.mockResolvedValue(bookings);
});

describe('Dashboard', () => {
  it('shows the statistics with revenue from paid bookings only', async () => {
    renderPage();
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    await screen.findByRole('heading', { name: 'Admin dashboard' });
    expect(valueOf('Total cars')).toHaveTextContent(/^2$/);
    expect(valueOf('Total bookings')).toHaveTextContent(/^5$/);
    expect(valueOf('Active bookings')).toHaveTextContent(/^4$/);
    expect(valueOf('Cancelled bookings')).toHaveTextContent(/^1$/);
    expect(valueOf('Revenue')).toHaveTextContent('KES 25,000');
  });

  it('links to the manage pages', async () => {
    renderPage();
    expect(await screen.findByRole('link', { name: 'Manage cars' })).toHaveAttribute('href', '/admin/cars');
    expect(screen.getByRole('link', { name: 'Manage bookings' })).toHaveAttribute('href', '/admin/bookings');
  });

  it('shows revenue for each day with a total', async () => {
    renderPage();
    expect(await screen.findByRole('row', { name: /2026-11-20/ })).toHaveTextContent('KES 15,000');
    expect(screen.getByRole('row', { name: /2026-11-21/ })).toHaveTextContent('KES 10,000');
    expect(screen.getByRole('row', { name: /Total/ })).toHaveTextContent('KES 25,000');
  });

  it('filters the revenue by date', async () => {
    renderPage();
    await screen.findByRole('row', { name: /2026-11-20/ });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-11-21' } });
    expect(screen.queryByRole('row', { name: /2026-11-20/ })).not.toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Total/ })).toHaveTextContent('KES 10,000');
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-11-20' } });
    expect(screen.getByText('No paid bookings in this period.')).toBeInTheDocument();
  });

  it('fills the dates from the quick buttons', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Revenue by day' });
    const today = todayLocal();

    await userEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByLabelText('From')).toHaveValue(today);
    expect(screen.getByLabelText('To')).toHaveValue(today);

    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    expect(screen.getByLabelText('From')).toHaveValue(addDays(today, -6));

    await userEvent.click(screen.getByRole('button', { name: 'This month' }));
    expect(screen.getByLabelText('From')).toHaveValue(`${today.slice(0, 7)}-01`);

    await userEvent.click(screen.getByRole('button', { name: 'All time' }));
    expect(screen.getByLabelText('From')).toHaveValue('');
    expect(screen.getByLabelText('To')).toHaveValue('');
  });

  it('lists recent bookings with the newest first', async () => {
    renderPage();
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent('Toyota Noah');
    expect(items[4]).toHaveTextContent('Toyota Corolla');
  });

  it('shows empty messages when there are no bookings', async () => {
    getCars.mockResolvedValue([]);
    getAllBookings.mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('No bookings yet.')).toBeInTheDocument();
    expect(screen.getByText('No paid bookings in this period.')).toBeInTheDocument();
  });

  it('shows an error when the data cannot be loaded', async () => {
    getCars.mockRejectedValue(new Error('fail'));
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load dashboard data/i);
  });
});