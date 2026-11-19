import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBooking, getBookingsForCar } from '../services/bookings';
import { getCar } from '../services/cars';
import { getHolidays } from '../services/holidays';
import Book from './Book';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'u1', displayName: 'Trevor' } }),
}));
vi.mock('../services/cars', () => ({ getCar: vi.fn() }));
vi.mock('../services/holidays', () => ({ getHolidays: vi.fn() }));
vi.mock('../services/bookings', () => ({
  getBookingsForCar: vi.fn(),
  createBooking: vi.fn(),
}));

const car = {
  id: 'c1',
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  type: 'Sedan',
  seats: 5,
  pricePerDay: 4500,
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/cars/c1/book']}>
      <Routes>
        <Route path="/cars/:id/book" element={<Book />} />
        <Route path="/bookings" element={<p>Bookings page</p>} />
      </Routes>
    </MemoryRouter>
  );

const fillDates = (start, end) => {
  fireEvent.change(screen.getByLabelText('Pickup date'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('Return date'), { target: { value: end } });
};

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Confirm booking' }));

beforeEach(() => {
  vi.resetAllMocks();
  getCar.mockResolvedValue(car);
  getHolidays.mockResolvedValue([]);
  getBookingsForCar.mockResolvedValue([]);
  createBooking.mockResolvedValue('b1');
});

describe('Book page', () => {
  it('shows the car being booked', async () => {
    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Book Toyota Corolla' })).toBeInTheDocument();
  });

  it('still loads when the holidays service fails', async () => {
    getHolidays.mockRejectedValue(new Error('down'));
    renderPage();
    expect(await screen.findByRole('heading', { name: 'Book Toyota Corolla' })).toBeInTheDocument();
  });

  it('shows a message when the car is not found', async () => {
    getCar.mockResolvedValue(null);
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent('Car not found.');
  });

  it('shows a message when the car cannot be loaded', async () => {
    getCar.mockRejectedValue(new Error('fail'));
    renderPage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load the car/i);
  });

  it('saves the booking and goes to My Bookings', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Book Toyota Corolla' });
    fillDates('2099-01-10', '2099-01-13');
    await submit();
    expect(createBooking).toHaveBeenCalledWith({
      userId: 'u1',
      userName: 'Trevor',
      carId: 'c1',
      carName: 'Toyota Corolla',
      startDate: '2099-01-10',
      endDate: '2099-01-13',
      totalPrice: 13500,
    });
    expect(await screen.findByText('Bookings page')).toBeInTheDocument();
  });

  it('blocks a booking that overlaps an existing one', async () => {
    getBookingsForCar.mockResolvedValue([
      { carId: 'c1', startDate: '2099-01-09', endDate: '2099-01-12', status: 'confirmed' },
    ]);
    renderPage();
    await screen.findByRole('heading', { name: 'Book Toyota Corolla' });
    fillDates('2099-01-10', '2099-01-13');
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/already booked/i);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it('shows an error when saving fails', async () => {
    createBooking.mockRejectedValue(new Error('fail'));
    renderPage();
    await screen.findByRole('heading', { name: 'Book Toyota Corolla' });
    fillDates('2099-01-10', '2099-01-13');
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not save/i);
  });
});