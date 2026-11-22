import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">
          DriveBook
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cars" className="text-sm hover:underline">
            Cars
          </Link>
          {user ? (
            <>
              <Link to="/bookings" className="text-sm hover:underline">
                My Bookings
              </Link>
              <span className="text-sm text-slate-300">
                {user.displayName || user.email}
              </span>
              <button
                onClick={logout}
                className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-500"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}