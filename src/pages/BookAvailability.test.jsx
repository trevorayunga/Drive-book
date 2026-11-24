import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBookingsForCar } from '../services/bookings';
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
const booked = [
  { carId: 'c1', startDate: '2099-01-09', endDate: '2099-01-12', status: 'confirmed' },
];

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/cars/c1/book']}>
      <Routes>
        <Route path="/cars/:id/book" element={<Book />} />
      </Routes>
    </MemoryRouter>
  );

const fillDates = (start, end) => {
  fireEvent.change(screen.getByLabelText('Pickup date'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('Return date'), { target: { value: end } });
};

beforeEach(() => {
  vi.resetAllMocks();
  getCar.mockResolvedValue(car);
  getHolidays.mockResolvedValue([]);
  getBookingsForCar.mockResolvedValue([]);
});

describe('Book page availability', () => {
  it('lists the dates the car is already booked', async () => {
    getBookingsForCar.mockResolvedValue(booked);
    renderPage();
    expect(await screen.findByText('2099-01-09 to 2099-01-12')).toBeInTheDocument();
    expect(screen.getByText(/already booked on/i)).toBeInTheDocument();
  });

  it('shows no booked dates box when the car is free', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Book Toyota Corolla' });
    expect(screen.queryByText(/already booked on/i)).not.toBeInTheDocument();
  });

  it('warns and blocks the button when the chosen dates clash', async () => {
    getBookingsForCar.mockResolvedValue(booked);
    renderPage();
    await screen.findByText('2099-01-09 to 2099-01-12');
    fillDates('2099-01-10', '2099-01-13');
    expect(await screen.findByRole('alert')).toHaveTextContent(/already booked from 2099-01-09/);
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeDisabled();
  });

  it('says the car is available when the dates are free', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Book Toyota Corolla' });
    fillDates('2099-03-10', '2099-03-12');
    expect(await screen.findByRole('status')).toHaveTextContent('available');
  });

  it('still loads the page when the bookings cannot be read', async () => {
    getBookingsForCar.mockRejectedValue(new Error('denied'));
    renderPage();
    expect(await screen.findByRole('heading', { name: 'Book Toyota Corolla' })).toBeInTheDocument();
    expect(screen.queryByText(/already booked on/i)).not.toBeInTheDocument();
  });
});