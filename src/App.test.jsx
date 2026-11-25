import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

let mockUser = null;

vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, loginWithGoogle: vi.fn(), logout: vi.fn() }),
  ProtectedRoute: ({ children }) => children,
}));

vi.mock('./context/AdminRoute', () => ({
  AdminRoute: ({ children }) => children,
}));

vi.mock('./services/admin', () => ({
  adminLogin: vi.fn(),
  isAdmin: vi.fn(),
}));

vi.mock('./services/cars', () => ({
  getCars: vi.fn().mockResolvedValue([]),
  getCar: vi.fn().mockResolvedValue(null),
  addCar: vi.fn(),
  updateCar: vi.fn(),
  deleteCar: vi.fn(),
}));

vi.mock('./services/bookings', () => ({
  getUserBookings: vi.fn().mockResolvedValue([]),
  getBookingsForCar: vi.fn().mockResolvedValue([]),
  getAllBookings: vi.fn().mockResolvedValue([]),
   getAllContacts: vi.fn().mockResolvedValue({}),
  createBooking: vi.fn(),
  cancelBooking: vi.fn(),
  setBookingStatus: vi.fn(),
  markBookingPaid: vi.fn(),
  markBookingUnpaid: vi.fn(),
}));

vi.mock('./services/holidays', () => ({
  getHolidays: vi.fn().mockResolvedValue([]),
}));

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe('App routing', () => {
  beforeEach(() => {
    mockUser = null;
  });

  it('renders the home page', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /rent a car/i })).toBeInTheDocument();
  });

  it('shows the footer on every page', () => {
    renderAt('/');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the login page', () => {
    renderAt('/login');
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('renders the rental policy page', () => {
    renderAt('/policy');
    expect(screen.getByRole('heading', { name: 'Rental policy' })).toBeInTheDocument();
  });

  it('renders the cars page', async () => {
    renderAt('/cars');
    expect(await screen.findByRole('heading', { name: /available cars/i })).toBeInTheDocument();
  });

  it('renders the car details page', async () => {
    renderAt('/cars/c1');
    expect(await screen.findByRole('alert')).toHaveTextContent('Car not found.');
  });

  it('renders the bookings page', async () => {
    mockUser = { uid: 'u1' };
    renderAt('/bookings');
    expect(await screen.findByRole('heading', { name: /my bookings/i })).toBeInTheDocument();
  });

  it('renders the booking page', async () => {
    mockUser = { uid: 'u1' };
    renderAt('/cars/c1/book');
    expect(await screen.findByRole('alert')).toHaveTextContent('Car not found.');
  });

  it('renders the admin login page', () => {
    renderAt('/admin/login');
    expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
  });

  it('renders the admin dashboard', async () => {
    renderAt('/admin');
    expect(await screen.findByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
  });

  it('renders the admin manage cars page', async () => {
    renderAt('/admin/cars');
    expect(await screen.findByRole('heading', { name: /manage cars/i })).toBeInTheDocument();
  });

  it('renders the admin manage bookings page', async () => {
    renderAt('/admin/bookings');
    expect(await screen.findByRole('heading', { name: /manage bookings/i })).toBeInTheDocument();
  });
});