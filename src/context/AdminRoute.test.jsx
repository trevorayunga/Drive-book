import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdmin } from '../services/admin';
import { AdminRoute } from './AdminRoute';

let mockAuth;
vi.mock('./AuthContext', () => ({ useAuth: () => mockAuth }));
vi.mock('../services/admin', () => ({ isAdmin: vi.fn() }));

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin/login" element={<p>Admin login page</p>} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <p>Admin area</p>
            </AdminRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.resetAllMocks();
});

describe('AdminRoute', () => {
  it('shows a message while auth is loading', () => {
    mockAuth = { user: null, loading: true };
    renderRoute();
    expect(screen.getByText('Checking access...')).toBeInTheDocument();
  });

  it('redirects to admin login when signed out', () => {
    mockAuth = { user: null, loading: false };
    renderRoute();
    expect(screen.getByText('Admin login page')).toBeInTheDocument();
  });

  it('shows the content for an admin', async () => {
    mockAuth = { user: { uid: 'a1' }, loading: false };
    isAdmin.mockResolvedValue(true);
    renderRoute();
    expect(screen.getByText('Checking access...')).toBeInTheDocument();
    expect(await screen.findByText('Admin area')).toBeInTheDocument();
  });

  it('redirects a signed-in user who is not an admin', async () => {
    mockAuth = { user: { uid: 'u1' }, loading: false };
    isAdmin.mockResolvedValue(false);
    renderRoute();
    expect(await screen.findByText('Admin login page')).toBeInTheDocument();
  });

  it('redirects when the admin check fails', async () => {
    mockAuth = { user: { uid: 'u1' }, loading: false };
    isAdmin.mockRejectedValue(new Error('fail'));
    renderRoute();
    expect(await screen.findByText('Admin login page')).toBeInTheDocument();
  });
});