import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithPopup, signOut } from 'firebase/auth';
import { AuthProvider, ProtectedRoute, useAuth } from './AuthContext';

let mockUser = null;

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, callback) => {
    callback(mockUser);
    return () => {};
  },
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../firebase', () => ({
  auth: {},
  googleProvider: { name: 'google' },
}));

function Buttons() {
  const { loginWithGoogle, logout } = useAuth();
  return (
    <>
      <button onClick={loginWithGoogle}>google</button>
      <button onClick={logout}>logout</button>
    </>
  );
}

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <p>Secret content</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUser = null;
  });

  it('redirects to login when signed out', () => {
    renderProtected();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('shows content when signed in', () => {
    mockUser = { uid: 'u1' };
    renderProtected();
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });
});

describe('AuthProvider actions', () => {
  it('calls Firebase for sign in and sign out', async () => {
    render(
      <AuthProvider>
        <Buttons />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('google'));
    await userEvent.click(screen.getByText('logout'));

    expect(signInWithPopup).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});