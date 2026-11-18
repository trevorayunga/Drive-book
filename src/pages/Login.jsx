import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch {
      setError('Sign in failed. Please try again.');
    }
  };

  return (
    <section className="mx-auto max-w-sm rounded-lg bg-white p-8 text-center shadow">
      <h1 className="text-2xl font-bold">Welcome to DriveBook</h1>
      <p className="mt-2 text-slate-600">Sign in to book a car.</p>
      <button
        onClick={handleLogin}
        className="mt-6 w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500"
      >
        Sign in with Google
      </button>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}