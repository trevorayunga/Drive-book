import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

let mockAuth;
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('shows a login link when signed out', () => {
    mockAuth = { user: null, logout: vi.fn() };
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.queryByText('My Bookings')).not.toBeInTheDocument();
  });

  it('shows the user, bookings link and logout when signed in', async () => {
    const logout = vi.fn();
    mockAuth = { user: { displayName: 'Trevor' }, logout };
    renderNavbar();
    expect(screen.getByText('Trevor')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Bookings' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Log out' }));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('falls back to the email when there is no display name', () => {
    mockAuth = { user: { email: 'a@b.com' }, logout: vi.fn() };
    renderNavbar();
    expect(screen.getByText('a@b.com')).toBeInTheDocument();
  });
});