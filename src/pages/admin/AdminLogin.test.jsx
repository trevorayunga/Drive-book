import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminLogin } from '../../services/admin';
import AdminLogin from './AdminLogin';

vi.mock('../../services/admin', () => ({ adminLogin: vi.fn() }));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/login']}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<p>Admin home</p>} />
      </Routes>
    </MemoryRouter>
  );

const fillAndSubmit = async () => {
  await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('AdminLogin', () => {
  it('logs in and goes to the dashboard', async () => {
    adminLogin.mockResolvedValue({ uid: 'a1' });
    renderPage();
    await fillAndSubmit();
    expect(adminLogin).toHaveBeenCalledWith('admin@example.com', 'secret123');
    expect(await screen.findByText('Admin home')).toBeInTheDocument();
  });

  it('shows a message when the account is not an admin', async () => {
    adminLogin.mockRejectedValue(new Error('not-admin'));
    renderPage();
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/does not have admin access/i);
  });

  it('shows a message when the credentials are wrong', async () => {
    adminLogin.mockRejectedValue(new Error('auth/wrong-password'));
    renderPage();
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i);
  });
});