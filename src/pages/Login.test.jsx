import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

let mockAuth;
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/" element={<p>Home page</p>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>
  );

describe('Login', () => {
  it('calls loginWithGoogle when the button is clicked', async () => {
    const loginWithGoogle = vi.fn().mockResolvedValue();
    mockAuth = { user: null, loginWithGoogle };
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    expect(loginWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('shows an error when sign in fails', async () => {
    mockAuth = { user: null, loginWithGoogle: vi.fn().mockRejectedValue(new Error('x')) };
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/sign in failed/i);
  });

  it('redirects home when already signed in', () => {
    mockAuth = { user: { uid: 'u1' }, loginWithGoogle: vi.fn() };
    renderLogin();
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});