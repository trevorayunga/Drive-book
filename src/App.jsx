import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Book from './pages/Book';
import MyBookings from './pages/MyBookings';
import Policy from './pages/Policy';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageBookings from './pages/admin/ManageBookings';
import { ProtectedRoute } from './context/AuthContext';
import { AdminRoute } from './context/AdminRoute';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route
            path="/cars/:id/book"
            element={
              <ProtectedRoute>
                <Book />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/cars"
            element={
              <AdminRoute>
                <ManageCars />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <ManageBookings />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}