import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({ user: null, loginWithGoogle: vi.fn(), logout: vi.fn() }),
  ProtectedRoute: ({ children }) => children,
}));

vi.mock('./services/cars', () => ({
  getCars: vi.fn().mockResolvedValue([]),
}));

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe('App routing', () => {
  it('renders the home page', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /rent a car/i })).toBeInTheDocument();
  });

  it('renders the login page', () => {
    renderAt('/login');
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('renders the bookings page', () => {
    renderAt('/bookings');
    expect(screen.getByRole('heading', { name: /my bookings/i })).toBeInTheDocument();
  });

  it('renders the cars page', async () => {
    renderAt('/cars');
    expect(await screen.findByRole('heading', { name: /available cars/i })).toBeInTheDocument();
  });
});